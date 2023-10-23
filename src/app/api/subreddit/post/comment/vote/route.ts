import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { CommentVoteValidator } from '@/lib/validators/vote';
import { z } from 'zod';

export async function PATCH(req: Request) {
	try {
		const body = await req.json();
		const { commentId, voteType } = CommentVoteValidator.parse(body);

		const session = await getAuthSession();

		if (!session?.user) {
			return new Response('Unauthorised', { status: 401 });
		}

		// check for existing vote
		const existingVote = await db.commentVote.findFirst({
			where: {
				userId: session.user.id,
				commentId,
			},
		});

		// If user clicks Upvote button again - it will delete user upvote
		if (existingVote) {
			if (existingVote.type === voteType) {
				await db.commentVote.delete({
					where: {
						userId_commentId: {
							commentId,
							userId: session.user.id,
						},
					},
				});

				return new Response('Ok');
			} else {
				// If user votes again but does the opposite vote - vote needs to updated
				await db.commentVote.update({
					where: {
						userId_commentId: {
							commentId,
							userId: session.user.id,
						},
					},
					data: {
						type: voteType,
					},
				});

				return new Response('Ok');
			}
		}

		// if there is no existing vote - need to create one
		await db.commentVote.create({
			data: {
				type: voteType,
				userId: session.user.id,
				commentId,
			},
		});

		return new Response('Ok');
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response('Invalid data request', { status: 422 });
		}

		return new Response(
			'Unable to register your vote, please try again later.',
			{
				status: 500,
			}
		);
	}
}
