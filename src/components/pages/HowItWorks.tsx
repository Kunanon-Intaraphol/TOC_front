import { useEffect, useRef, useState } from 'react';
import { useMaskMutation } from '../../services/mask.service';
import { useRulesQuery } from '../../services/rules.service';
import type { Rule } from '../../types/rules.types';
import { RULE_THEMES } from '../playground/playground.themes';

function DocIcon({ className = '' }: { className?: string }) {
	return (
		<svg
			viewBox='0 0 20 20'
			fill='none'
			aria-hidden='true'
			className={className}
		>
			<path
				d='M5 2.5h6l4 4v11H5v-15Z'
				stroke='currentColor'
				strokeWidth='1.8'
				strokeLinejoin='round'
			/>
			<path
				d='M11 2.5v4h4M8 10.5h4M8 13.5h4'
				stroke='currentColor'
				strokeWidth='1.8'
				strokeLinecap='round'
			/>
		</svg>
	);
}

function ShieldIcon({ className = '' }: { className?: string }) {
	return (
		<svg
			viewBox='0 0 20 20'
			fill='none'
			aria-hidden='true'
			className={className}
		>
			<path
				d='M10 2 4.5 4.5v5c0 3.5 2.3 6 5.5 7.5 3.2-1.5 5.5-4 5.5-7.5v-5L10 2Z'
				stroke='currentColor'
				strokeWidth='1.8'
				strokeLinejoin='round'
			/>
			<path
				d='m7.5 9.5 1.8 1.8 3.2-3.6'
				stroke='currentColor'
				strokeWidth='1.8'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	);
}

function RuleTestPanel({ rule }: { rule: Rule }) {
	const maskMutation = useMaskMutation();
	const [inputText, setInputText] = useState(rule.example_before);

	const handleTest = () => {
		if (!inputText.trim()) return;
		maskMutation.mutate({
			text: inputText,
			enabled_rules: [rule.id],
			include_matches: true,
		});
	};

	return (
		<div className='mt-6 border-t border-border pt-5'>
			<textarea
				value={inputText}
				onChange={(e) => setInputText(e.target.value)}
				className='w-full p-4 bg-surface-2 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 mb-4 text-sm font-mono resize-none text-foreground'
				rows={3}
				placeholder='พิมพ์ข้อความเพื่อทดสอบ...'
			/>

			<button
				onClick={handleTest}
				disabled={maskMutation.isPending || !inputText.trim()}
				className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md disabled:opacity-50 flex justify-center items-center gap-2 text-sm'
			>
				{maskMutation.isPending ? 'กำลังประมวลผล...' : 'ตรวจจับและเซ็นเซอร์'}
			</button>

			{maskMutation.isError && (
				<div className='mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100'>
					ข้อผิดพลาด: {(maskMutation.error as Error)?.message}
				</div>
			)}

			{maskMutation.data && (
				<div className='mt-4'>
					{maskMutation.data.summary.total === 0 ? (
						<div className='p-4 bg-red-50/80 border border-red-200 text-red-600 rounded-2xl text-sm'>
							<p className='font-bold mb-1'>ไม่พบข้อมูลที่ตรงกัน</p>
						</div>
					) : (
						<div className='theme-result p-4 border-2 border-indigo-100 bg-indigo-50/30 rounded-2xl font-mono whitespace-pre-wrap text-foreground text-sm'>
							{maskMutation.data.masked_text}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default function HowItWorks() {
	const {
		data: rulesData,
		isLoading: isRulesLoading,
		isError,
		error,
	} = useRulesQuery();

	const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
	const isAutoScrollingRef = useRef(false);
	const autoScrollTimerRef = useRef<number | null>(null);

	const activeRuleId =
		rulesData?.rules.find((r) => r.id === selectedRuleId)?.id ??
		rulesData?.rules[0]?.id ??
		'';

	useEffect(() => {
		const rules = rulesData?.rules;
		if (!rules || rules.length === 0) return;

		const ids = rules.map((rule) => rule.id);

		const updateActiveFromScroll = () => {
			if (isAutoScrollingRef.current) return;

			const atBottom =
				window.innerHeight + window.scrollY >=
				document.documentElement.scrollHeight - 2;

			if (atBottom) {
				setSelectedRuleId(ids[ids.length - 1]);
				return;
			}

			const offset = 140;
			let currentId = ids[0];
			for (const id of ids) {
				const element = document.getElementById(`rule-${id}`);
				if (!element) continue;
				if (element.getBoundingClientRect().top - offset <= 0) {
					currentId = id;
				} else {
					break;
				}
			}
			setSelectedRuleId(currentId);
		};

		updateActiveFromScroll();
		window.addEventListener('scroll', updateActiveFromScroll, {
			passive: true,
		});
		window.addEventListener('resize', updateActiveFromScroll);
		return () => {
			window.removeEventListener('scroll', updateActiveFromScroll);
			window.removeEventListener('resize', updateActiveFromScroll);
		};
	}, [rulesData]);

	useEffect(
		() => () => {
			if (autoScrollTimerRef.current !== null) {
				window.clearTimeout(autoScrollTimerRef.current);
			}
		},
		[],
	);

	const handleRuleClick = (rule: Rule) => {
		setSelectedRuleId(rule.id);
		isAutoScrollingRef.current = true;
		if (autoScrollTimerRef.current !== null) {
			window.clearTimeout(autoScrollTimerRef.current);
		}
		autoScrollTimerRef.current = window.setTimeout(() => {
			isAutoScrollingRef.current = false;
		}, 800);
		document
			.getElementById(`rule-${rule.id}`)
			?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	if (isRulesLoading) {
		return (
			<div className='py-20 flex flex-col items-center justify-center text-muted'>
				<svg
					className='animate-spin h-8 w-8 text-indigo-500 mb-4'
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
				>
					<circle
						className='opacity-25'
						cx='12'
						cy='12'
						r='10'
						stroke='currentColor'
						strokeWidth='4'
					></circle>
					<path
						className='opacity-75'
						fill='currentColor'
						d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
					></path>
				</svg>
				<p>กำลังโหลดกฎจากเซิร์ฟเวอร์...</p>
			</div>
		);
	}

	if (isError) {
		return (
			<div className='py-20 text-center'>
				<div className='inline-block bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl max-w-lg'>
					<h3 className='font-bold text-lg mb-2'>ไม่สามารถเชื่อมต่อ API ได้</h3>
					<p className='text-sm'>
						{(error as Error)?.message ||
							'กรุณาตรวจสอบว่าเซิร์ฟเวอร์หลังบ้านกำลังทำงานอยู่'}
					</p>
				</div>
			</div>
		);
	}

	if (!rulesData?.rules || rulesData.rules.length === 0) {
		return (
			<div className='py-20 text-center text-muted'>
				ไม่พบกฎการเซ็นเซอร์ในระบบ
			</div>
		);
	}

	return (
		<div className='grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)] py-8'>
			<aside className='lg:sticky lg:top-24 lg:self-start'>
				<nav
					aria-label='ส่วนวิธีการทำงาน'
					className='flex gap-1 overflow-x-auto lg:flex-col custom-scrollbar select-none'
				>
					{rulesData.rules.map((rule) => {
						const isActive = activeRuleId === rule.id;
						const theme = RULE_THEMES[rule.id] ?? RULE_THEMES.default;
						return (
							<button
								key={rule.id}
								type='button'
								onClick={() => handleRuleClick(rule)}
								aria-current={isActive ? 'true' : undefined}
								className={`flex items-center gap-2 text-left rounded-lg px-3 py-2.5 text-sm whitespace-nowrap transition-colors ${
									isActive
										? 'bg-primary-bg font-medium text-heading'
										: 'text-muted hover:bg-surface-2 hover:text-foreground'
								}`}
							>
								<span
									aria-hidden='true'
									className={`h-2.5 w-2.5 shrink-0 rounded-full ${theme.swatch}`}
								/>
								{rule.label_th || rule.label_en}
							</button>
						);
					})}
				</nav>
			</aside>

			<div className='min-w-0 flex flex-col gap-6'>
				{rulesData.rules.map((rule) => {
					const theme = RULE_THEMES[rule.id] ?? RULE_THEMES.default;
					return (
						<section
							key={rule.id}
							id={`rule-${rule.id}`}
							className='bg-surface-2 scroll-mt-28 p-6 rounded-3xl border border-border'
						>
							<div className='mb-2 flex items-center gap-2.5'>
								<span
									aria-hidden='true'
									className={`h-3 w-3 shrink-0 rounded-full ${theme.swatch}`}
								/>
								<h2 className='text-2xl font-bold text-heading'>
									{rule.label_th || rule.label_en}
								</h2>
							</div>
							<p className='text-muted mb-6 text-sm'>{rule.description}</p>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-mono'>
								<div className='bg-background p-4 rounded-2xl border border-border shadow-sm'>
									<span className='text-xs text-muted mb-2 font-sans font-semibold flex items-center gap-1.5'>
										<DocIcon className='h-4 w-4' />
										ตัวอย่างข้อมูลเข้า
									</span>
									<span className='text-foreground break-all'>
										{rule.example_before}
									</span>
								</div>
								<div className='bg-background p-4 rounded-2xl border border-border shadow-sm'>
									<span className='text-xs text-muted mb-2 font-sans font-semibold flex items-center gap-1.5'>
										<ShieldIcon className='h-4 w-4' />
										ตัวอย่างผลลัพธ์
									</span>
									<span className='text-heading break-all'>
										{rule.example_after}
									</span>
								</div>
							</div>
							<RuleTestPanel rule={rule} />
						</section>
					);
				})}
			</div>
		</div>
	);
}
