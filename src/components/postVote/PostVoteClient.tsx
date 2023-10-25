'use client';

import { FC, useEffect, useState } from 'react';
import { VoteType } from '@prisma/client';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { usePrevious } from '@mantine/hooks';
import { Button } from '../ui/Button';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { PostVoteRequest } from '@/lib/validators/vote';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';

interface PostVoteClientProps {
	postId: string;
	numOfInitialVotes: number;
	initialVote?: VoteType | null;
}

const PostVoteClient: FC<PostVoteClientProps> = ({
	postId,
	numOfInitialVotes,
	initialVote,
}) => {
	const { loginToast } = useCustomToast();
	const [numOfVotes, setNumOfVotes] = useState<number>(numOfInitialVotes);
	const [currentVote, setCurrentVote] = useState(initialVote);
	const previousVote = usePrevious(currentVote);

	useEffect(() => {
		setCurrentVote(initialVote);
	}, [initialVote]);

	const { mutate: vote } = useMutation({
		mutationFn: async (voteType: VoteType) => {
			const payload: PostVoteRequest = {
				postId,
				voteType,
			};

			await axios.patch('/api/subreddit/post/vote', payload);
		},
		onError: (error, voteType) => {
			if (voteType === 'UP') setNumOfVotes((prev) => prev - 1);
			else setNumOfVotes((prev) => prev + 1);

			// reset current vote
			setCurrentVote(previousVote);

			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					return loginToast();
				}
			}

			return toast({
				title: 'Something went wrong.',
				description: 'Vote was not registered. Please try again later.',
				variant: 'destructive',
			});
		},
		onMutate: (type: VoteType) => {
			if (currentVote === type) {
				setCurrentVote(undefined);
				if (type === 'UP') setNumOfVotes((prev) => prev - 1);
				else if (type === 'DOWN') setNumOfVotes((prev) => prev + 1);
			} else {
				setCurrentVote(type);
				if (type === 'UP')
					setNumOfVotes((prev) => prev + (currentVote ? 2 : 1));
				else if (type === 'DOWN')
					setNumOfVotes((prev) => prev - (currentVote ? 2 : 1));
			}
		},
	});

	return (
		<div className='flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'>
			<Button
				onClick={() => vote('UP')}
				size='sm'
				variant='ghost'
				aria-label='Upvote'
			>
				<ArrowBigUp
					className={cn('h-5 w-5 text-zinc-50', {
						'text-emerald-500 fill-emerald-500': currentVote === 'UP',
					})}
				/>
			</Button>

			<p
				className={
					numOfVotes > 0
						? 'text-center py-2 font-medium text-sm text-emerald-500'
						: numOfVotes < 0
						? 'text-center py-2 font-medium text-sm text-red-500'
						: 'text-center py-2 font-medium text-sm text-zinc-50'
				}
			>
				{numOfVotes}
			</p>
			<Button
				onClick={() => vote('DOWN')}
				size='sm'
				variant='ghost'
				aria-label='Downvote'
			>
				<ArrowBigDown
					className={cn('h-5 w-5 text-zinc-50', {
						'text-red-500 fill-red-500': currentVote === 'DOWN',
					})}
				/>
			</Button>
		</div>
	);
};

export default PostVoteClient;
