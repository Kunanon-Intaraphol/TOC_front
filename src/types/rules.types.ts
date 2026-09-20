import type { RuleId } from './common.types';

export interface Rule {
  id: RuleId;
  label_th: string;
  label_en: string;
  pattern: string;
  example_before: string;
  example_after: string;
  description: string;
}

export interface RulesResponse {
  rules: Rule[];
}