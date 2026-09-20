import type { RuleId } from '../../types/common.types';
import type { Rule } from '../../types/rules.types';
import { RULE_THEMES } from './playground.themes';

type RulesSidebarProps = {
	rules?: Rule[];
	isLoading: boolean;
	selectedRules: RuleId[];
	isAutoMode: boolean;
	onToggleAutoMode: () => void;
	onToggleRule: (ruleId: RuleId) => void;
	onToggleAll: () => void;
};

export default function RulesSidebar({
	rules,
	isLoading,
	selectedRules,
	isAutoMode,
	onToggleAutoMode,
	onToggleRule,
	onToggleAll,
}: RulesSidebarProps) {
	return (
		<aside className='surface-panel flex h-full flex-col rounded-3xl p-6 shadow-2xl shadow-black/10 sm:p-7'>
			<div className='flex flex-col gap-3 border-b border-border pb-4'>
				<div>
					<div className='flex items-center gap-2'>
						<h2 className='text-base font-bold text-heading sm:text-lg'>
							เงื่อนไขการตรวจจับ
						</h2>
						<span className='rounded-full border border-indigo-200 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600'>
							{rules?.length ?? 6} กฎ
						</span>
					</div>
					<p className='mt-0.5 text-xs text-muted'>
						เลือกหมวดหมู่ข้อมูล (PII) ที่ต้องการปิดบัง
					</p>
				</div>

				<div className='flex flex-wrap items-center justify-between gap-2 pt-1'>
					<label className='flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-1.5 transition-colors hover:border-border hover:bg-surface-3'>
						<div className='relative flex items-center'>
							<input
								type='checkbox'
								className='peer sr-only'
								checked={isAutoMode}
								onChange={onToggleAutoMode}
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
						onClick={onToggleAll}
						className='flex items-center gap-1.5 rounded-xl border border-border bg-surface-2 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-border hover:bg-surface-3'
					>
						<i
							className={`ph ph-${
								rules && selectedRules.length === rules.length
									? 'x-circle text-muted'
									: 'check-circle text-indigo-600'
							}`}
						/>
						<span>
							{rules && selectedRules.length === rules.length
								? 'ยกเลิกทั้งหมด'
								: 'เลือกทั้งหมด'}
						</span>
					</button>
				</div>
			</div>

			<div className='flex flex-1 flex-col gap-2.5 overflow-y-auto pt-4'>
				{isLoading ? (
					<div className='flex h-24 items-center justify-center text-xs text-muted'>
						กำลังโหลดกฎการเซ็นเซอร์...
					</div>
				) : (
					rules?.map((rule) => {
						const theme = RULE_THEMES[rule.id] || RULE_THEMES.default;
						return (
							<label
								key={rule.id}
								className={`flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-surface-2/70 p-3 shadow-sm transition-all ${theme.border}`}
							>
								<input
									type='checkbox'
									checked={selectedRules.includes(rule.id)}
									onChange={() => onToggleRule(rule.id)}
									className='mt-0.5 h-4 w-4 cursor-pointer rounded border-border text-indigo-600 focus:ring-indigo-500/20'
								/>
								<div className='min-w-0 flex-1 select-none'>
									<div className='flex items-center justify-between gap-1'>
										<span
											className={`flex items-center gap-1.5 text-xs font-bold text-heading truncate transition-colors ${theme.group}`}
										>
											<i className={`ph-fill ${theme.icon} text-sm shrink-0`} />{' '}
											<span className='truncate'>{rule.label_th}</span>
										</span>
										<span
											className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-medium shrink-0 ${theme.badgeBg}`}
										>
											{rule.example_after}
										</span>
									</div>
									<p className='mt-1 text-[11px] leading-snug text-muted line-clamp-2'>
										{rule.description}
									</p>
								</div>
							</label>
						);
					})
				)}
			</div>
		</aside>
	);
}
