export type RuleTheme = {
	border: string;
	badgeBg: string;
};

export const RULE_THEMES: Record<string, RuleTheme> = {
	address: {
		border: 'hover:border-amber-300 hover:bg-amber-50/30',
		badgeBg: 'bg-amber-100/70 text-amber-700',
	},
	credit_card: {
		border: 'hover:border-cyan-300 hover:bg-cyan-50/30',
		badgeBg: 'bg-cyan-100/70 text-cyan-700',
	},
	dob: {
		border: 'hover:border-fuchsia-300 hover:bg-fuchsia-50/30',
		badgeBg: 'bg-fuchsia-100/70 text-fuchsia-700',
	},
	email: {
		border: 'hover:border-emerald-300 hover:bg-emerald-50/30',
		badgeBg: 'bg-emerald-100/70 text-emerald-700',
	},
	phone: {
		border: 'hover:border-blue-300 hover:bg-blue-50/30',
		badgeBg: 'bg-blue-100/70 text-blue-700',
	},
	default: {
		border: 'hover:border-purple-300 hover:bg-purple-50/30',
		badgeBg: 'bg-purple-100/70 text-purple-700',
	},
};
