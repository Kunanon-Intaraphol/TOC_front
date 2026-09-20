export default function Content({
	children,
	wide = false,
}: {
	children?: React.ReactNode;
	wide?: boolean;
}) {
	return (
		<main className='flex min-h-0 min-w-0 flex-1 flex-col px-4 py-8 sm:px-6 lg:px-10'>
			<div
				className={`mx-auto flex min-h-0 min-w-0 w-full flex-1 flex-col ${
					wide ? '' : 'app-content'
				}`}
			>
				{children}
			</div>
		</main>
	);
}
