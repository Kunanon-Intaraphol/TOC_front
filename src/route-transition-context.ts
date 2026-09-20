import { createContext, useContext } from 'react';

export type TransitionPhase = 'idle' | 'hiding' | 'showing';

export const RouteTransitionContext = createContext<{
	shown: string;
	phase: TransitionPhase;
}>({
	shown: '/',
	phase: 'idle',
});

export function useShownRoute() {
	return useContext(RouteTransitionContext);
}
