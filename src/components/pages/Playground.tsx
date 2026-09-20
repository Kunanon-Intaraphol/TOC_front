import { useState, useEffect, useMemo } from 'react';
import { useRulesQuery } from '../../services/rules.service';
import { useMaskMutation } from '../../services/mask.service';
import type { RuleId } from '../../types/common.types';
import {
	DEFAULT_SAMPLE_TEXT,
	INPUT_DEBOUNCE_DELAY_MS,
	SAMPLES,
} from '../../constants/playground.constants';

type RuleTheme = {
	icon: string;
	group: string;
	border: string;
	badgeBg: string;
};

const RULE_THEMES: Record<string, RuleTheme> = {
	address: {
		icon: 'ph-map-pin text-amber-500',
		group: 'group-hover:text-amber-800',
		border: 'hover:border-amber-300 hover:bg-amber-50/30',
		badgeBg: 'bg-amber-100/70 text-amber-700',
	},
	credit_card: {
		icon: 'ph-credit-card text-rose-500',
		group: 'group-hover:text-rose-800',
		border: 'hover:border-rose-300 hover:bg-rose-50/30',
		badgeBg: 'bg-rose-100/70 text-rose-700',
	},
	dob: {
		icon: 'ph-calendar text-fuchsia-500',
		group: 'group-hover:text-fuchsia-800',
		border: 'hover:border-fuchsia-300 hover:bg-fuchsia-50/30',
		badgeBg: 'bg-fuchsia-100/70 text-fuchsia-700',
	},
	email: {
		icon: 'ph-envelope-simple text-emerald-500',
		group: 'group-hover:text-emerald-800',
		border: 'hover:border-emerald-300 hover:bg-emerald-50/30',
		badgeBg: 'bg-emerald-100/70 text-emerald-700',
	},
	phone: {
		icon: 'ph-phone-call text-blue-500',
		group: 'group-hover:text-blue-800',
		border: 'hover:border-blue-300 hover:bg-blue-50/30',
		badgeBg: 'bg-blue-100/70 text-blue-700',
	},
	default: {
		icon: 'ph-identification-card text-purple-600',
		group: 'group-hover:text-purple-800',
		border: 'hover:border-purple-300 hover:bg-purple-50/30',
		badgeBg: 'bg-purple-100/70 text-purple-700',
	},
};

export default function Playground() {
	const [inputText, setInputText] = useState(DEFAULT_SAMPLE_TEXT);
	const [customSelectedRules, setCustomSelectedRules] = useState<
		RuleId[] | null
	>(null);
	const [isCopied, setIsCopied] = useState(false);
	const [isAutoMode, setIsAutoMode] = useState(true);

	const { data: rulesData, isLoading: isRulesLoading } = useRulesQuery();
	const maskMutation = useMaskMutation();

	const selectedRules = useMemo(
		() => customSelectedRules ?? rulesData?.rules.map((rule) => rule.id) ?? [],
		[customSelectedRules, rulesData],
	);

	const { mutate: runMask } = maskMutation;

	useEffect(() => {
		if (!isAutoMode || !inputText.trim()) return;

		const debounceTimer = setTimeout(() => {
			runMask({
				text: inputText,
				enabled_rules: selectedRules,
				include_matches: true,
			});
		}, INPUT_DEBOUNCE_DELAY_MS);

		return () => clearTimeout(debounceTimer);
	}, [inputText, selectedRules, isAutoMode, runMask]);

	const handleToggleRule = (id: RuleId) => {
		setCustomSelectedRules((prev) => {
			const current = prev ?? rulesData?.rules.map((r) => r.id) ?? [];
			return current.includes(id)
				? current.filter((r) => r !== id)
				: [...current, id];
		});
	};

	const handleToggleAll = () => {
		if (rulesData?.rules) {
			if (selectedRules.length === rulesData.rules.length) {
				setCustomSelectedRules([]);
			} else {
				setCustomSelectedRules(rulesData.rules.map((r) => r.id));
			}
		}
	};

	const handleMask = () => {
		if (!inputText.trim()) return;
		runMask({
			text: inputText,
			enabled_rules: selectedRules,
			include_matches: true,
		});
	};

	const handleCopy = () => {
		if (maskMutation.data?.masked_text) {
			navigator.clipboard.writeText(maskMutation.data.masked_text);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 1800);
		}
	};

	return (
		<div className='flex min-h-[calc(100vh-4rem)] flex-1 flex-col font-sans text-foreground selection:bg-indigo-500 selection:text-white'>
			<section className='mx-auto max-w-4xl px-4 pb-6 pt-4 text-center'>
				<h1 className='text-3xl font-bold leading-tight tracking-tight text-heading sm:text-4xl md:text-[2.4rem]'>
					ระบบเซ็นเซอร์ข้อมูลลูกค้าเพื่อความปลอดภัย
				</h1>
				<p className='mt-2 text-base font-normal text-muted sm:text-lg'>
					ทดสอบการทำงานของ Regular Expression ในการทำ Data Masking สำหรับ PDPA
				</p>
			</section>

			<main className='mx-auto flex w-full max-w-[1520px] flex-1 flex-col px-4 pb-10 sm:px-6 lg:px-8'>
				<div className='mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6'>
					<div className='surface-panel rounded-3xl p-6 shadow-2xl shadow-black/10 sm:p-7'>
						<div className='flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4'>
							<div className='flex items-center gap-3'>
								<div>
									<div className='flex items-center gap-2'>
										<h2 className='text-base font-bold text-heading sm:text-lg'>
											เงื่อนไขการตรวจจับและเซ็นเซอร์ข้อมูล
										</h2>
										<span className='rounded-full border border-indigo-200 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600'>
											{rulesData?.rules.length ?? 6} กฎมาตรฐาน PDPA
										</span>
									</div>
									<p className='mt-0.5 text-xs text-muted'>
										เลือกหมวดหมู่ข้อมูลส่วนบุคคล (PII)
										ที่ต้องการปิดบังและกำหนดรูปแบบการ Mask อัตโนมัติ
									</p>
								</div>
							</div>

							<div className='flex flex-wrap items-center gap-3'>
								<label className='flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-1.5 transition-colors hover:border-border hover:bg-surface-3'>
									<div className='relative flex items-center'>
										<input
											type='checkbox'
											className='peer sr-only'
											checked={isAutoMode}
											onChange={() => setIsAutoMode(!isAutoMode)}
										/>
										<div className='h-4 w-7 rounded-full bg-surface-3 shadow-inner ring-1 ring-border ring-inset transition-colors peer-checked:bg-indigo-500 peer-checked:ring-indigo-500'></div>
										<div className='absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-3'></div>
									</div>
									<span className='text-xs font-semibold text-foreground select-none'>
										Auto
									</span>
								</label>

								<button
									type='button'
									onClick={handleToggleAll}
									className='flex items-center gap-1.5 rounded-xl border border-border bg-surface-2 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-border hover:bg-surface-3'
								>
									<i
										className={`ph ph-${
											rulesData?.rules &&
											selectedRules.length === rulesData.rules.length
												? 'x-circle text-muted'
												: 'check-circle text-indigo-600'
										}`}
									/>
									<span>
										{rulesData?.rules &&
										selectedRules.length === rulesData.rules.length
											? 'ยกเลิกทั้งหมด'
											: 'เลือกทั้งหมด'}
									</span>
								</button>
							</div>
						</div>

						<div className='grid grid-cols-1 gap-3 pt-4 md:grid-cols-2 lg:grid-cols-3'>
							{isRulesLoading ? (
								<div className='col-span-full flex h-24 items-center justify-center text-muted'>
									กำลังโหลดกฎการเซ็นเซอร์...
								</div>
							) : (
								rulesData?.rules.map((rule) => {
									const theme = RULE_THEMES[rule.id] || RULE_THEMES.default;
									return (
										<label
											key={rule.id}
											className={`flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-surface-2/70 p-3.5 shadow-sm transition-all ${theme.border}`}
										>
											<input
												type='checkbox'
												checked={selectedRules.includes(rule.id)}
												onChange={() => handleToggleRule(rule.id)}
												className='mt-0.5 h-4 w-4 cursor-pointer rounded border-border text-indigo-600 focus:ring-indigo-500/20'
											/>
											<div className='flex-1 select-none'>
												<div className='flex items-center justify-between gap-2'>
													<span
														className={`flex items-center gap-1.5 text-xs font-bold text-heading transition-colors ${theme.group}`}
													>
														<i className={`ph-fill ${theme.icon} text-sm`} />{' '}
														{rule.label_th}
													</span>
													<span
														className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-medium ${theme.badgeBg}`}
													>
														{rule.example_after}
													</span>
												</div>
												<p className='mt-1 text-[11px] leading-snug text-muted'>
													{rule.description}
												</p>
											</div>
										</label>
									);
								})
							)}
						</div>
					</div>

					<div className='grid min-h-0 flex-1 grid-cols-1 items-stretch gap-6 lg:grid-cols-2'>
						<div className='surface-panel flex min-h-[480px] flex-1 flex-col justify-between rounded-3xl p-6 text-foreground sm:p-7'>
							<div className='flex min-h-0 flex-1 flex-col'>
								<div className='mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4'>
									<div className='flex items-center gap-2.5'>
										<h2 className='text-base font-bold text-heading'>
											ป้อนข้อความต้นฉบับ
										</h2>
									</div>

									<div className='flex flex-wrap items-center gap-2'>
										<button
											type='button'
											onClick={async () => {
												const text = await navigator.clipboard.readText();
												setInputText(text);
											}}
											className='flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-500/5 px-3 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-500/10'
										>
											<i className='ph ph-clipboard-text text-sm' /> วางข้อความ
										</button>
										<button
											type='button'
											onClick={() => setInputText('')}
											className='flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground'
										>
											<i className='ph ph-trash text-sm' /> ล้าง
										</button>
										<button
											type='button'
											onClick={handleMask}
											disabled={maskMutation.isPending || !inputText.trim()}
											className='flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all hover:from-indigo-700 hover:to-indigo-800 active:scale-95 disabled:opacity-50 disabled:active:scale-100'
										>
											{maskMutation.isPending ? (
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
										onChange={(e) => setInputText(e.target.value)}
										className='min-h-[300px] w-full flex-1 resize-none rounded-2xl border border-border bg-surface-2/80 p-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted transition duration-150 focus:border-indigo-400 focus:bg-surface focus:ring-4 focus:ring-indigo-500/15'
										placeholder='วาง Log ของระบบธนาคาร หรือข้อความที่มีข้อมูลส่วนบุคคลที่นี่...'
									/>
								</div>
							</div>

							<div className='mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3.5 text-xs'>
								<div className='flex flex-wrap items-center gap-2'>
									<span className='flex items-center gap-1 font-semibold text-muted'>
										<i className='ph-bold ph-lightning text-sm text-amber-500' />{' '}
										ตัวอย่างชุดข้อมูล:
									</span>
									<button
										type='button'
										onClick={() => setInputText(SAMPLES.bank)}
										className='rounded-xl border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-indigo-500/5 hover:text-indigo-600'
									>
										Log ธนาคารโอนเงิน
									</button>
									<button
										type='button'
										onClick={() => setInputText(SAMPLES.ecommerce)}
										className='rounded-xl border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-indigo-500/5 hover:text-indigo-600'
									>
										คำสั่งซื้อ E-Commerce
									</button>
								</div>
								<span className='text-[11px] text-muted'>
									API Connection Active
								</span>
							</div>
						</div>

						<div className='surface-panel flex min-h-[480px] flex-1 flex-col justify-between rounded-3xl p-6 text-foreground sm:p-7'>
							<div className='flex min-h-0 flex-1 flex-col'>
								<div className='mb-4 flex items-center justify-between border-b border-border pb-4'>
									<div className='flex items-center gap-2.5'>
										<h2 className='text-base font-bold text-heading'>
											ผลลัพธ์การเซ็นเซอร์
										</h2>
									</div>
									<button
										type='button'
										onClick={handleCopy}
										disabled={!maskMutation.data}
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
									{!maskMutation.data ? (
										<div className='flex min-h-[300px] flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-2/50 p-6 text-center'>
											<p className='text-sm font-medium text-heading'>
												ผลลัพธ์จะแสดงที่นี่ . . .
											</p>
											<p className='mt-1 max-w-xs text-xs text-muted'>
												ใส่ข้อความที่คอลัมน์ซ้ายแล้วกดปุ่ม "ประมวลผลทันที"
											</p>
										</div>
									) : (
										<div className='flex min-h-0 flex-1 flex-col'>
											<div className='min-h-[300px] flex-1 overflow-y-auto rounded-2xl border border-border bg-surface-2/80 p-5 font-mono text-[13px] leading-relaxed text-foreground select-text whitespace-pre-wrap'>
												{maskMutation.data.masked_text}
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
										ตรวจพบและปิดบัง {maskMutation.data?.summary.total || 0} จุด
									</span>
									<span className='text-border'>|</span>
									<span className='font-mono text-muted'>
										{(maskMutation.data?.processing_time_ms || 0).toFixed(2)} ms
									</span>
								</div>
								{maskMutation.data && (
									<span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700'>
										<span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />{' '}
										Safe to export
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
