import { defineDb, defineTable, column, NOW } from 'astro:db';

const Comment = defineTable({
	columns: {
		id: column.number({ primaryKey: true }),
		postSlug: column.text(), // The blog post slug this comment belongs to
		author: column.text(), // Commenter's name
		email: column.text({ optional: true }), // Optional email (not displayed publicly)
		content: column.text(), // Comment text
		createdAt: column.date({ default: NOW }), // Timestamp
		approved: column.boolean({ default: false }), // Moderation flag
		parentId: column.number({ optional: true }), // For threaded replies
	},
	indexes: [
		{ on: ['postSlug'], unique: false },
		{ on: ['approved'], unique: false },
	],
});

export default defineDb({
	tables: { Comment },
});
