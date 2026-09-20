import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	DEFAULT_SAMPLE_TEXT,
	INPUT_DEBOUNCE_DELAY_MS,
} from '../../constants/playground.constants';
import { useDetectMutation } from '../../services/detect.service';
import { useMaskMutation } from '../../services/mask.service';
import { useRulesQuery } from '../../services/rules.service';
import type { Match } from '../../types/common.types';
import { matchValueKey, valueRowKey } from '../../types/common.types';
import InputPanel from '../playground/InputPanel';
import MaskedOutputPanel from '../playground/MaskedOutputPanel';
import RulesSidebar, { type RowSpotlight } from '../playground/RulesSidebar';

export default function Playground() {
	const [inputText, setInputText] = useState(DEFAULT_SAMPLE_TEXT);
	const [isCopied, setIsCopied] = useState(false);
	const [isAutoMode, setIsAutoMode] = useState(true);
	const [detectSnapshot, setDetectSnapshot] = useState<{
		text: string;
		matches: Match[];
	} | null>(null);

	const [ignoredValues, setIgnoredValues] = useState<string[]>([]);
	const [spotlight, setSpotlight] = useState<RowSpotlight | null>(null);
	const requestIdRef = useRef(0);

	const { data: rulesData, isLoading: isRulesLoading } = useRulesQuery();
	const detectMutation = useDetectMutation();
	const maskMutation = useMaskMutation();

	const { mutateAsync: detectAsync } = detectMutation;
	const { mutate: runMask, reset: resetMask } = maskMutation;

	const allRuleIds = useMemo(
		() => rulesData?.rules.map((rule) => rule.id) ?? [],
		[rulesData],
	);

	const lastDetectedTextRef = useRef<string | null>(null);

	const runDetectAndMask = useCallback(
		async (text: string) => {
			requestIdRef.current += 1;
			const requestId = requestIdRef.current;
			lastDetectedTextRef.current = text;
			runMask({
				text,
				enabled_rules: allRuleIds,
				include_matches: true,
			});
			try {
				const detectData = await detectAsync({
					text,
					enabled_rules: allRuleIds,
					include_matches: true,
				});
				if (requestIdRef.current !== requestId) return;
				setDetectSnapshot({ text, matches: detectData.matches ?? [] });
			} catch {}
		},
		[detectAsync, runMask, allRuleIds],
	);

	const clearResults = useCallback(() => {
		requestIdRef.current += 1;
		lastDetectedTextRef.current = null;
		setDetectSnapshot(null);
		resetMask();
	}, [resetMask]);

	const refreshMask = useCallback(
		(text: string) => {
			if (!text.trim()) return;
			runMask({
				text,
				enabled_rules: allRuleIds,
				include_matches: true,
			});
		},
		[runMask, allRuleIds],
	);

	const handleInputTextChange = (value: string) => {
		setInputText(value);
		if (!value.trim()) clearResults();
	};

	useEffect(() => {
		if (!isAutoMode || !inputText.trim()) return;

		const debounceTimer = setTimeout(() => {
			if (lastDetectedTextRef.current !== inputText) {
				void runDetectAndMask(inputText);
			}
		}, INPUT_DEBOUNCE_DELAY_MS);

		return () => clearTimeout(debounceTimer);
	}, [inputText, isAutoMode, runDetectAndMask]);

	const handleToggleValue = (valueKey: string) => {
		setIgnoredValues((prev) =>
			prev.includes(valueKey)
				? prev.filter((key) => key !== valueKey)
				: [...prev, valueKey],
		);
		refreshMask(inputText);
	};

	const handleToggleAllValues = () => {
		const snapshot = detectSnapshot;
		if (!snapshot) return;
		const allKeys = snapshot.matches.map((match) =>
			matchValueKey(match.rule_id, snapshot.text.slice(match.start, match.end)),
		);
		setIgnoredValues((prev) => (prev.length > 0 ? [] : [...new Set(allKeys)]));
		refreshMask(inputText);
	};

	const handleSelectValue = (ruleId: string, start: number, end: number) => {
		const key = valueRowKey(ruleId, start, end);
		setSpotlight((prev) => ({ key, seq: (prev?.seq ?? 0) + 1 }));
	};

	const handleMask = () => {
		if (!inputText.trim()) return;
		void runDetectAndMask(inputText);
	};

	const handleClear = () => {
		setInputText('');
		clearResults();
	};

	const handleCopy = (text: string) => {
		if (!text) return;
		navigator.clipboard.writeText(text);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 1800);
	};

	const handlePaste = async () => {
		const text = await navigator.clipboard.readText();
		setInputText(text);
	};

	const isOutputProcessing =
		maskMutation.isPending ||
		(!maskMutation.data &&
			isAutoMode &&
			!maskMutation.isError &&
			!detectMutation.isError &&
			inputText.trim() !== '' &&
			detectSnapshot?.text !== inputText);

	return (
		<div className='flex min-h-0 flex-1 flex-col font-sans text-foreground selection:bg-indigo-500 selection:text-white'>
			<div className='flex min-h-0 w-full flex-1 flex-col pb-10 lg:overflow-hidden lg:pb-0'>
				<div className='grid min-h-0 flex-1 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-stretch lg:overflow-hidden'>
					<div className='flex min-h-0 min-w-0 flex-1 flex-col gap-6'>
						<InputPanel
							inputText={inputText}
							onInputTextChange={handleInputTextChange}
							onMask={handleMask}
							isMaskPending={maskMutation.isPending}
							isAutoMode={isAutoMode}
							onToggleAutoMode={() => setIsAutoMode((previous) => !previous)}
							onClear={handleClear}
							onPaste={handlePaste}
							onSelectSample={(sample) => setInputText(sample)}
						/>

						<MaskedOutputPanel
							data={maskMutation.data}
							snapshotText={detectSnapshot?.text ?? ''}
							ignoredValues={ignoredValues}
							isCopied={isCopied}
							isProcessing={isOutputProcessing}
							onCopy={handleCopy}
							onSelectValue={handleSelectValue}
						/>
					</div>

					<RulesSidebar
						rules={rulesData?.rules}
						isLoading={isRulesLoading}
						matches={detectSnapshot?.matches ?? null}
						inputText={detectSnapshot?.text ?? ''}
						maskedText={maskMutation.data?.masked_text ?? null}
						ignoredValues={ignoredValues}
						onToggleValue={handleToggleValue}
						onToggleAllValues={handleToggleAllValues}
						spotlight={spotlight}
					/>
				</div>
			</div>
		</div>
	);
}
