import { useCallback, useEffect, useState } from 'react';
import Content from './Content';
import Navbar, { type PageId } from './Navbar';

export type { PageId };

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
	if (typeof document === 'undefined') return 'light';
	const saved = localStorage.getItem('toc-theme');
	if (saved === 'light' || saved === 'dark') return saved;
	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
}

export default function AppLayout({
	children,
	activePage,
	onNavigate,
}: {
	children?: React.ReactNode;
	activePage: PageId;
	onNavigate: (page: PageId) => void;
}) {
	const [theme, setTheme] = useState<Theme>(getInitialTheme);

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		localStorage.setItem('toc-theme', theme);
	}, [theme]);

	const toggleTheme = useCallback(
		() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
		[],
	);

	return (
		<div className='app-shell flex min-h-svh flex-col'>
			<Navbar
				theme={theme}
				onThemeToggle={toggleTheme}
				activePage={activePage}
				onNavigate={onNavigate}
			/>
			<div className='mx-auto flex w-full max-w-7xl flex-1'>
				<Content>{children}</Content>
			</div>
		</div>
	);
}
