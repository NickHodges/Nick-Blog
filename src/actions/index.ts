import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { db, Comment, eq } from 'astro:db';
import { analyzeComment } from '../lib/respectify/service';
import { verifyCredentials, createSession, destroySession } from '../lib/auth';
import { logger } from '../lib/logger';

export const server = {
	comments: {
		submit: defineAction({
			accept: 'json',
			input: z.object({
				postSlug: z.string().min(1),
				author: z.string().min(1).max(100),
				email: z.string().email().optional(),
				content: z.string().min(1).max(5000),
				parentId: z.number().optional(),
			}),
			handler: async ({ postSlug, author, email, content, parentId }) => {
				const analysis = await analyzeComment(content, postSlug);

				if (!analysis.approved) {
					return {
						success: false as const,
						approved: false as const,
						feedback: analysis.feedback,
						suggestion: analysis.suggestion,
						score: analysis.score,
					};
				}

				await db.insert(Comment).values({
					postSlug,
					author,
					email,
					content,
					parentId,
					approved: true,
				});

				return {
					success: true as const,
					approved: true as const,
					feedback: analysis.feedback,
					score: analysis.score,
					message: 'Comment published successfully!',
				};
			},
		}),

		delete: defineAction({
			accept: 'json',
			input: z.object({
				commentId: z.number(),
			}),
			handler: async ({ commentId }, context) => {
				if (!context.locals.isAuthenticated) {
					throw new ActionError({
						code: 'UNAUTHORIZED',
						message: 'You must be logged in to delete comments',
					});
				}

				await db.delete(Comment).where(eq(Comment.id, commentId));
				logger.info('Comment deleted', { commentId });

				return { success: true as const };
			},
		}),
	},

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

				await createSession(context.cookies, email);
				logger.info('User logged in successfully');

				return { success: true as const };
			},
		}),

		logout: defineAction({
			accept: 'json',
			input: z.object({}),
			handler: async (_input, context) => {
				destroySession(context.cookies);
				logger.info('User logged out');

				return { success: true as const };
			},
		}),
	},
};
