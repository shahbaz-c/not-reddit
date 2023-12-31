import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { PostValidator } from '@/lib/validators/post';
import { z } from 'zod';

export async function POST(req: Request) {
	try {
		const session = await getAuthSession();
		if (!session?.user) {
			return new Response('Unauthorisd', { status: 401 });
		}

		const body = await req.json();
		const { subredditId, title, content } = PostValidator.parse(body);

		const subscriptionExists = await db.subscription.findFirst({
			where: {
				subredditId,
				userId: session.user.id,
			},
		});

		if (!subscriptionExists) {
			return new Response('Please subscribe to subreddit to post', {
				status: 400,
			});
		}

		await db.post.create({
			data: {
				title,
				content,
				authorId: session.user.id,
				subredditId,
			},
		});

		return new Response('Ok');
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response('Invalid data request', { status: 422 });
		}

		return new Response(
			'Could not post to subreddit, please try again later.',
			{
				status: 500,
			}
		);
	}
}
