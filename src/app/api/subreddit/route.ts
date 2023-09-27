import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { SubredditValidator } from '@/lib/validators/subreddit';
import { z } from 'zod';

export async function POST(req: Request) {
	try {
		const session = await getAuthSession();

		// Check if user is logged in
		if (!session?.user) {
			return new Response('Unauthorised', { status: 401 });
		}

		const body = await req.json();
		const { name } = SubredditValidator.parse(body);

		// Check if subreddit already exists
		const subredditExists = await db.subreddit.findFirst({
			where: {
				name,
			},
		});

		if (subredditExists) {
			return new Response('Subreddit already exists!', { status: 409 });
		}

		// If subreddit does NOT exist - create subreddit
		const subreddit = await db.subreddit.create({
			data: {
				name,
				creatorId: session.user.id,
			},
		});

		// If user creates a subreddit, they have to be subscribed to that subreddit
		await db.subscription.create({
			data: {
				userId: session.user.id,
				subredditId: subreddit.id,
			},
		});

		return new Response(subreddit.name);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response(error.message, { status: 422 });
		}

		return new Response('Could not create subreddit', { status: 500 });
	}
}
