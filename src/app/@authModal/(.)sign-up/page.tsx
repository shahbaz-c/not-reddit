import CloseModal from '@/components/CloseModal';
import SignUp from '@/components/SignUp';

const page = () => {
	return (
		<div className='fixed inset-0 bg-zinc-600/20 z-10'>
			<div className='container flex items-center h-full max-w-lg mx-auto'>
				<div className='relative bg-black w-full h-fit py-20 px-2 rounded-lg border border-gray-500'>
					<div className='absolute top-4 right-4'>
						<CloseModal />
					</div>

					<SignUp />
				</div>
			</div>
		</div>
	);
};

export default page;
