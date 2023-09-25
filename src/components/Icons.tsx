import { LucideProps, User } from 'lucide-react';

export const Icons = {
	user: User,
	logo: (props: LucideProps) => (
		<svg
			{...props}
			xmlns='http://www.w3.org/2000/svg'
			// width='32'
			// height='32'
			viewBox='0 0 24 24'
			fill='none'
			stroke='#8000ff'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			// className='lucide lucide-rocket'
		>
			<path d='M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z' />
			<path d='m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z' />
			<path d='M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0' />
			<path d='M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5' />
		</svg>
	),
	google: (props: LucideProps) => (
		<svg {...props} viewBox='0 0 24 24'>
			<path
				d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
				fill='#4285F4'
			/>
			<path
				d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
				fill='#34A853'
			/>
			<path
				d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
				fill='#FBBC05'
			/>
			<path
				d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
				fill='#EA4335'
			/>
			<path d='M1 1h22v22H1z' fill='none' />
		</svg>
	),
};
