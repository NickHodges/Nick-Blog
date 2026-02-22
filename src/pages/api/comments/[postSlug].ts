import type { APIRoute } from 'astro';
import { db, Comment, eq, and, asc } from 'astro:db';

export const GET: APIRoute = async ({ params }) => {
	const { postSlug } = params;

	if (!postSlug) {
		return new Response(JSON.stringify({ error: 'Post slug is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		// Fetch approved comments for the given post slug
		const comments = await db
			.select()
			.from(Comment)
			.where(and(eq(Comment.postSlug, postSlug), eq(Comment.approved, true)))
			.orderBy(asc(Comment.createdAt));

		return new Response(JSON.stringify(comments), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to fetch comments' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
