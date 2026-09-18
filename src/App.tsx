import './App.css';
import { useState } from 'react';
import AppLayout, { type PageId } from './components/layout/AppLayout';
import About from './components/pages/About';
import HowItWorks from './components/pages/HowItWorks';
import Playground from './components/pages/Playground';

function App() {
	const [page, setPage] = useState<PageId>('playground');

	return (
		<div className='theme-bg'>
			<AppLayout activePage={page} onNavigate={setPage}>
				{page === 'playground' && <Playground />}
				{page === 'how-it-works' && <HowItWorks />}
				{page === 'about' && <About />}
			</AppLayout>
		</div>
	);
}

export default App;
