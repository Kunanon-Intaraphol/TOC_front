import type { MaskResponse } from '../../types/mask.types';

type MaskedOutputPanelProps = {
	data?: MaskResponse;
	isCopied: boolean;
	onCopy: () => void;
};

export default function MaskedOutputPanel({
	data,
	isCopied,
	onCopy,
}: MaskedOutputPanelProps) {
	return (
		<div className='surface-panel flex min-h-[380px] flex-1 flex-col justify-between rounded-3xl p-6 text-foreground sm:p-7'>
			<div className='flex min-h-0 flex-1 flex-col'>
				<div className='mb-4 flex items-center justify-between border-b border-border pb-4'>
					<div className='flex items-center gap-2.5'>
						<h2 className='text-base font-bold text-heading'>
							ผลลัพธ์การเซ็นเซอร์
						</h2>
					</div>
					<button
						type='button'
						onClick={onCopy}
						disabled={!data}
						className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
							isCopied
								? 'border-emerald-200 bg-emerald-500/10 text-emerald-700'
								: 'border-indigo-200 bg-indigo-500/5 text-indigo-600 hover:bg-indigo-500/10'
						}`}
					>
						<i
							className={`ph-bold ${isCopied ? 'ph-check' : 'ph-copy'} text-sm`}
						/>
						{isCopied ? 'คัดลอกแล้ว!' : 'คัดลอกผลลัพธ์'}
					</button>
				</div>

				<div className='relative flex min-h-0 flex-1 flex-col'>
					{!data ? (
						<div className='flex min-h-[220px] flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-2/50 p-6 text-center'>
							<p className='text-sm font-medium text-heading'>
								ผลลัพธ์จะแสดงที่นี่ . . .
							</p>
							<p className='mt-1 max-w-xs text-xs text-muted'>
								ใส่ข้อความที่คอลัมน์ซ้ายแล้วกดปุ่ม "ประมวลผลทันที"
							</p>
						</div>
					) : (
						<div className='flex min-h-0 flex-1 flex-col'>
							<div className='min-h-[220px] flex-1 overflow-y-auto rounded-2xl border border-border bg-surface-2/80 p-5 font-mono text-[13px] leading-relaxed text-foreground select-text whitespace-pre-wrap'>
								{data.masked_text}
							</div>
						</div>
					)}
				</div>
			</div>

			<div className='mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3.5 text-xs'>
				<div className='flex flex-wrap items-center gap-3'>
					<span className='flex items-center gap-1.5 font-semibold text-heading'>
						<i className='ph-bold ph-shield-check text-sm text-emerald-600' />{' '}
						PDPA B.E. 2562 Compliant
					</span>
					<span className='text-border'>|</span>
					<span className='font-medium text-foreground'>
						ตรวจพบและปิดบัง {data?.summary.total || 0} จุด
					</span>
					<span className='text-border'>|</span>
					<span className='font-mono text-muted'>
						{(data?.processing_time_ms || 0).toFixed(2)} ms
					</span>
				</div>
				{data && (
					<span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700'>
						<span className='h-1.5 w-1.5 rounded-full bg-emerald-500' /> Safe to
						export
					</span>
				)}
			</div>
		</div>
	);
}
