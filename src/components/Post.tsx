import { FC, useRef } from 'react';
import { Post, User, Vote } from '@prisma/client';
import { formatTimeToNow } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';
import EditorOutput from './EditorOutput';
import PostVoteClient from './postVote/PostVoteClient';

type PartialVote = Pick<Vote, 'type'>;

interface PostProps {
	subredditName: string;
	post: Post & {
		author: User;
		votes: Vote[];
	};
	numOfComments: number;
	numOfVotes: number;
	currentVote?: PartialVote;
}

const Post: FC<PostProps> = ({
	subredditName,
	post,
	numOfComments,
	numOfVotes,
	currentVote,
}) => {
	const postRef = useRef<HTMLDivElement>(null);

	return (
		<div className='rounded-md bg-gray-900 shadow'>
			<div className='px-6 py-4 flex justify-between'>
				<PostVoteClient
					postId={post.id}
					numOfInitialVotes={numOfVotes}
					initialVote={currentVote?.type}
				/>

				<div className='w-0 flex-1'>
					<div className='max-h-40 mt-1 text-xs text-gray-400'>
						{subredditName ? (
							<>
								<a
									className='underline text-zinc-50 text-sm underline-offset-2'
									href={`/r/${subredditName}`}
								>
									r/{subredditName}
								</a>
								<span className='px-1'>•</span>
							</>
						) : null}
						<span>Posted by u/{post.author.name}</span>
						<span className='px-1'>•</span>
						{formatTimeToNow(new Date(post.createdAt))}
					</div>

					<a href={`/r/${subredditName}/post/${post.id}`}>
						<h1 className='text-lg font-semibold py-2 leading-6 text-zinc-50'>
							{post.title}
						</h1>
					</a>

					<div
						className='relative text-sm max-h-40 w-full overflow-clip'
						ref={postRef}
					>
						<EditorOutput content={post.content} />

						{postRef.current?.clientHeight === 160 ? (
							<div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-gray-600 to-transparent' />
						) : null}
					</div>
				</div>
			</div>

			<div className='rounded-b-md bg-slate-800 z-20 text-sm p-4 sm:px-6'>
				<a
					className='w-fit flex items-center gap-2'
					href={`/r/${subredditName}/post/${post.id}`}
				>
					<MessageSquare className='h-4 2-4' />{' '}
					{numOfComments === 1
						? `${numOfComments} comment`
						: `${numOfComments} comments`}
				</a>
			</div>
		</div>
	);
};

export default Post;
