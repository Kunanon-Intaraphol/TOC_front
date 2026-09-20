import { SAMPLES } from '../../constants/playground.constants';

function PasteIcon({ className = '' }: { className?: string }) {
	return (
		<svg
			viewBox='0 0 20 20'
			fill='none'
			aria-hidden='true'
			className={className}
		>
			<rect
				x='5'
				y='4'
				width='10'
				height='13'
				rx='2'
				stroke='currentColor'
				strokeWidth='1.8'
			/>
			<path
				d='M8 4V2.5h4V4M8 9.5h4M8 12.5h4'
				stroke='currentColor'
				strokeWidth='1.8'
				strokeLinecap='round'
			/>
		</svg>
	);
}

function TrashIcon({ className = '' }: { className?: string }) {
	return (
		<svg
			viewBox='0 0 20 20'
			fill='none'
			aria-hidden='true'
			className={className}
		>
			<path
				d='M4 5h12M8 5V3.5h4V5M6.5 5l.8 11h5.4l.8-11M9.5 8.5v5M12.5 8.5v5'
				stroke='currentColor'
				strokeWidth='1.8'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	);
}

function SpinnerIcon({ className = '' }: { className?: string }) {
	return (
		<svg
			viewBox='0 0 20 20'
			fill='none'
			aria-hidden='true'
			className={className}
		>
			<path
				d='M10 2a8 8 0 1 0 8 8'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
		</svg>
	);
}

type InputPanelProps = {
	inputText: string;
	onInputTextChange: (value: string) => void;
	onMask: () => void;
	isMaskPending: boolean;
	isAutoMode: boolean;
	onToggleAutoMode: () => void;
	onClear: () => void;
	onPaste: () => void;
	onSelectSample: (sampleText: string) => void;
};

export default function InputPanel({
	inputText,
	onInputTextChange,
	onMask,
	isMaskPending,
	isAutoMode,
	onToggleAutoMode,
	onClear,
	onPaste,
	onSelectSample,
}: InputPanelProps) {
	return (
		<div className='surface-panel flex min-h-[380px] flex-1 flex-col justify-between rounded-3xl p-6 text-foreground sm:p-7 lg:min-h-0 lg:overflow-hidden'>
			<div className='flex min-h-0 flex-1 flex-col'>
				<div className='mb-4 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border pb-4'>
					<div className='flex items-center gap-2.5'>
						<h2 className='text-base font-bold text-heading'>
							ป้อนข้อความต้นฉบับ
						</h2>
					</div>

					<div className='flex flex-wrap items-center gap-2'>
						<button
							type='button'
							role='switch'
							aria-checked={isAutoMode}
							onClick={onToggleAutoMode}
							className={`group relative flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
								isAutoMode
									? 'border-indigo-200 bg-indigo-500/10 text-indigo-700'
									: 'border-border bg-surface-2 text-muted hover:text-foreground'
							}`}
						>
							<span
								aria-hidden='true'
								className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${
									isAutoMode
										? 'bg-indigo-500'
										: 'bg-surface-3 ring-1 ring-border ring-inset'
								}`}
							>
								<span
									className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${
										isAutoMode ? 'translate-x-3' : ''
									}`}
								/>
							</span>
							<span>ประมวลผลอัตโนมัติ</span>
							<span
								aria-hidden='true'
								className='inline-flex h-4 w-4 items-center justify-center opacity-60 transition-opacity group-hover:opacity-100'
							>
								<svg viewBox='0 0 16 16' className='h-4 w-4'>
									<circle
										cx='8'
										cy='8'
										r='6.5'
										fill='none'
										stroke='currentColor'
										strokeWidth='1.5'
									/>
									<text
										x='8'
										y='11.2'
										textAnchor='middle'
										fontSize='9'
										fontWeight='700'
										fill='currentColor'
									>
										?
									</text>
								</svg>
							</span>
							<span
								aria-hidden='true'
								className='pointer-events-none absolute top-full left-0 z-20 mt-2.5 translate-y-1 rounded-xl bg-neutral-900 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100'
							>
								เปิดไว้ ระบบจะประมวลผลอัตโนมัติเมื่อแก้ไขข้อความ
							</span>
						</button>
						<button
							type='button'
							onClick={onPaste}
							className='flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-500/5 px-3 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-500/10'
						>
							<PasteIcon className='h-4 w-4' /> วางข้อความ
						</button>
					</div>
				</div>

				<div className='relative flex min-h-0 flex-1 flex-col'>
					<textarea
						value={inputText}
						onChange={(e) => onInputTextChange(e.target.value)}
						className='min-h-[220px] w-full flex-1 resize-none rounded-2xl border border-border bg-surface p-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted transition duration-150 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 lg:min-h-0'
						placeholder='วาง Log ของระบบธนาคาร หรือข้อความที่มีข้อมูลส่วนบุคคลที่นี่...'
					/>
				</div>
			</div>

			<div className='mt-4 flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border pt-3.5 text-xs'>
				<div className='flex flex-wrap items-center gap-2'>
					<span className='flex items-center gap-1 font-semibold text-muted'>
						ตัวอย่างชุดข้อมูล:
					</span>
					<button
						type='button'
						onClick={() => onSelectSample(SAMPLES.capybara)}
						className='rounded-xl border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-indigo-500/5 hover:text-indigo-600'
					>
						คาปิบาร่าชิลล์ชิลล์
					</button>
					<button
						type='button'
						onClick={() => onSelectSample(SAMPLES.batman)}
						className='rounded-xl border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-indigo-500/5 hover:text-indigo-600'
					>
						แบทแมน อัศวินรัตติกาล
					</button>
				</div>
				<div className='flex flex-wrap items-center gap-2'>
					<button
						type='button'
						onClick={onClear}
						className='flex items-center gap-1.5 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground'
					>
						<TrashIcon className='h-4 w-4' /> ล้าง
					</button>
					<button
						type='button'
						onClick={onMask}
						disabled={isMaskPending || !inputText.trim()}
						className='flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition-all hover:from-indigo-700 hover:to-indigo-800 active:scale-95 disabled:opacity-50 disabled:active:scale-100'
					>
						{isMaskPending && (
							<SpinnerIcon className='h-4 w-4 animate-spin text-white' />
						)}
						<span>ประมวลผลทันที</span>
					</button>
				</div>
			</div>
		</div>
	);
}
