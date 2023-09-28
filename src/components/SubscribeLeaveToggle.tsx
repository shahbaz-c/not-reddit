'use client';

import { FC, startTransition } from 'react';
import { Button } from './ui/Button';
import { useMutation } from '@tanstack/react-query';
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit';
import axios, { AxiosError } from 'axios';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface SubscribeLeaveToggleProps {
	subredditId: string;
	isSubscribed: boolean;
	subredditName: string;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
	subredditId,
	isSubscribed,
	subredditName,
}) => {
	const { loginToast } = useCustomToast();
	const router = useRouter();

	// Join Subreddit
	const { mutate: subscribe, isLoading: isSubscribeLoading } = useMutation({
		mutationFn: async () => {
			const payload: SubscribeToSubredditPayload = {
				subredditId,
			};

			const { data } = await axios.post('/api/subreddit/subscribe', payload);
			return data as string;
		},
		onError: (error) => {
			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					return loginToast();
				}
			}

			return toast({
				title: 'Something went wrong!',
				description: 'Please try again later.',
				variant: 'destructive',
			});
		},
		onSuccess: () => {
			startTransition(() => {
				router.refresh();
			});

			return toast({
				title: 'Subscribed!',
				description: `You are subscribed to r/${subredditName}`,
				variant: 'default',
			});
		},
	});

	// Leave Subreddit
	const { mutate: unsubscribe, isLoading: isUnsubscribeLoading } = useMutation({
		mutationFn: async () => {
			const payload: SubscribeToSubredditPayload = {
				subredditId,
			};

			const { data } = await axios.post('/api/subreddit/unsubscribe', payload);
			return data as string;
		},
		onError: (error) => {
			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					return loginToast();
				}
			}

			return toast({
				title: 'Something went wrong!',
				description: 'Please try again later.',
				variant: 'destructive',
			});
		},
		onSuccess: () => {
			startTransition(() => {
				router.refresh();
			});

			return toast({
				title: 'Unsubscribed!',
				description: `You have unsubscribed from r/${subredditName}`,
				variant: 'default',
			});
		},
	});

	return isSubscribed ? (
		<Button
			className='w-full mt-1 mb-4'
			onClick={() => unsubscribe()}
			isLoading={isUnsubscribeLoading}
		>
			Leave Community
		</Button>
	) : (
		<Button
			className='w-full mt-1 mb-4'
			onClick={() => subscribe()}
			isLoading={isSubscribeLoading}
		>
			Join to post
		</Button>
	);
};

export default SubscribeLeaveToggle;
