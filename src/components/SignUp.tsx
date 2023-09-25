import Link from 'next/link';
import { Icons } from './Icons';
import UserAuthForm from './UserAuthForm';

const SignUp = () => {
	return (
		<div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
			<div className='flex flex-col space-y-2 text-center'>
				<Icons.logo className='mx-auto h-8 w-8' />
				<h1 className='text-2xl font-semibold tracking-tight'>
					Create an Account
				</h1>
				<p className='text-sm max-w-xs mx-auto'>
					By continuing, you are setting up a not-reddit account and agree to
					our User Agreement and Privacy Policy.
				</p>

				{/* SIGN-IN FORM */}
				<UserAuthForm />

				<p className='px-8 text-center text-sm text-zinc-400'>
					Already have an account?{' '}
					<Link
						href='/sign-in'
						className='hover:text-[#9932ff] text-sm underline underline-offset-4'
					>
						Sign In
					</Link>
				</p>
			</div>
		</div>
	);
};

export default SignUp;
