import type { APIRoute } from 'astro';
import { db, Comment } from 'astro:db';
import { z } from 'zod';
import { analyzeComment } from '../../../lib/respectify/service';

const CommentSchema = z.object({
	postSlug: z.string().min(1),
	author: z.string().min(1).max(100),
	email: z.string().email().optional(),
	content: z.string().min(1).max(5000),
	parentId: z.number().optional(),
});

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json();

		// Validate input using Zod
		const validationResult = CommentSchema.safeParse(body);

		if (!validationResult.success) {
			return new Response(
				JSON.stringify({
					error: 'Invalid input',
					details: validationResult.error.errors,
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		const { postSlug, author, email, content, parentId } = validationResult.data;

		// Analyze comment with Respectify
		const analysis = await analyzeComment(content);

		// Only save comment if Respectify approves
		if (!analysis.approved) {
			return new Response(
				JSON.stringify({
					success: false,
					approved: false,
					feedback: analysis.feedback,
					suggestion: analysis.suggestion,
					score: analysis.score,
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		// Comment is approved - save to database
		await db.insert(Comment).values({
			postSlug,
			author,
			email,
			content,
			parentId,
			approved: true,
		});

		return new Response(
			JSON.stringify({
				success: true,
				approved: true,
				feedback: analysis.feedback,
				score: analysis.score,
				message: 'Comment published successfully!',
			}),
			{
				status: 201,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to submit comment' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
