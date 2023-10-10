import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';

export const metadata = {
	title: 'not-reddit',
	description: 'A Reddit clone built with Next.js and TypeScript.',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
	children,
	authModal,
}: {
	children: React.ReactNode;
	authModal: React.ReactNode;
}) {
	return (
		<html
			lang='en'
			className={cn('bg-black text-zinc-50 antialiased dark', inter.className)}
		>
			<body className='min-h-screen pt-12 bg-gray-950 antialiased'>
				<Providers>
					{/* @ts-expect-error server component */}
					<Navbar />

					{authModal}

					<div className='container max-w-7xl mx-auto h-full pt-12'>
						{children}
					</div>

					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
