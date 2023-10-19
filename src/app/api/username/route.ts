import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { UsernameValidator } from '@/lib/validators/username';
import { z } from 'zod';

export async function PATCH(req: Request) {
	try {
		const session = await getAuthSession();

		if (!session?.user) {
			return new Response('Unauthorised', { status: 401 });
		}

		const body = await req.json();
		const { name } = UsernameValidator.parse(body);

		const username = await db.user.findFirst({
			where: {
				username: name,
			},
		});

		// if new username already exists
		if (username) {
			return new Response('Username has already been taken', { status: 409 });
		}

		// if username does not already exist - allow user to update their username
		await db.user.update({
			where: {
				id: session.user.id,
			},
			data: {
				username: name,
			},
		});

		return new Response('Ok');
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response('Invalid data request', { status: 422 });
		}

		return new Response('Could not update username, please try again later', {
			status: 500,
		});
	}
}
