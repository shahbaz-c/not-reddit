import SubredditCreatePost from '@/components/SubredditCreatePost';
import { PAGINATION_RESULTS } from '@/config';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

interface PageProps {
	params: {
		slug: string;
	};
}

const page = async ({ params }: PageProps) => {
	const { slug } = params;
	const session = await getAuthSession();

	const subreddit = await db.subreddit.findFirst({
		where: {
			name: slug,
		},
		include: {
			posts: {
				include: {
					author: true,
					votes: true,
					comments: true,
					subreddit: true,
				},

				take: PAGINATION_RESULTS,
			},
		},
	});

	if (!subreddit) return notFound();

	return (
		<>
			<h1 className='font-bold text-3xl md:text-4xl h-14'>
				r/{subreddit.name}
			</h1>

			<SubredditCreatePost session={session} />

			{/* Show posts in user feed */}
		</>
	);
};

export default page;
