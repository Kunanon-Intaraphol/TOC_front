import { useMemo, useState } from 'react';
import type { Match } from '../../types/common.types';
import { matchValueKey } from '../../types/common.types';
import type { Rule } from '../../types/rules.types';
import { RULE_THEMES } from './playground.themes';

type RulesSidebarProps = {
	rules?: Rule[];
	isLoading: boolean;
	matches?: Match[] | null;
	inputText?: string;
	maskedText?: string | null;
	ignoredValues: string[];
	onToggleValue: (valueKey: string) => void;
	onToggleAllValues: () => void;
};

type ValueRow = {
	key: string;
	valueKey: string;
	rule: Rule;
	start: number;
	rawText: string;
	maskedText: string | null;
};

function FilterIcon({ className = '' }: { className?: string }) {
	return (
		<svg
			viewBox='0 0 20 20'
			fill='none'
			aria-hidden='true'
			className={className}
		>
			<path
				d='M3 4.5h14l-5.5 6.5v4.5l-3 1.5v-6L3 4.5Z'
				stroke='currentColor'
				strokeWidth='1.8'
				strokeLinejoin='round'
			/>
		</svg>
	);
}

function Checkbox({
	checked,
	size = 'md',
}: {
	checked: boolean;
	size?: 'sm' | 'md';
}) {
	return (
		<span
			aria-hidden='true'
			data-checked={checked}
			className={`black-check ${size === 'sm' ? 'black-check-sm' : 'black-check-md'}`}
		>
			<svg viewBox='0 0 12 12' fill='none'>
				<path
					d='M2.5 6.2 5 8.5 9.7 3.5'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</svg>
		</span>
	);
}

function SearchIcon({ className = '' }: { className?: string }) {
	return (
		<svg
			viewBox='0 0 20 20'
			fill='none'
			aria-hidden='true'
			className={className}
		>
			<circle cx='9' cy='9' r='6' stroke='currentColor' strokeWidth='1.8' />
			<path
				d='m13.5 13.5 3 3'
				stroke='currentColor'
				strokeWidth='1.8'
				strokeLinecap='round'
			/>
		</svg>
	);
}

export default function RulesSidebar({
	rules = [],
	isLoading,
	matches,
	inputText = '',
	maskedText = null,
	ignoredValues,
	onToggleValue,
	onToggleAllValues,
}: RulesSidebarProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [hiddenRuleIds, setHiddenRuleIds] = useState<string[]>([]);

	const matchesByRuleId = useMemo(() => {
		const grouped: Record<string, Match[]> = {};
		if (matches) {
			for (const match of matches) {
				if (!grouped[match.rule_id]) grouped[match.rule_id] = [];
				grouped[match.rule_id].push(match);
			}
		}
		return grouped;
	}, [matches]);

	const visibleRules = useMemo(
		() => rules.filter((rule) => !hiddenRuleIds.includes(rule.id)),
		[rules, hiddenRuleIds],
	);

	const normalizedQuery = searchQuery.trim().toLowerCase();

	const valueRows = useMemo(() => {
		const rows: ValueRow[] = [];
		for (const rule of visibleRules) {
			const ruleMatches = matchesByRuleId[rule.id] ?? [];
			// Only values actually found in the input get a row.
			for (const match of ruleMatches) {
				const rawText = inputText.slice(match.start, match.end);
				const masked = maskedText?.slice(match.start, match.end) || null;
				rows.push({
					key: `${rule.id}-${match.start}-${match.end}`,
					valueKey: matchValueKey(rule.id, rawText),
					rule,
					start: match.start,
					rawText,
					maskedText: masked,
				});
			}
		}

		// Found order: values as they appear in the input
		rows.sort((a, b) => a.start - b.start);

		if (!normalizedQuery) return rows;

		return rows.filter((row) => {
			if (
				row.rule.id.toLowerCase().includes(normalizedQuery) ||
				row.rule.label_th.toLowerCase().includes(normalizedQuery) ||
				row.rule.label_en?.toLowerCase().includes(normalizedQuery) ||
				row.rule.description.toLowerCase().includes(normalizedQuery)
			) {
				return true;
			}
			return row.rawText.toLowerCase().includes(normalizedQuery);
		});
	}, [visibleRules, matchesByRuleId, inputText, maskedText, normalizedQuery]);

	const toggleHiddenRule = (ruleId: string) => {
		setHiddenRuleIds((prev) =>
			prev.includes(ruleId)
				? prev.filter((id) => id !== ruleId)
				: [...prev, ruleId],
		);
	};

	return (
		<aside className='surface-panel flex h-full min-h-[480px] flex-col rounded-3xl p-6 shadow-2xl shadow-black/10 sm:p-7 lg:min-h-0'>
			<div className='flex shrink-0 flex-col gap-3 border-b border-border pb-4'>
				<div>
					<h2 className='text-base font-bold text-heading sm:text-lg'>
						ตัวกรอง
					</h2>
					<p className='mt-0.5 text-xs text-muted'>
						เลือกประเภทข้อมูลส่วนบุคคลที่ต้องการเซ็นเซอร์
					</p>
				</div>

				{/* Search + category filter */}
				<div className='flex items-center rounded-xl border border-border bg-surface-2 px-3 py-2 transition focus-within:border-indigo-400 focus-within:bg-surface'>
					<SearchIcon className='mr-2 h-4 w-4 shrink-0 text-muted' />
					<input
						type='text'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder='ค้นหาประเภทหรือค่า...'
						className='w-full min-w-0 flex-1 bg-transparent text-xs text-foreground placeholder:text-muted focus:outline-none'
					/>
					{searchQuery && (
						<button
							type='button'
							onClick={() => setSearchQuery('')}
							className='mr-1 text-base leading-none text-muted hover:text-foreground'
							aria-label='ล้างการค้นหา'
						>
							×
						</button>
					)}
					<span
						aria-hidden='true'
						className='mx-1 h-5 w-px shrink-0 bg-border'
					/>
					<div className='relative shrink-0'>
						<button
							type='button'
							onClick={() => setIsFilterOpen((open) => !open)}
							aria-expanded={isFilterOpen}
							aria-label='ตัวกรองหมวดหมู่'
							title='กรองตามหมวดหมู่'
							className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold transition-colors ${
								hiddenRuleIds.length > 0
									? 'bg-indigo-500/10 text-indigo-600'
									: 'text-muted hover:text-foreground'
							}`}
						>
							<FilterIcon className='h-4 w-4' />
							<span className='font-mono text-[11px]'>
								{rules.length - hiddenRuleIds.length}/{rules.length}
							</span>
						</button>
						{isFilterOpen && (
							<>
								<button
									type='button'
									aria-label='ปิดตัวกรองหมวดหมู่'
									onClick={() => setIsFilterOpen(false)}
									className='fixed inset-0 z-10 cursor-default bg-transparent'
								/>
								<div className='absolute right-0 top-full z-20 mt-2 w-60 rounded-2xl border border-border bg-surface p-2 shadow-xl'>
									<div className='flex items-center justify-between px-2 py-1.5 text-xs'>
										<span className='font-bold text-heading'>หมวดหมู่</span>
										<div className='flex items-center gap-2'>
											<button
												type='button'
												onClick={() => setHiddenRuleIds([])}
												className='font-semibold text-indigo-600 hover:underline'
											>
												ทั้งหมด
											</button>
											<button
												type='button'
												onClick={() =>
													setHiddenRuleIds(rules.map((rule) => rule.id))
												}
												className='font-semibold text-muted hover:text-foreground'
											>
												ล้าง
											</button>
										</div>
									</div>
									{rules.map((rule) => {
										const isVisible = !hiddenRuleIds.includes(rule.id);
										return (
											<label
												key={rule.id}
												className='relative flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-xs text-foreground transition-colors hover:bg-surface-2'
											>
												<input
													type='checkbox'
													checked={isVisible}
													onChange={() => toggleHiddenRule(rule.id)}
													className='black-check-input sr-only'
												/>
												<Checkbox checked={isVisible} size='sm' />
												<span className='truncate'>{rule.label_th}</span>
											</label>
										);
									})}
								</div>
							</>
						)}
					</div>
				</div>

				{/* Match Count & Select All */}
				<div className='flex items-center justify-between text-xs'>
					<span className='font-medium text-muted'>
						พบ {valueRows.length} รายการ
					</span>
					<div className='flex items-center gap-2'>
						<span className='rounded-full bg-indigo-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-indigo-600'>
							{valueRows.length - ignoredValues.length}/{valueRows.length}
						</span>
						<button
							type='button'
							onClick={onToggleAllValues}
							className='text-xs font-semibold text-indigo-600 transition-colors hover:underline'
						>
							{ignoredValues.length > 0 ? 'เลือกทั้งหมด' : 'ยกเลิกทั้งหมด'}
						</button>
					</div>
				</div>
			</div>

			{/* Value rows — one row per detected value, server order, never re-sorted */}
			<div className='flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pt-4'>
				{isLoading ? (
					<div className='flex h-24 items-center justify-center text-xs text-muted'>
						กำลังโหลดตัวกรอง...
					</div>
				) : valueRows.length === 0 ? (
					<div className='py-8 text-center text-xs text-muted'>
						ไม่พบกฎที่ตรงกัน
					</div>
				) : (
					valueRows.map((row) => {
						const isChecked = !ignoredValues.includes(row.valueKey);
						const theme = RULE_THEMES[row.rule.id] ?? RULE_THEMES.default;

						return (
							<label
								key={row.key}
								className={`relative flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-surface-2/70 p-3.5 shadow-sm transition-all ${theme.border}`}
							>
								<input
									type='checkbox'
									checked={isChecked}
									onChange={() => onToggleValue(row.valueKey)}
									className='black-check-input sr-only'
								/>
								<Checkbox checked={isChecked} />
								<div className='min-w-0 flex-1 select-none'>
									<span className='flex items-center gap-1.5 text-xs font-bold text-heading'>
										<span className='truncate'>{row.rule.label_th}</span>
									</span>
									<div className='mt-2 rounded-xl bg-surface px-2.5 py-2 font-mono text-[11px] leading-relaxed'>
										<div className='break-all text-foreground'>
											{row.rawText}
										</div>
										<div
											aria-hidden='true'
											className='flex justify-center py-0.5 text-muted'
										>
											↓
										</div>
										<div
											className={`break-all rounded-lg px-1.5 py-0.5 ${
												isChecked ? theme.badgeBg : 'bg-surface-2 text-muted'
											}`}
										>
											{isChecked
												? (row.maskedText ?? row.rule.example_after)
												: row.rawText}
										</div>
									</div>
								</div>
							</label>
						);
					})
				)}
			</div>
		</aside>
	);
}
