'use client';

import { FC, useState } from 'react';
import { CommentVote, VoteType } from '@prisma/client';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { usePrevious } from '@mantine/hooks';
import { Button } from '@/components/ui/Button';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { CommentVoteRequest } from '@/lib/validators/vote';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';

type PartialVote = Pick<CommentVote, 'type'>;

interface CommentVotesProps {
	commentId: string;
	numOfInitialVotes: number;
	initialVote?: PartialVote;
}

const CommentVotes: FC<CommentVotesProps> = ({
	commentId,
	numOfInitialVotes,
	initialVote,
}) => {
	const { loginToast } = useCustomToast();
	const [numOfVotes, setNumOfVotes] = useState<number>(numOfInitialVotes);
	const [currentVote, setCurrentVote] = useState(initialVote);
	const previousVote = usePrevious(currentVote);

	const { mutate: vote } = useMutation({
		mutationFn: async (voteType: VoteType) => {
			const payload: CommentVoteRequest = {
				commentId,
				voteType,
			};

			await axios.patch('/api/subreddit/post/comment/vote', payload);
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
		onMutate: (type) => {
			if (currentVote?.type === type) {
				setCurrentVote(undefined);
				if (type === 'UP') setNumOfVotes((prev) => prev - 1);
				else if (type === 'DOWN') setNumOfVotes((prev) => prev + 1);
			} else {
				setCurrentVote({ type });
				if (type === 'UP')
					setNumOfVotes((prev) => prev + (currentVote ? 2 : 1));
				else if (type === 'DOWN')
					setNumOfVotes((prev) => prev - (currentVote ? 2 : 1));
			}
		},
	});

	return (
		<div className='flex gap-1'>
			<Button
				onClick={() => vote('UP')}
				size='sm'
				variant='ghost'
				aria-label='Upvote'
			>
				<ArrowBigUp
					className={cn('h-5 w-5 text-zinc-50', {
						'text-emerald-500 fill-emerald-500': currentVote?.type === 'UP',
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
						'text-red-500 fill-red-500': currentVote?.type === 'DOWN',
					})}
				/>
			</Button>
		</div>
	);
};

export default CommentVotes;
