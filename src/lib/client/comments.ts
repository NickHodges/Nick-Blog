export interface CommentResponse {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

export function formatCommentDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function renderCommentHtml(comment: CommentResponse): string {
  const formattedDate = formatCommentDate(comment.createdAt);

  return `
		<div class="comment p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700" data-comment-id="${comment.id}">
			<div class="comment-header flex items-baseline justify-between mb-2">
				<div class="flex items-center gap-2">
					<span class="font-semibold text-lg">${escapeHtml(comment.author)}</span>
					<span class="delete-controls hidden items-center gap-1" data-delete-for="${comment.id}">
						<button
							class="delete-comment-btn text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
							data-comment-id="${comment.id}"
							type="button"
						>
							Delete
						</button>
						<span class="delete-confirm hidden items-center gap-1">
							<span class="text-xs text-gray-600 dark:text-gray-400">Delete this comment?</span>
							<button
								class="confirm-delete-btn text-xs px-2 py-1 bg-red-700 text-white rounded hover:bg-red-800 transition-colors"
								data-comment-id="${comment.id}"
								type="button"
							>
								Yes, delete
							</button>
							<button
								class="cancel-delete-btn text-xs px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors dark:bg-gray-600 dark:text-gray-200"
								type="button"
							>
								Cancel
							</button>
						</span>
						<span class="delete-error hidden text-xs text-red-600 dark:text-red-400"></span>
					</span>
				</div>
				<span class="text-sm text-gray-500 dark:text-gray-400">${formattedDate}</span>
			</div>
			<div class="comment-content text-gray-800 dark:text-gray-200 whitespace-pre-wrap">${escapeHtml(comment.content)}</div>
		</div>
	`;
}

export async function fetchComments(postSlug: string): Promise<CommentResponse[]> {
  const response = await fetch(`/api/comments?slug=${encodeURIComponent(postSlug)}`);
  if (!response.ok) return [];

  const data = (await response.json()) as { comments?: CommentResponse[] };
  return data.comments ?? [];
}
