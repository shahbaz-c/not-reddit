import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { CommentValidator } from '@/lib/validators/comment';
import { z } from 'zod';

export async function PATCH(req: Request) {
	try {
		const body = await req.json();
		const { postId, text, replyToId } = CommentValidator.parse(body);
		const session = await getAuthSession();

		if (!session?.user) {
			return new Response('Unauthorised', { status: 401 });
		}

		await db.comment.create({
			data: {
				postId,
				text,
				authorId: session.user.id,
				replyToId,
			},
		});

		return new Response('Ok');
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response('Invalid data request', { status: 422 });
		}

		return new Response('Could not create comment, please try again later.', {
			status: 500,
		});
	}
}