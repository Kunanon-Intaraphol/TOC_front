import { useEffect, useState } from 'react';

type TeamMember = {
	id: number;
	name: string;
	role: string;
	img: string;
};

const TEAM_MEMBERS: TeamMember[] = [
	{
		id: 1,
		name: 'Tachin Sangrat',
		role: 'Frontend',
		img: 'https://i.pravatar.cc/600?img=11',
	},
	{
		id: 2,
		name: 'Andrew Wilson',
		role: 'Backend',
		img: 'https://i.pravatar.cc/600?img=12',
	},
	{
		id: 3,
		name: 'Fernando Ruiz',
		role: 'DevOps',
		img: 'https://i.pravatar.cc/600?img=13',
	},
	{
		id: 4,
		name: 'Sarah Smith',
		role: 'UX/UI',
		img: 'https://i.pravatar.cc/600?img=47',
	},
	{
		id: 5,
		name: 'Sebastian Cole',
		role: 'Tech Lead',
		img: 'https://i.pravatar.cc/600?img=15',
	},
	{
		id: 6,
		name: 'Gerald Hines',
		role: 'QA Eng',
		img: 'https://i.pravatar.cc/600?img=16',
	},
	{
		id: 7,
		name: 'Julian Bates',
		role: 'Data Sci',
		img: 'https://i.pravatar.cc/600?img=17',
	},
	{
		id: 8,
		name: 'Durrent M.',
		role: 'Security',
		img: 'https://i.pravatar.cc/600?img=68',
	},
	{
		id: 9,
		name: 'Rosario Diaz',
		role: 'Product',
		img: 'https://i.pravatar.cc/600?img=19',
	},
	{
		id: 10,
		name: 'Kim Lee',
		role: 'Mobile Dev',
		img: 'https://i.pravatar.cc/600?img=20',
	},
	{
		id: 11,
		name: 'Lucio V.',
		role: 'SysAdmin',
		img: 'https://i.pravatar.cc/600?img=33',
	},
	{
		id: 12,
		name: 'Maya Patel',
		role: 'Scrum Master',
		img: 'https://i.pravatar.cc/600?img=5',
	},
];

export default function About() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [rotationReset, setRotationReset] = useState(0);

	useEffect(() => {
		const timer = window.setTimeout(() => {
			setActiveIndex((index) => (index + 1) % TEAM_MEMBERS.length);
		}, 5000);
		return () => window.clearTimeout(timer);
	}, [activeIndex, rotationReset]);

	const activeMember = TEAM_MEMBERS[activeIndex];

	const selectMember = (index: number) => {
		setActiveIndex(index);
		setRotationReset((value) => value + 1);
	};

	return (
		<section className='about-team' aria-labelledby='about-team-title'>
			<div className='about-team-visual'>
				<div className='about-team-mark' aria-hidden='true'>
					{activeMember.role}
				</div>
				<img
					key={activeMember.id}
					src={activeMember.img}
					alt={activeMember.name}
					className='about-team-photo'
				/>
			</div>

			<div className='about-team-list-panel'>
				<header className='about-team-header'>
					<div>
						<h1 id='about-team-title'>
							Starting <span>XII</span>
						</h1>
						<p>Our core team</p>
					</div>
				</header>

				<div className='about-team-members'>
					{TEAM_MEMBERS.map((member, index) => {
						const isActive = index === activeIndex;
						return (
							<button
								key={member.id}
								type='button'
								onClick={() => selectMember(index)}
								className={`about-member ${isActive ? 'is-active' : ''}`}
							>
								<span className='about-member-role'>{member.role}</span>
								<span className='about-member-name'>{member.name}</span>
							</button>
						);
					})}
				</div>
			</div>
		</section>
	);
}
