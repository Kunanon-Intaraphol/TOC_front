import { useEffect, useState } from 'react';
import t1 from '../../assets/p1-12/t1.jpg';
import t10 from '../../assets/p1-12/t10.jpg';
import t11 from '../../assets/p1-12/t11.jpg';
import t12 from '../../assets/p1-12/t12.png';
import t2 from '../../assets/p1-12/t2.jpg';
import t3 from '../../assets/p1-12/t3.jpg';
import t4 from '../../assets/p1-12/t4.jpg';
import t5 from '../../assets/p1-12/t5.jpg';
import t6 from '../../assets/p1-12/t6.jpg';
import t7 from '../../assets/p1-12/t7.jpg';
import t8 from '../../assets/p1-12/t8.jpg';
import t9 from '../../assets/p1-12/t9.jpg';

type TeamMember = {
	id: number;
	name: string;
	role: string;
	img: string;
};

const TEAM_MEMBERS: TeamMember[] = [
	{
		id: 1,
		name: 'ณัฐชนน ชัยสิทธิฤกษ์กุล',
		role: 'Tech Lead',
		img: t1,
	},
	{
		id: 3,
		name: 'คุณานนต์ อินทรพล',
		role: 'Frontend',
		img: t3,
	},
	{
		id: 5,
		name: 'ติณณ์ สูงเมฆ',
		role: 'Frontend',
		img: t5,
	},
	{
		id: 6,
		name: 'เตชินท์ แสงรัตน์',
		role: 'Frontend',
		img: t6,
	},
	{
		id: 12,
		name: 'จักรภัทร แก้วทอง',
		role: 'Frontend',
		img: t12,
	},
	{
		id: 7,
		name: 'พนธกร เกษร',
		role: 'Backend',
		img: t7,
	},
	{
		id: 8,
		name: 'บุณวรัตถ์ ประสารพันธุ์',
		role: 'Backend',
		img: t8,
	},
	{
		id: 10,
		name: 'ธชาดล วงค์พนิตกฤต',
		role: 'Backend',
		img: t10,
	},
	{
		id: 11,
		name: 'ปริญญา ขำเหม',
		role: 'Backend',
		img: t11,
	},
	{
		id: 2,
		name: 'คม วานิชกิตติกูล',
		role: 'DevOps',
		img: t2,
	},
	{
		id: 4,
		name: 'ธนดล แกมทอง',
		role: 'QA Engineer',
		img: t4,
	},
	{
		id: 9,
		name: 'ชวัลวิทย์ ใช้เทียมวงศ์',
		role: 'QA Engineer',
		img: t9,
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
