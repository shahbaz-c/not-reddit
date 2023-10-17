import Link from 'next/link';
import { Icons } from './Icons';
import { buttonVariants } from './ui/Button';
import { getAuthSession } from '@/lib/auth';
import UserAccountNav from './UserAccountNav';
import SearchBar from './SearchBar';

const Navbar = async () => {
	const session = await getAuthSession();

	return (
		<div className='fixed top-0 inset-x-0 h-fit bg-gray-900 border-b border-zinc-800 z-[10] py-2'>
			<div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
				{/* LOGO */}
				<Link href='/' className='flex gap-2 items-center'>
					<Icons.logo className='h-8 w-8 sm:h-8 sm:w-8' />
					<p className='hidden text-zinc-50 text-sm font-extrabold md:block hover:text-zinc-400'>
						not-reddit
					</p>
				</Link>

				{/* SEARCH BAR */}
				<SearchBar />

				{session?.user ? (
					<UserAccountNav user={session.user} />
				) : (
					<Link href='/sign-in' className={buttonVariants()}>
						Sign In
					</Link>
				)}
			</div>
		</div>
	);
};

export default Navbar;
