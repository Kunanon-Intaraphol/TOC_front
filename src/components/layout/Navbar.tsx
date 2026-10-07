import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

const NAV_PAGES = [
	{ id: 'home', label: 'หน้าหลัก', path: '/' },
	{ id: 'playground', label: 'ทดลองใช้งาน', path: '/playground' },
	{ id: 'how-it-works', label: 'วิธีการทำงาน', path: '/how-it-works' },
	{ id: 'about', label: 'เกี่ยวกับเรา', path: '/about' },
] as const;

export type PageId = (typeof NAV_PAGES)[number]['id'];

function pageFromPath(pathname: string): PageId {
	return NAV_PAGES.find((page) => page.path === pathname)?.id ?? 'home';
}

type NavbarProps = {
	theme: 'light' | 'dark';
	onThemeToggle: () => void;
};

export default function Navbar({ theme, onThemeToggle }: NavbarProps) {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const activePage = pageFromPath(pathname);
	const [pill, setPill] = useState({ left: 0, width: 0 });
	const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	useLayoutEffect(() => {
		const update = () => {
			const el = itemRefs.current[activePage];
			if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
		};
		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, [activePage]);

	return (
		<header className='sticky top-0 z-(--z-nav) flex justify-center bg-transparent px-4 pt-4'>
			<nav
				aria-label='การนำทางหลัก'
				className='relative flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-background/85 p-1.5 shadow-(--shadow-sm) backdrop-blur select-none'
			>
				<span
					aria-hidden='true'
					style={{ left: pill.left, width: pill.width }}
					className='pointer-events-none absolute top-1.5 bottom-1.5 rounded-full bg-primary-bg transition-all duration-300'
				/>

				{NAV_PAGES.map((page) => {
					const isActive = activePage === page.id;
					return (
						<button
							key={page.id}
							ref={(el) => {
								itemRefs.current[page.id] = el;
							}}
							type='button'
							onClick={() => navigate(page.path)}
							aria-current={isActive ? 'page' : undefined}
							className={`relative z-10 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors duration-200 ${
								isActive
									? 'font-medium text-heading'
									: 'text-muted hover:text-foreground'
							}`}
						>
							{page.label}
						</button>
					);
				})}

				<span aria-hidden='true' className='mx-1 h-5 w-px shrink-0 bg-border' />

				<button
					type='button'
					onClick={onThemeToggle}
					aria-label={`เปลี่ยนเป็นธีม${theme === 'dark' ? 'สว่าง' : 'มืด'}`}
					title={`เปลี่ยนเป็นธีม${theme === 'dark' ? 'สว่าง' : 'มืด'}`}
					className='relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-heading transition hover:bg-surface-2'
				>
					{theme === 'dark' ? (
						<svg
							width='17'
							height='17'
							viewBox='0 0 20 20'
							fill='none'
							aria-hidden='true'
						>
							<circle
								cx='10'
								cy='10'
								r='4'
								stroke='currentColor'
								strokeWidth='1.6'
							/>
							<path
								d='M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6 16 16M16 4l-1.4 1.4M5.4 14.6 4 16'
								stroke='currentColor'
								strokeWidth='1.6'
								strokeLinecap='round'
							/>
						</svg>
					) : (
						<svg
							width='18'
							height='18'
							viewBox='0 0 24 24'
							fill='none'
							aria-hidden='true'
						>
							<path
								d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					)}
				</button>

				<a
					href='https://github.com/khom19/t-rex-toc.git'
					target='_blank'
					rel='noreferrer'
					aria-label='เปิด GitHub repository'
					title='GitHub repository'
					className='relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-heading transition hover:bg-surface-2'
				>
					<svg
						width='18'
						height='18'
						viewBox='0 0 24 24'
						fill='currentColor'
						aria-hidden='true'
					>
						<path d='M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.49 0-.24-.01-.89-.01-1.75-2.78.62-3.37-1.38-3.37-1.38-.45-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.58 2.35 1.12 2.92.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.18 9.18 0 0 1 12 7.04c.85 0 1.7.12 2.5.37 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.95-2.35 4.81-4.58 5.07.36.32.68.95.68 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.6.69.49A10.27 10.27 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z' />
					</svg>
				</a>
			</nav>
		</header>
	);
}
