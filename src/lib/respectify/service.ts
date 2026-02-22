import type { RespectifyConfig } from './config';
import { loadRespectifyConfig } from './config';
import { RESPECTIFY_API_KEY, RESPECTIFY_EMAIL } from 'astro:env/server';

export interface RespectifyAnalysisResult {
	score: number;
	approved: boolean;
	feedback: string;
	suggestion?: string | undefined;
}

export interface RespectifyResponse {
	respectfulness_score: number;
	analysis: string;
	suggestions?: string;
}

export async function verifyRespectifyCredentials(): Promise<boolean> {
	try {
		const response = await fetch('https://app.respectify.ai/v0.2/usercheck', {
			method: 'GET',
			headers: {
				'X-User-Email': RESPECTIFY_EMAIL || '',
				'X-API-Key': RESPECTIFY_API_KEY || '',
			},
		});

		if (response.ok) {
			console.log('Respectify credentials verified successfully');
			return true;
		} else {
			const errorText = await response.text();
			console.error(`Respectify credential verification failed (${response.status}):`, errorText);
			return false;
		}
	} catch (error) {
		console.error('Respectify credential verification error:', error);
		return false;
	}
}

export async function analyzeComment(text: string): Promise<RespectifyAnalysisResult> {
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
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
		};

		// Add Respectify authentication headers per official docs
		if (config.requiresAuth && RESPECTIFY_EMAIL && RESPECTIFY_API_KEY) {
			headers['X-User-Email'] = RESPECTIFY_EMAIL;
			headers['X-API-Key'] = RESPECTIFY_API_KEY;
		} else if (config.requiresAuth) {
			console.warn('Respectify requiresAuth is true but credentials not found');
		}

		const requestBody = {
			comment: text,
			article_context_id: 'blog-comment'
		};

		console.log('Respectify API request:', {
			url: config.apiEndpoint,
			method: 'POST',
			headers: {
				'Content-Type': headers['Content-Type'],
				'X-User-Email': headers['X-User-Email'],
				'X-API-Key': headers['X-API-Key'] ? '***' : undefined
			},
			body: requestBody
		});

		const response = await fetch(config.apiEndpoint, {
			method: 'POST',
			headers,
			body: JSON.stringify(requestBody),
		});

		console.log('Respectify API response:', {
			status: response.status,
			statusText: response.statusText,
			headers: Object.fromEntries(response.headers.entries())
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Respectify API error ${response.status}:`, errorText);
			throw new Error(`Respectify API error: ${response.status}`);
		}

		const data: RespectifyResponse = await response.json();
		const score = data.respectfulness_score;

		// Determine approval status and feedback based on thresholds
		let approved = false;
		let feedback = '';

		if (score >= config.thresholds.autoApprove) {
			approved = true;
			feedback = config.feedback.approved;
		} else if (score < config.thresholds.block && config.moderation.blockDisrespectful) {
			approved = false;
			feedback = config.feedback.blocked;
		} else if (score < config.thresholds.warn) {
			approved = config.moderation.allowOverride;
			feedback = config.feedback.warning;
		} else {
			approved = config.moderation.allowOverride;
			feedback = config.feedback.warning;
		}

		return {
			score,
			approved,
			feedback,
			suggestion: data.suggestions,
		};
	} catch (error) {
		// Fail closed: reject comment if Respectify is unavailable
		console.error('Respectify analysis failed:', error);
		return {
			score: 0,
			approved: false,
			feedback:
				'Comment analysis service is temporarily unavailable. Please try again later.',
		};
	}
}
