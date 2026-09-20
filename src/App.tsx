import './App.css';
import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import AppLayout from './components/layout/AppLayout';
import About from './components/pages/About';
import Home from './components/pages/Home';
import HowItWorks from './components/pages/HowItWorks';
import Playground from './components/pages/Playground';

function ScrollToTop() {
	const { pathname, hash } = useLocation();

	useEffect(() => {
		if (!hash) window.scrollTo(0, 0);
	}, [pathname, hash]);

	return null;
}

function PageTransition({ children }: { children?: React.ReactNode }) {
	const { pathname } = useLocation();
	return (
		<div
			key={pathname}
			className='page-enter flex min-h-0 min-w-0 flex-1 flex-col'
		>
			{children}
		</div>
	);
}

function App() {
	return (
		<div className='theme-bg'>
			<AppLayout>
				<ScrollToTop />
				<PageTransition>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/playground' element={<Playground />} />
						<Route path='/how-it-works' element={<HowItWorks />} />
						<Route path='/about' element={<About />} />
						<Route path='*' element={<Navigate to='/' replace />} />
					</Routes>
				</PageTransition>
			</AppLayout>
		</div>
	);
}

export default App;
