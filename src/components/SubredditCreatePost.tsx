'use client';

import { Session } from 'next-auth';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';
import UserAvatar from './UserAvatar';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { ImageIcon, Link2 } from 'lucide-react';

interface SubredditCreatePostProps {
	session: Session | null;
}

const SubredditCreatePost: FC<SubredditCreatePostProps> = ({ session }) => {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<li className='overflow-hidden rounded-md bg-gray-900 shadow list-none border border-gray-600'>
			<div className='h-full px-6 py-8 flex justify-between gap-6'>
				<div className='relative'>
					<UserAvatar
						user={{
							name: session?.user.name || null,
							image: session?.user?.image || null,
						}}
					/>

					{session ? (
						<span className='absolute bottom-0.5 right-0.5 rounded-full w-2 h-2 bg-green-500 outline outline-2 outline-white' />
					) : null}
				</div>

				<Input
					readOnly
					onClick={() => router.push(`${pathname}/submit`)}
					placeholder='Create post'
				/>

				<Button
					variant='ghost'
					onClick={() => router.push(`${pathname}/submit`)}
					className='hidden md:block'
				>
					<ImageIcon className='text-zinc-300' />
				</Button>

				<Button
					variant='ghost'
					onClick={() => router.push(`${pathname}/submit`)}
					className='hidden md:block'
				>
					<Link2 className='text-zinc-300' />
				</Button>
			</div>
		</li>
	);
};

export default SubredditCreatePost;
