import type { RespectifyConfig } from './config';
import { loadRespectifyConfig } from './config';
import { RESPECTIFY_API_KEY, RESPECTIFY_EMAIL } from 'astro:env/server';
import {
	RespectifyClient,
	type CommentScore,
	AuthenticationError,
	PaymentRequiredError,
	RespectifyError
} from '@respectify/client';
import { logger } from '../logger';

export interface RespectifyAnalysisResult {
	score: number;
	approved: boolean;
	feedback: string;
	suggestion?: string | undefined;
	// Extended SDK data
	commentScore?: CommentScore;
	isSpam?: boolean;
	spamConfidence?: number;
}

// Singleton client instance
let client: RespectifyClient | null = null;

// Simple in-memory cache for article IDs (keyed by postSlug)
const articleIdCache = new Map<string, string>();

function getRespectifyClient(): RespectifyClient {
	if (!client) {
		if (!RESPECTIFY_EMAIL || !RESPECTIFY_API_KEY) {
			throw new Error('Respectify credentials not configured');
		}

		client = new RespectifyClient({
			email: RESPECTIFY_EMAIL,
			apiKey: RESPECTIFY_API_KEY,
		});
	}
	return client;
}

/**
 * Initialize or retrieve a Respectify article ID for a blog post
 * Uses the post URL to create a topic context
 */
async function getOrInitializeArticleId(postSlug: string): Promise<string> {
	// Check cache first
	const cached = articleIdCache.get(postSlug);
	if (cached) {
		logger.debug('Using cached article ID', { postSlug, articleId: cached.substring(0, 8) });
		return cached;
	}

	// Initialize topic from the post URL
	const client = getRespectifyClient();
	const postUrl = `https://nickhodges.com/posts/${postSlug}/`;

	try {
		logger.debug('Initializing Respectify topic', { postSlug, postUrl });
		const result = await client.initTopicFromUrl(postUrl, `Blog post: ${postSlug}`);
		const articleId = result.article_id;

		// Cache for future use
		articleIdCache.set(postSlug, articleId);
		logger.info('Initialized Respectify topic', {
			postSlug,
			articleId: articleId.substring(0, 8) + '...'
		});

		return articleId;
	} catch (error) {
		logger.error('Failed to initialize Respectify topic', { postSlug, error });
		throw error;
	}
}

export async function verifyRespectifyCredentials(): Promise<boolean> {
	try {
		const client = getRespectifyClient();
		const result = await client.checkUserCredentials();

		if (result.active) {
			logger.info('Respectify credentials verified successfully', {
				status: result.status,
				plan: result.plan_name
			});
			return true;
		} else {
			logger.error('Respectify subscription not active', {
				status: result.status,
				error: result.error
			});
			return false;
		}
	} catch (error) {
		if (error instanceof AuthenticationError) {
			logger.error('Respectify authentication failed - invalid credentials', { error });
		} else if (error instanceof RespectifyError) {
			logger.error('Respectify credential verification error', {
				statusCode: error.statusCode,
				message: error.message
			});
		} else {
			logger.error('Respectify credential verification error', { error });
		}
		return false;
	}
}

export async function analyzeComment(
	text: string,
	postSlug?: string
): Promise<RespectifyAnalysisResult> {
	const config: RespectifyConfig = loadRespectifyConfig();

	if (!config.enabled) {
		// If Respectify is disabled, auto-approve everything
		return {
			score: 1.0,
			approved: true,
			feedback: config.feedback.approved,
		};
	}

	try {
		const client = getRespectifyClient();

		logger.debug('Analyzing comment with Respectify', {
			textLength: text.length,
			hasPostSlug: !!postSlug
		});

		// Get or initialize the Respectify article ID for this post
		let respectifyArticleId: string | undefined;
		if (postSlug) {
			try {
				respectifyArticleId = await getOrInitializeArticleId(postSlug);
			} catch (error) {
				logger.warn('Could not initialize article ID, falling back to spam-only check', {
					postSlug,
					error
				});
			}
		}

		// Use megacall to get both spam and comment scoring in one API call
		// Note: Comment scoring requires a Respectify article ID
		const megacallOptions: {
			comment: string;
			articleId?: string;
			includeSpam: boolean;
			includeCommentScore?: boolean;
		} = {
			comment: text,
			includeSpam: true,
		};

		// Only include comment scoring if we have a Respectify article ID
		if (respectifyArticleId) {
			megacallOptions.articleId = respectifyArticleId;
			megacallOptions.includeCommentScore = true;
		}

		const result = await client.megacall(megacallOptions);

		logger.debug('Respectify analysis result', {
			isSpam: result.spam_check?.is_spam,
			spamConfidence: result.spam_check?.confidence,
			overallScore: result.comment_score?.overall_score,
			toxicityScore: result.comment_score?.toxicity_score,
		});

		// Check spam first - if it's spam, reject immediately
		if (result.spam_check?.is_spam) {
			return {
				score: 0,
				approved: false,
				feedback: 'This comment appears to be spam.',
				isSpam: true,
				spamConfidence: result.spam_check.confidence,
			};
		}

		// If we have comment scoring, use toxicity score as our primary metric
		let respectfulnessScore = 0.5; // Default neutral score

		if (result.comment_score) {
			// Use toxicity score (0-1, lower is better) as our primary metric
			const toxicityScore = result.comment_score.toxicity_score ?? 0;
			// Convert toxicity (0=good, 1=bad) to respectfulness (1=good, 0=bad)
			respectfulnessScore = 1.0 - toxicityScore;
		} else {
			// No comment scoring available (spam check only)
			// If it's not spam, give it a passing score
			respectfulnessScore = config.thresholds.autoApprove;
			logger.debug('No comment score available, using default approval', {
				defaultScore: respectfulnessScore
			});
		}

		// Determine approval status and feedback based on thresholds
		let approved = false;
		let feedback = '';

		if (respectfulnessScore >= config.thresholds.autoApprove) {
			approved = true;
			feedback = config.feedback.approved;
			logger.info('Comment auto-approved', { respectfulnessScore });
		} else if (respectfulnessScore < config.thresholds.block && config.moderation.blockDisrespectful) {
			approved = false;
			feedback = config.feedback.blocked;
			logger.info('Comment blocked - below threshold', { respectfulnessScore, threshold: config.thresholds.block });
		} else if (respectfulnessScore < config.thresholds.warn) {
			approved = config.moderation.allowOverride;
			feedback = config.feedback.warning;
			logger.info('Comment flagged - warning threshold', { respectfulnessScore, approved, allowOverride: config.moderation.allowOverride });
		} else {
			approved = config.moderation.allowOverride;
			feedback = config.feedback.warning;
			logger.info('Comment flagged - moderate warning', { respectfulnessScore, approved, allowOverride: config.moderation.allowOverride });
		}

		// Build suggestion from SDK's rich data
		let suggestion: string | undefined;
		if (result.comment_score) {
			const suggestions: string[] = [];

			if (result.comment_score.toxicity_explanation) {
				suggestions.push(result.comment_score.toxicity_explanation);
			}

			if (result.comment_score.logical_fallacies.length > 0) {
				suggestions.push(
					`Logical fallacies detected: ${result.comment_score.logical_fallacies
						.map(f => f.fallacy_name)
						.join(', ')}`
				);
			}

			if (result.comment_score.objectionable_phrases.length > 0) {
				suggestions.push(
					`Objectionable phrases found: ${result.comment_score.objectionable_phrases.length} issue(s)`
				);
			}

			if (suggestions.length > 0) {
				suggestion = suggestions.join(' ');
			}
		}

		const analysisResult: RespectifyAnalysisResult = {
			score: respectfulnessScore,
			approved,
			feedback,
		};

		if (suggestion) {
			analysisResult.suggestion = suggestion;
		}

		if (result.comment_score) {
			analysisResult.commentScore = result.comment_score;
		}

		if (result.spam_check?.is_spam !== undefined) {
			analysisResult.isSpam = result.spam_check.is_spam;
		}

		if (result.spam_check?.confidence !== undefined) {
			analysisResult.spamConfidence = result.spam_check.confidence;
		}

		return analysisResult;
	} catch (error) {
		// Fail closed: reject comment if Respectify is unavailable
		if (error instanceof AuthenticationError) {
			logger.error('Respectify authentication failed', { error });
		} else if (error instanceof PaymentRequiredError) {
			logger.error('Respectify subscription required', { error });
		} else if (error instanceof RespectifyError) {
			logger.error('Respectify API error', {
				statusCode: error.statusCode,
				message: error.message
			});
		} else {
			logger.error('Respectify analysis failed', { error });
		}

		return {
			score: 0,
			approved: false,
			feedback:
				'Comment analysis service is temporarily unavailable. Please try again later.',
		};
	}
}
