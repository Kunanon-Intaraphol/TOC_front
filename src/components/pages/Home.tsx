import { Link } from 'react-router';

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
		</div>
	);
}
