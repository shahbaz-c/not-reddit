'use client';

import { FC, useRef, useState } from 'react';
import UserAvatar from './UserAvatar';
import { Comment, CommentVote, User } from '@prisma/client';
import { formatTimeToNow } from '@/lib/utils';
import CommentVotes from './CommentVotes';
import { Button } from './ui/Button';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Label } from './ui/Label';
import { Textarea } from './ui/Textarea';
import { useMutation } from '@tanstack/react-query';
import { CommentRequest } from '@/lib/validators/comment';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

type ExtendedComment = Comment & {
	votes: CommentVote[];
	author: User;
};

interface PostCommentProps {
	comment: ExtendedComment;
	numOfVotes: number;
	currentVote: CommentVote | undefined;
	postId: string;
}

const PostComment: FC<PostCommentProps> = ({
	comment,
	numOfVotes,
	currentVote,
	postId,
}) => {
	const commentRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const [isReplying, setIsReplying] = useState<boolean>(false);
	const [input, setInput] = useState<string>('');
	const { data: session } = useSession();

	const { mutate: postComment, isLoading } = useMutation({
		mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
			const payload: CommentRequest = {
				postId,
				text,
				replyToId,
			};

			const { data } = await axios.patch(
				`/api/subreddit/post/comment`,
				payload
			);
			return data;
		},
		onError: () => {
			return toast({
				title: 'Something went wrong',
				description: 'Unable to post comment, please try again later',
				variant: 'destructive',
			});
		},
		onSuccess: () => {
			router.refresh();
			setIsReplying(false);
		},
	});

	return (
		<div ref={commentRef} className='flex flex-col'>
			<div className='flex items-center'>
				<UserAvatar
					user={{
						name: comment.author.name || null,
						image: comment.author.image || null,
					}}
					className='h-6 w-6'
				/>

				<div className='flex items-center ml-2 gap-x-1'>
					<p className='text-sm font-bold text-white'>
						u/{comment.author.username}
					</p>
					<span>•</span>
					<p className='max-h-40 truncate text-xs text-gray-400'>
						{formatTimeToNow(new Date(comment.createdAt))}
					</p>
				</div>
			</div>

			<p className='text-sm text-zinc-50 mt-3'>{comment.text}</p>

			<div className='flex flex-wrap gap-2 items-center'>
				<CommentVotes
					commentId={comment.id}
					numOfInitialVotes={numOfVotes}
					initialVote={currentVote}
				/>

				<Button
					onClick={() => {
						if (!session) return router.push('/sign-in');
						setIsReplying(true);
					}}
					variant='ghost'
					size='xs'
				>
					<MessageSquare className='h-4 w-4 mr-1.5' />
					Reply
				</Button>

				{isReplying ? (
					<div className='grid w-full gap-1.5'>
						<Label htmlFor='comment'>
							Comment as u/
							<span className='text-[#8000ff]'>{comment.author.username}</span>
						</Label>
						<div className='mt-2'>
							<Textarea
								id='comment'
								value={input}
								onChange={(e) => setInput(e.target.value)}
								rows={1}
								placeholder='What are your thoughts?'
							/>

							<div className='mt-2 flex justify-end gap-2'>
								<Button
									tabIndex={-1}
									variant='subtle'
									onClick={() => setIsReplying(false)}
								>
									Cancel
								</Button>
								<Button
									onClick={() => {
										if (!input) return;
										postComment({
											postId,
											text: input,
											replyToId: comment.replyToId ?? comment.id,
										});
									}}
									isLoading={isLoading}
									disabled={input.length === 0}
								>
									Post
								</Button>
							</div>
						</div>

						<hr className='w-full h-px mt-5' />
					</div>
				) : null}
			</div>
		</div>
	);
};

export default PostComment;
