import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import Content from './Content';
import Navbar from './Navbar';

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
}: {
	children?: React.ReactNode;
}) {
	const [theme, setTheme] = useState<Theme>(getInitialTheme);
	const { pathname } = useLocation();
	const wide = pathname.startsWith('/playground');

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		localStorage.setItem('toc-theme', theme);
	}, [theme]);

	const toggleTheme = useCallback(
		() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
		[],
	);

	return (
		<div className='app-shell theme-page flex min-h-svh flex-col'>
			<Navbar theme={theme} onThemeToggle={toggleTheme} />
			<div
				className={`mx-auto flex min-h-0 w-full flex-1 ${
					wide ? 'max-w-[1380px]' : 'max-w-7xl'
				}`}
			>
				<Content wide={wide}>{children}</Content>
			</div>
		</div>
	);
}
