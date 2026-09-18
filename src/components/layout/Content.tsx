export default function Content({ children }: { children?: React.ReactNode }) {
	return (
		<main className='min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10'>
			<div className='app-content mx-auto'>{children}</div>
		</main>
	);
}
