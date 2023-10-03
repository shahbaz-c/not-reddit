import Editor from '@/components/Editor';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

interface PageProps {
	params: {
		slug: string;
	};
}

const page = async ({ params }: PageProps) => {
	const subreddit = await db.subreddit.findFirst({
		where: {
			name: params.slug,
		},
	});

	if (!subreddit) return notFound();

	return (
		<div className='flex flex-col items-start gap-6'>
			<div className='border-b border-gray-700 pb-5'>
				<div className='-ml-2 -mt-2 flex flex-wrap items-baseline'>
					<h3 className='ml-2 mt-2 text-base font-semibold leading-6 text-zinc-50'>
						Create Post
					</h3>
					<p className='ml-2 mt-1 truncate text-sm text-gray-400'>
						in r/{params.slug}
					</p>
				</div>
			</div>

			{/* FORM */}
			<Editor subredditId={subreddit.id} />

			<div className='w-full flex justify-end'>
				<Button className='w-full' type='submit' form='subreddit-post-form'>
					Post
				</Button>
			</div>
		</div>
	);
};

export default page;
