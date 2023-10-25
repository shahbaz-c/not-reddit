import { NextAuthOptions, getServerSession } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import { db } from './db';
import { nanoid } from 'nanoid';

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(db),
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/sign-in',
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
				},
			},
		}),
	],
	callbacks: {
		async session({ token, session }) {
			if (token) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.image = token.picture;
				session.user.username = token.username;
			}

			return session;
		},

		async jwt({ token, user }) {
			const databaseUser = await db.user.findFirst({
				where: {
					email: token.email,
				},
			});

			if (!databaseUser) {
				token.id = user!.id;
				return token;
			}

			if (!databaseUser.username) {
				await db.user.update({
					where: {
						id: databaseUser.id,
					},
					data: {
						username: nanoid(10),
					},
				});
			}

			return {
				id: databaseUser.id,
				name: databaseUser.name,
				email: databaseUser.email,
				picture: databaseUser.image,
				username: databaseUser.username,
			};
		},
		redirect() {
			return '/';
		},
	},
};

export const getAuthSession = () => getServerSession(authOptions);
