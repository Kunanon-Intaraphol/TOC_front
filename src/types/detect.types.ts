import type { RuleId, Match, Summary } from './common.types';

export interface DetectRequest {
  text: string;
  enabled_rules?: RuleId[] | null;
  include_matches?: boolean;
}

export interface DetectResponse {
  summary: Summary;
  matches: Match[] | null;
  processing_time_ms: number;
}