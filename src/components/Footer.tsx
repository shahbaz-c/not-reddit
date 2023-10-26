import { Icons } from './Icons';

const Footer = () => {
	return (
		<footer>
			<div className='max-w-screen-xl mx-auto'>
				<div className='text-center py-3 text-zinc-400 text-sm font-extrabold'>
					<h5 className='flex justify-center'>
						Built with Next.js &copy; {new Date().getFullYear()}{' '}
						<span className='ml-2 mr-1'>
							<Icons.logo className='h-5 w-5' />
						</span>
						not-reddit
					</h5>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
