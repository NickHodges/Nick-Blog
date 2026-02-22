import type { RespectifyConfig } from './config';
import { loadRespectifyConfig } from './config';

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
		const response = await fetch(config.apiEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ text }),
		});

		if (!response.ok) {
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
