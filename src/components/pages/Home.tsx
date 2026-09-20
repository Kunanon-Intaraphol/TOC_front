import { Link } from 'react-router';

const FEATURES = [
	{
		title: 'ตรวจจับอัตโนมัติ',
		description:
			'พิมพ์หรือวางข้อความ ระบบจะตรวจจับข้อมูลส่วนบุคคลและเซ็นเซอร์ให้ทันที',
	},
	{
		title: 'สอดคล้องกับ PDPA',
		description:
			'ปกปิดข้อมูลอ่อนไหวตามแนวทาง พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562',
	},
	{
		title: 'กฎที่ปรับได้',
		description:
			'เลือกเปิดหรือปิดประเภทข้อมูลที่จะเซ็นเซอร์ได้ตามต้องการ ทีละค่า',
	},
];

export default function Home() {
	return (
		<div className='mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 py-10 text-center'>
			<h1 className='text-3xl font-bold leading-tight tracking-tight text-heading sm:text-4xl md:text-[2.4rem]'>
				ระบบเซ็นเซอร์ข้อมูลลูกค้าเพื่อความปลอดภัย
			</h1>
			<p className='mt-2 text-base font-normal text-muted sm:text-lg'>
				ทดสอบการทำงานของ Regular Expression ในการทำ Data Masking สำหรับ PDPA
			</p>

			<div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
				<Link
					to='/playground'
					className='rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition-all hover:from-indigo-700 hover:to-indigo-800 active:scale-95'
				>
					เริ่มทดลองใช้งาน
				</Link>
				<Link
					to='/how-it-works'
					className='rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2'
				>
					ดูวิธีการทำงาน
				</Link>
			</div>

			<div className='mt-12 grid grid-cols-1 gap-4 text-left sm:grid-cols-3'>
				{FEATURES.map((feature) => (
					<div key={feature.title} className='surface-panel rounded-3xl p-6'>
						<h2 className='text-sm font-bold text-heading'>{feature.title}</h2>
						<p className='mt-1.5 text-xs leading-relaxed text-muted'>
							{feature.description}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
