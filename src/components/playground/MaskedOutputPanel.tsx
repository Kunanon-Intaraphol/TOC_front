import { useEffect, useMemo, useRef } from 'react';
import { matchValueKey } from '../../types/common.types';
import type { MaskResponse } from '../../types/mask.types';
import type { Rule } from '../../types/rules.types';
import { RULE_THEMES } from './playground.themes';

function CopyIcon({ className = '' }: { className?: string }) {
	return (
		<svg
			viewBox='0 0 20 20'
			fill='none'
			aria-hidden='true'
			className={className}
		>
			<rect
				x='7'
				y='7'
				width='9'
				height='9'
				rx='2'
				stroke='currentColor'
				strokeWidth='1.8'
			/>
			<path
				d='M4 13V5a1 1 0 0 1 1-1h8'
				stroke='currentColor'
				strokeWidth='1.8'
				strokeLinecap='round'
			/>
		</svg>
	);
}

function CheckIcon({ className = '' }: { className?: string }) {
	return (
		<svg
			viewBox='0 0 20 20'
			fill='none'
			aria-hidden='true'
			className={className}
		>
			<path
				d='M4 10.5 8.5 15 16 6'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	);
}

type MaskedOutputPanelProps = {
	data?: MaskResponse;
	snapshotText?: string;
	ignoredValues?: string[];
	rules?: Rule[];
	isCopied: boolean;
	isProcessing?: boolean;
	onCopy: (text: string) => void;
	onSelectValue?: (ruleId: string, start: number, end: number) => void;
};

type HighlightSegment = {
	key: number;
	text: string;
	ruleId: string | null;
	label: string | null;
	start: number;
	end: number;
	ignored: boolean;
};

export default function MaskedOutputPanel({
	data,
	snapshotText = '',
	ignoredValues = [],
	rules = [],
	isCopied,
	isProcessing = false,
	onCopy,
	onSelectValue,
}: MaskedOutputPanelProps) {
	const lastDataRef = useRef<MaskResponse | undefined>(undefined);
	useEffect(() => {
		if (data) lastDataRef.current = data;
	}, [data]);
	const stableData = data ?? (snapshotText ? lastDataRef.current : undefined);
	const { segments, maskedCount } = useMemo(() => {
		const text = stableData?.masked_text ?? '';
		if (!text) return { segments: [], maskedCount: 0 };
		const ranges = (stableData?.matches ?? [])
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
					start: cursor,
					end: start,
					ignored: false,
				});
			}
			if (end > start) {
				const rawText = snapshotText.slice(start, end);
				const isIgnored = ignoredValues.includes(
					matchValueKey(match.rule_id, rawText),
				);

				result.push({
					key: result.length,
					text: isIgnored && rawText ? rawText : text.slice(start, end),
					ruleId: match.rule_id,
					label: match.label,
					start,
					end,
					ignored: isIgnored,
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
				start: cursor,
				end: text.length,
				ignored: false,
			});
		}
		return { segments: result, maskedCount: masked };
	}, [stableData, snapshotText, ignoredValues]);

	const displayText = useMemo(
		() => segments.map((segment) => segment.text).join(''),
		[segments],
	);
	return (
		<div className='surface-panel flex min-h-[380px] flex-1 flex-col justify-between rounded-3xl p-6 text-foreground sm:p-7 lg:min-h-0 lg:overflow-hidden'>
			<div className='flex min-h-0 flex-1 flex-col'>
				<div className='mb-4 flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-border pb-4'>
					<div className='flex flex-wrap items-center gap-x-2.5 gap-y-2'>
						<h2 className='text-base font-bold text-heading'>
							ผลลัพธ์การเซ็นเซอร์
						</h2>
						{rules.map((rule) => {
							const theme = RULE_THEMES[rule.id] ?? RULE_THEMES.default;
							return (
								<span
									key={rule.id}
									className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${theme.badgeBg} ${theme.badgeTheme}`}
								>
									{rule.label_th || rule.label_en}
								</span>
							);
						})}
					</div>
					<button
						type='button'
						onClick={() => onCopy(displayText)}
						disabled={!stableData}
						className={`theme-accent flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
							isCopied
								? 'border-emerald-200 bg-emerald-500/10 text-emerald-700'
								: 'border-indigo-200 bg-indigo-500/5 text-indigo-600 hover:bg-indigo-500/10'
						}`}
					>
						{isCopied ? (
							<CheckIcon className='h-4 w-4' />
						) : (
							<CopyIcon className='h-4 w-4' />
						)}
						{isCopied ? 'คัดลอกแล้ว!' : 'คัดลอกผลลัพธ์'}
					</button>
				</div>

				<div className='relative flex min-h-0 flex-1 flex-col'>
					{isProcessing && !stableData ? (
						<div className='flex min-h-[220px] flex-1 flex-col justify-center gap-2.5 rounded-2xl border border-border bg-surface p-5 lg:min-h-0'>
							<div className='skeleton h-4 w-11/12 rounded-lg' />
							<div className='skeleton h-4 w-full rounded-lg' />
							<div className='skeleton h-4 w-4/5 rounded-lg' />
							<div className='skeleton h-4 w-3/5 rounded-lg' />
						</div>
					) : !stableData ? (
						<div className='animate-enter flex min-h-[220px] flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-2/50 p-6 text-center lg:min-h-0'>
							<p className='text-sm font-medium text-heading'>
								ผลลัพธ์จะแสดงที่นี่ . . .
							</p>
							<p className='mt-1 max-w-xs text-xs text-muted'>
								ใส่ข้อความที่คอลัมน์ซ้ายแล้วกดปุ่ม "ประมวลผลทันที"
							</p>
						</div>
					) : (
						<div className='animate-enter flex min-h-0 flex-1 flex-col'>
							{isProcessing && (
								<div className='skeleton mb-2 h-1.5 w-full shrink-0 rounded-full' />
							)}
							<div className='min-h-[220px] flex-1 overflow-y-auto rounded-2xl border border-border bg-surface p-5 font-mono text-[13px] leading-relaxed text-foreground select-text whitespace-pre-wrap lg:min-h-0'>
								{segments.map((segment) => {
									if (!segment.ruleId) return segment.text;
									const theme =
										RULE_THEMES[segment.ruleId] ?? RULE_THEMES.default;
									const spotlight = () =>
										onSelectValue?.(
											segment.ruleId as string,
											segment.start,
											segment.end,
										);
									return (
										<mark
											key={segment.key}
											title={segment.label ?? segment.ruleId}
											onMouseEnter={spotlight}
											onClick={spotlight}
											className={`cursor-pointer rounded px-0.5 ${
												segment.ignored
													? 'bg-red-100/70 text-red-700 theme-badge-red'
													: `${theme.badgeBg} ${theme.badgeTheme}`
											}`}
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
						{(stableData?.processing_time_ms || 0).toFixed(2)} ms
					</span>
				</span>
			</div>
		</div>
	);
}
