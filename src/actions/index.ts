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
					logger.error('Failed login attempt', context.clientAddress ?? 'unknown');
					throw new ActionError({
						code: 'UNAUTHORIZED',
						message: 'Invalid email or password',
					});
				}

				if (!context.session) {
					logger.error('Login succeeded but session is unavailable');
					throw new ActionError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Session unavailable',
					});
				}

				context.session.set('user', email);
				await context.session.regenerate();
				logger.info('User logged in successfully');

				return { success: true as const };
			},
		}),

		logout: defineAction({
			accept: 'json',
			input: z.object({}),
			handler: async (_input, context) => {
				if (context.session) {
					context.session.destroy();
				}
				logger.info('User logged out');

				return { success: true as const };
			},
		}),
	},
};
