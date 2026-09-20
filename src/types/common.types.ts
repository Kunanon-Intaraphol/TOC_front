export type RuleId = 'email' | 'credit_card' | 'phone' | 'dob' | 'address' | string;

export interface Match {
  rule_id: string;
  label: string;
  start: number;
  end: number;
  masked_value: string | null;
}

export interface Summary {
  total: number;
  by_type: Record<string, number>;
}