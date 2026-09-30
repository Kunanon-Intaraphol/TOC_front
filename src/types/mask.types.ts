import type { RuleId, Match, Summary } from './common.types';

export interface MaskRequest {
	text: string;
	enabled_rules?: RuleId[] | null;
	include_matches?: boolean;
}

export interface MaskResponse {
	masked_text: string;
	summary: Summary;
	matches: Match[] | null;
	processing_time_ms: number;
}
