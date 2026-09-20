import { SAMPLES } from '../../constants/playground.constants';

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
							title='เปิดไว้ ระบบจะประมวลผลอัตโนมัติเมื่อแก้ไขข้อความ'
							onClick={onToggleAutoMode}
							className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
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
						</button>
						<button
							type='button'
							onClick={onPaste}
							className='flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-500/5 px-3 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-500/10'
						>
							<i className='ph ph-clipboard-text text-sm' /> วางข้อความ
						</button>
						<button
							type='button'
							onClick={onClear}
							className='flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground'
						>
							<i className='ph ph-trash text-sm' /> ล้าง
						</button>
						<button
							type='button'
							onClick={onMask}
							disabled={isMaskPending || !inputText.trim()}
							className='flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all hover:from-indigo-700 hover:to-indigo-800 active:scale-95 disabled:opacity-50 disabled:active:scale-100'
						>
							{isMaskPending ? (
								<i className='ph-bold ph-spinner animate-spin text-sm text-white' />
							) : (
								<i className='ph-bold ph-lightning text-sm text-amber-300' />
							)}
							<span>ประมวลผลทันที</span>
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

			<div className='mt-4 flex shrink-0 flex-wrap items-center gap-2 border-t border-border pt-3.5 text-xs'>
				<span className='flex items-center gap-1 font-semibold text-muted'>
					<i className='ph-bold ph-lightning text-sm text-amber-500' />{' '}
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
		</div>
	);
}
