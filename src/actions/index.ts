import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { respectifyCommentActions } from '@respectify/astro/actions';
import { verifyCredentials } from '../lib/auth';
import { logger } from '../lib/logger';

export const server = {
	comments: respectifyCommentActions,

	auth: {
		login: defineAction({
			accept: 'json',
			input: z.object({
				email: z.string().email(),
				password: z.string().min(1),
			}),
			handler: async ({ email, password }, context) => {
				if (!verifyCredentials(email, password)) {
					logger.warn('Failed login attempt');
					throw new ActionError({
						code: 'UNAUTHORIZED',
						message: 'Invalid email or password',
					});
				}

				context.session?.set('user', email);
				context.session?.regenerate();
				logger.info('User logged in successfully');

				return { success: true as const };
			},
		}),

		logout: defineAction({
			accept: 'json',
			input: z.object({}),
			handler: async (_input, context) => {
				context.session?.destroy();
				logger.info('User logged out');

				return { success: true as const };
			},
		}),
	},
};
