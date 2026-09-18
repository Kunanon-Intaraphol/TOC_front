import { useState } from 'react';
import DomainFilterSection from './how-it-works/DomainFilterSection';
import EmailFilterSection from './how-it-works/EmailFilterSection';
import PhoneFilterSection from './how-it-works/PhoneFilterSection';

const SECTIONS = [
	{ id: 'email-filter', title: 'Email filter', Component: EmailFilterSection },
	{ id: 'phone-filter', title: 'Phone filter', Component: PhoneFilterSection },
	{
		id: 'domain-filter',
		title: 'Domain filter',
		Component: DomainFilterSection,
	},
];

export default function HowItWorks() {
	const [active, setActive] = useState(SECTIONS[0].id);

	return (
		<div className='grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)]'>
			{/* Left sidebar */}
			<aside className='lg:sticky lg:top-24 lg:self-start'>
				<nav
					aria-label='How it works sections'
					className='flex gap-1 overflow-x-auto lg:flex-col'
				>
					{SECTIONS.map((section) => {
						const isActive = active === section.id;
						return (
							<a
								key={section.id}
								href={`#${section.id}`}
								onClick={() => setActive(section.id)}
								aria-current={isActive ? 'true' : undefined}
								className={`rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors ${
									isActive
										? 'bg-primary-bg font-medium text-heading'
										: 'text-muted hover:bg-surface-2 hover:text-foreground'
								}`}
							>
								{section.title}
							</a>
						);
					})}
				</nav>
			</aside>

			{/* Content blocks, separated by dividers */}
			<div className='min-w-0'>
				{SECTIONS.map(({ id, Component }, i) => {
					return (
						<div
							key={id}
							id={id}
							className={`scroll-mt-24 py-8 first:pt-0 ${i > 0 ? 'border-t border-border' : ''}`}
						>
							<Component />
						</div>
					);
				})}
			</div>
		</div>
	);
}
