import { useMemo } from 'react';
import { matchValueKey } from '../../types/common.types';
import type { MaskResponse } from '../../types/mask.types';
import { RULE_THEMES } from './playground.themes';

type MaskedOutputPanelProps = {
	data?: MaskResponse;
	snapshotText?: string;
	ignoredValues?: string[];
	isCopied: boolean;
	onCopy: (text: string) => void;
};

type HighlightSegment = {
	key: number;
	text: string;
	ruleId: string | null;
	label: string | null;
};

export default function MaskedOutputPanel({
	data,
	snapshotText = '',
	ignoredValues = [],
	isCopied,
	onCopy,
}: MaskedOutputPanelProps) {
	const { segments, maskedCount } = useMemo(() => {
		const text = data?.masked_text ?? '';
		if (!text) return { segments: [], maskedCount: 0 };
		const ranges = (data?.matches ?? [])
			.filter((match) => match.start < match.end)
			.sort((a, b) => a.start - b.start);

		const result: HighlightSegment[] = [];
		let cursor = 0;
		let masked = 0;
		for (const match of ranges) {
			if (match.start < cursor) continue;
			const start = Math.max(0, match.start);
			const end = Math.min(text.length, match.end);
			if (start > cursor) {
				result.push({
					key: result.length,
					text: text.slice(cursor, start),
					ruleId: null,
					label: null,
				});
			}
			if (end > start) {
				const rawText = snapshotText.slice(start, end);
				const isIgnored = ignoredValues.includes(
					matchValueKey(match.rule_id, rawText),
				);
				// Ignored values are spliced back to their raw form.
				result.push({
					key: result.length,
					text: isIgnored && rawText ? rawText : text.slice(start, end),
					ruleId: isIgnored ? null : match.rule_id,
					label: isIgnored ? null : match.label,
				});
				if (!isIgnored) masked += 1;
			}
			cursor = end;
		}
		if (cursor < text.length) {
			result.push({
				key: result.length,
				text: text.slice(cursor),
				ruleId: null,
				label: null,
			});
		}
		return { segments: result, maskedCount: masked };
	}, [data, snapshotText, ignoredValues]);

	const displayText = useMemo(
		() => segments.map((segment) => segment.text).join(''),
		[segments],
	);
	return (
		<div className='surface-panel flex min-h-[380px] flex-1 flex-col justify-between rounded-3xl p-6 text-foreground sm:p-7 lg:min-h-0 lg:overflow-hidden'>
			<div className='flex min-h-0 flex-1 flex-col'>
				<div className='mb-4 flex shrink-0 items-center justify-between border-b border-border pb-4'>
					<div className='flex items-center gap-2.5'>
						<h2 className='text-base font-bold text-heading'>
							ผลลัพธ์การเซ็นเซอร์
						</h2>
					</div>
					<button
						type='button'
						onClick={() => onCopy(displayText)}
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
						<div className='flex min-h-[220px] flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-2/50 p-6 text-center lg:min-h-0'>
							<p className='text-sm font-medium text-heading'>
								ผลลัพธ์จะแสดงที่นี่ . . .
							</p>
							<p className='mt-1 max-w-xs text-xs text-muted'>
								ใส่ข้อความที่คอลัมน์ซ้ายแล้วกดปุ่ม "ประมวลผลทันที"
							</p>
						</div>
					) : (
						<div className='flex min-h-0 flex-1 flex-col'>
							<div className='min-h-[220px] flex-1 overflow-y-auto rounded-2xl border border-border bg-surface p-5 font-mono text-[13px] leading-relaxed text-foreground select-text whitespace-pre-wrap lg:min-h-0'>
								{segments.map((segment) => {
									if (!segment.ruleId) return segment.text;
									const theme =
										RULE_THEMES[segment.ruleId] ?? RULE_THEMES.default;
									return (
										<mark
											key={segment.key}
											title={segment.label ?? segment.ruleId}
											className={`rounded px-0.5 ${theme.badgeBg}`}
										>
											{segment.text}
										</mark>
									);
								})}
							</div>
						</div>
					)}
				</div>
			</div>

			<div className='mt-4 flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border pt-3.5 text-xs'>
				<span className='font-medium text-foreground'>
					ตรวจพบและปิดบัง {maskedCount} จุด
				</span>
				<span className='text-muted'>
					เวลาที่ใช้ในการประมวลผล{' '}
					<span className='font-mono'>
						{(data?.processing_time_ms || 0).toFixed(2)} ms
					</span>
				</span>
			</div>
		</div>
	);
}
