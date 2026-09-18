import { useLayoutEffect, useRef, useState } from 'react';

type NavbarProps = {
	theme: 'light' | 'dark';
	onThemeToggle: () => void;
};

const NAV_LINKS = ['Overview', 'Docs', 'Components', 'Changelog'];

export default function Navbar({ theme, onThemeToggle }: NavbarProps) {
	const [active, setActive] = useState(NAV_LINKS[0]);
	const [pill, setPill] = useState({ left: 0, width: 0 });
	const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	useLayoutEffect(() => {
		const update = () => {
			const el = itemRefs.current[active];
			if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
		};
		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, [active]);

	return (
		<header className='sticky top-0 z-(--z-nav) flex justify-center bg-transparent px-4 pt-4'>
			<nav
				aria-label='Primary'
				className='relative flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-background/85 p-1.5 shadow-(--shadow-sm) backdrop-blur'
			>
				{/* Sliding active background */}
				<span
					aria-hidden='true'
					style={{ left: pill.left, width: pill.width }}
					className='pointer-events-none absolute top-1.5 bottom-1.5 rounded-full bg-primary-bg transition-all duration-300'
				/>

				{NAV_LINKS.map((label) => {
					const isActive = active === label;
					return (
						<button
							key={label}
							ref={(el) => {
								itemRefs.current[label] = el;
							}}
							type='button'
							onClick={() => setActive(label)}
							aria-current={isActive ? 'page' : undefined}
							className={`relative z-10 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors duration-200 ${
								isActive
									? 'font-medium text-heading'
									: 'text-muted hover:text-foreground'
							}`}
						>
							{label}
						</button>
					);
				})}

				<span aria-hidden='true' className='mx-1 h-5 w-px shrink-0 bg-border' />

				{/* Theme toggle */}
				<button
					type='button'
					onClick={onThemeToggle}
					aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
					title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
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
			</nav>
		</header>
	);
}
