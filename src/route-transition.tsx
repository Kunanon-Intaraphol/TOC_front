import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router';
import {
	RouteTransitionContext,
	type TransitionPhase,
} from './route-transition-context';

const HIDE_MS = 200;
const SHOW_MS = 200;

export function RouteTransitionProvider({
	children,
}: {
	children?: ReactNode;
}) {
	const { pathname, hash } = useLocation();
	const [shown, setShown] = useState(pathname);
	const [phase, setPhase] = useState<TransitionPhase>('idle');
	const [reducedMotion] = useState(
		() =>
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches,
	);
	const [target, setTarget] = useState<string | null>(null);
	const showTimer = useRef(0);
	const hideMs = reducedMotion ? 0 : HIDE_MS;
	const showMs = reducedMotion ? 0 : SHOW_MS;

	if (pathname !== shown && target !== pathname) {
		setTarget(pathname);
		setPhase('hiding');
	}

	useEffect(() => {
		if (!target) return;
		const hideTimer = window.setTimeout(() => {
			setShown(target);
			setPhase('showing');
			if (!hash) window.scrollTo(0, 0);
			window.clearTimeout(showTimer.current);
			showTimer.current = window.setTimeout(() => {
				setPhase('idle');
				setTarget(null);
			}, showMs);
		}, hideMs);
		return () => {
			window.clearTimeout(hideTimer);
			window.clearTimeout(showTimer.current);
		};
	}, [target, hash, hideMs, showMs]);

	return (
		<RouteTransitionContext.Provider value={{ shown, phase }}>
			{children}
		</RouteTransitionContext.Provider>
	);
}
