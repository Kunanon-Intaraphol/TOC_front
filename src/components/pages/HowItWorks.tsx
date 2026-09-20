import { useState } from 'react';
import { useMaskMutation } from '../../services/mask.service';
import { useRulesQuery } from '../../services/rules.service';
import type { Rule } from '../../types/rules.types';

export default function HowItWorks() {
	const {
		data: rulesData,
		isLoading: isRulesLoading,
		isError,
		error,
	} = useRulesQuery();
	const maskMutation = useMaskMutation();

	const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
	const [customInputText, setCustomInputText] = useState<string | null>(null);

	const activeRule =
		rulesData?.rules.find((r) => r.id === selectedRuleId) ??
		rulesData?.rules[0];
	const activeRuleId = activeRule?.id ?? '';
	const inputText = customInputText ?? activeRule?.example_before ?? '';

	const handleRuleChange = (rule: Rule) => {
		setSelectedRuleId(rule.id);
		setCustomInputText(rule.example_before);
		maskMutation.reset();
	};

	const handleTest = () => {
		if (!inputText.trim() || !activeRuleId) return;
		maskMutation.mutate({
			text: inputText,
			enabled_rules: [activeRuleId],
			include_matches: true,
		});
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
			{/* Left sidebar */}
			<aside className='lg:sticky lg:top-24 lg:self-start'>
				<nav
					aria-label='ส่วนวิธีการทำงาน'
					className='flex gap-1 overflow-x-auto lg:flex-col custom-scrollbar'
				>
					{rulesData.rules.map((rule) => {
						const isActive = activeRuleId === rule.id;
						return (
							<button
								key={rule.id}
								type='button'
								onClick={() => handleRuleChange(rule)}
								aria-current={isActive ? 'true' : undefined}
								className={`text-left rounded-lg px-3 py-2.5 text-sm whitespace-nowrap transition-colors ${
									isActive
										? 'bg-primary-bg font-medium text-heading'
										: 'text-muted hover:bg-surface-2 hover:text-foreground'
								}`}
							>
								{rule.label_th || rule.label_en}
							</button>
						);
					})}
				</nav>
			</aside>

			{/* Content block */}
			<div className='min-w-0 flex flex-col gap-6'>
				{activeRule && (
					<>
						<div className='bg-surface-2 p-6 rounded-3xl border border-border'>
							<h2 className='text-2xl font-bold text-heading mb-2'>
								{activeRule.label_th || activeRule.label_en}
							</h2>
							<p className='text-muted mb-6 text-sm'>
								{activeRule.description}
							</p>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-mono'>
								<div className='bg-background p-4 rounded-2xl border border-border shadow-sm'>
									<span className='text-xs text-muted block mb-2 font-sans font-semibold'>
										📝 ตัวอย่างข้อมูลเข้า
									</span>
									<span className='text-foreground break-all'>
										{activeRule.example_before}
									</span>
								</div>
								<div className='bg-background p-4 rounded-2xl border border-border shadow-sm'>
									<span className='text-xs text-muted block mb-2 font-sans font-semibold'>
										🛡️ ตัวอย่างผลลัพธ์
									</span>
									<span className='text-heading break-all'>
										{activeRule.example_after}
									</span>
								</div>
							</div>
						</div>

						<div className='bg-background p-6 rounded-3xl border border-border shadow-[0_4px_20px_rgb(0,0,0,0.03)]'>
							<h3 className='text-lg font-bold text-heading mb-4'>
								ทดสอบแบบโต้ตอบ
							</h3>

							<textarea
								value={inputText}
								onChange={(e) => setCustomInputText(e.target.value)}
								className='w-full p-4 bg-surface-2 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 mb-4 text-sm font-mono resize-none text-foreground'
								rows={4}
								placeholder='พิมพ์ข้อความเพื่อทดสอบ...'
							/>

							<button
								onClick={handleTest}
								disabled={maskMutation.isPending || !inputText.trim()}
								className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md disabled:opacity-50 flex justify-center items-center gap-2'
							>
								{maskMutation.isPending
									? 'กำลังประมวลผล...'
									: 'ตรวจจับและเซ็นเซอร์'}
							</button>

							{maskMutation.isError && (
								<div className='mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100'>
									ข้อผิดพลาด: {(maskMutation.error as Error)?.message}
								</div>
							)}

							{/* result */}
							{maskMutation.data && (
								<div className='mt-6 animate-in fade-in duration-300'>
									{maskMutation.data.summary.total === 0 ? (
										<div className='p-4 bg-red-50/80 border border-red-200 text-red-600 rounded-2xl text-sm flex items-start gap-3'>
											<svg
												className='w-5 h-5 shrink-0 mt-0.5'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
												/>
											</svg>
											<div>
												<p className='font-bold mb-1'>ไม่พบข้อมูลที่ตรงกัน</p>
												<p className='text-red-500/80'>
													ข้อความที่คุณกรอกไม่ตรงกับรูปแบบของ{' '}
													{activeRule.label_th || activeRule.label_en}{' '}
													กรุณาตรวจสอบและลองใหม่อีกครั้ง
												</p>
											</div>
										</div>
									) : (
										<>
											<div className='text-sm font-semibold text-heading mb-2 flex justify-between items-end'>
												<span>ผลลัพธ์:</span>
												<span className='text-xs font-normal text-muted'>
													ประมวลผลใน{' '}
													{maskMutation.data.processing_time_ms.toFixed(2)} ms
												</span>
											</div>
											<div className='p-4 border-2 border-indigo-100 bg-indigo-50/30 dark:bg-indigo-900/10 dark:border-indigo-500/30 rounded-2xl font-mono whitespace-pre-wrap text-foreground min-h-[4rem]'>
												{maskMutation.data.masked_text}
											</div>
										</>
									)}
								</div>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
