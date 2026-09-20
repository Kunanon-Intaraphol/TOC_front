import './App.css';
import { Navigate, Route, Routes } from 'react-router';
import AppLayout from './components/layout/AppLayout';
import About from './components/pages/About';
import Home from './components/pages/Home';
import HowItWorks from './components/pages/HowItWorks';
import Playground from './components/pages/Playground';
import { RouteTransitionProvider } from './route-transition';
import { useShownRoute } from './route-transition-context';

function PageTransition() {
	const { shown, phase } = useShownRoute();
	return (
		<div className='flex min-h-0 min-w-0 flex-1 flex-col'>
			<div
				key={shown}
				className={`flex min-h-0 min-w-0 flex-1 flex-col ${
					phase === 'hiding'
						? 'page-hide'
						: phase === 'showing'
							? 'page-show'
							: ''
				}`}
			>
				<Routes location={shown}>{appRoutes}</Routes>
			</div>
		</div>
	);
}

const appRoutes = (
	<>
		<Route path='/' element={<Home />} />
		<Route path='/playground' element={<Playground />} />
		<Route path='/how-it-works' element={<HowItWorks />} />
		<Route path='/about' element={<About />} />
		<Route path='*' element={<Navigate to='/' replace />} />
	</>
);

function App() {
	return (
		<div className='theme-bg'>
			<RouteTransitionProvider>
				<AppLayout>
					<PageTransition />
				</AppLayout>
			</RouteTransitionProvider>
		</div>
	);
}

export default App;
