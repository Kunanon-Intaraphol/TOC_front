import { useEffect, useMemo, useState } from 'react';
import {
	DEFAULT_SAMPLE_TEXT,
	INPUT_DEBOUNCE_DELAY_MS,
} from '../../constants/playground.constants';
import { useMaskMutation } from '../../services/mask.service';
import { useRulesQuery } from '../../services/rules.service';
import type { RuleId } from '../../types/common.types';
import InputPanel from '../playground/InputPanel';
import MaskedOutputPanel from '../playground/MaskedOutputPanel';
import RulesSidebar from '../playground/RulesSidebar';

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

	const handlePaste = async () => {
		const text = await navigator.clipboard.readText();
		setInputText(text);
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

			<div className='flex w-full flex-1 flex-col pb-10'>
				<div className='grid min-h-0 flex-1 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-stretch'>
					<div className='flex min-h-0 min-w-0 flex-1 flex-col gap-6'>
						<InputPanel
							inputText={inputText}
							onInputTextChange={setInputText}
							onMask={handleMask}
							isMaskPending={maskMutation.isPending}
							onClear={() => setInputText('')}
							onPaste={handlePaste}
							onSelectSample={(sample) => setInputText(sample)}
						/>

						<MaskedOutputPanel
							data={maskMutation.data}
							isCopied={isCopied}
							onCopy={handleCopy}
						/>
					</div>

					<RulesSidebar
						rules={rulesData?.rules}
						isLoading={isRulesLoading}
						selectedRules={selectedRules}
						isAutoMode={isAutoMode}
						onToggleAutoMode={() => setIsAutoMode(!isAutoMode)}
						onToggleRule={handleToggleRule}
						onToggleAll={handleToggleAll}
					/>
				</div>
			</div>
		</div>
	);
}
