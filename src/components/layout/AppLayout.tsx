import { useCallback, useEffect, useState } from 'react';
import { useShownRoute } from '../../route-transition-context';
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
	const { shown } = useShownRoute();
	const wide = shown.startsWith('/playground');

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		localStorage.setItem('toc-theme', theme);
	}, [theme]);

	const toggleTheme = useCallback(
		() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
		[],
	);

	return (
		<div
			className={`app-shell theme-page flex min-h-svh flex-col ${
				wide ? 'lg:h-svh lg:overflow-hidden' : ''
			}`}
		>
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
