import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const RespectifyConfigSchema = z.object({
	enabled: z.boolean(),
	apiEndpoint: z.string().url(),
	autoPublish: z.object({
		enabled: z.boolean(),
		minimumScore: z.number().min(0).max(1),
	}),
	moderation: z.object({
		blockDisrespectful: z.boolean(),
		showFeedbackToUser: z.boolean(),
		allowOverride: z.boolean(),
	}),
	thresholds: z.object({
		autoApprove: z.number().min(0).max(1),
		warn: z.number().min(0).max(1),
		block: z.number().min(0).max(1),
	}),
	feedback: z.object({
		approved: z.string(),
		warning: z.string(),
		blocked: z.string(),
	}),
});

export type RespectifyConfig = z.infer<typeof RespectifyConfigSchema>;

let cachedConfig: RespectifyConfig | null = null;

export function loadRespectifyConfig(): RespectifyConfig {
	if (cachedConfig) {
		return cachedConfig;
	}

	const configPath = path.join(process.cwd(), 'respectify.config.json');

	try {
		const configFile = fs.readFileSync(configPath, 'utf-8');
		const config = JSON.parse(configFile);
		cachedConfig = RespectifyConfigSchema.parse(config);
		return cachedConfig;
	} catch (error) {
		throw new Error(`Failed to load Respectify config: ${error}`);
	}
}
