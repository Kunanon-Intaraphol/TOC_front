export type RuleTheme = {
	border: string;
	badgeBg: string;
	badgeTheme: string;
	swatch: string;
};

export const RULE_THEMES: Record<string, RuleTheme> = {
	address: {
		border: 'hover:border-amber-300 hover:bg-amber-50/30',
		badgeBg: 'bg-amber-100/70 text-amber-700',
		badgeTheme: 'theme-badge-amber',
		swatch: 'bg-amber-400',
	},
	credit_card: {
		border: 'hover:border-cyan-300 hover:bg-cyan-50/30',
		badgeBg: 'bg-cyan-100/70 text-cyan-700',
		badgeTheme: 'theme-badge-cyan',
		swatch: 'bg-cyan-400',
	},
	dob: {
		border: 'hover:border-fuchsia-300 hover:bg-fuchsia-50/30',
		badgeBg: 'bg-fuchsia-100/70 text-fuchsia-700',
		badgeTheme: 'theme-badge-fuchsia',
		swatch: 'bg-fuchsia-400',
	},
	email: {
		border: 'hover:border-emerald-300 hover:bg-emerald-50/30',
		badgeBg: 'bg-emerald-100/70 text-emerald-700',
		badgeTheme: 'theme-badge-emerald',
		swatch: 'bg-emerald-400',
	},
	phone: {
		border: 'hover:border-blue-300 hover:bg-blue-50/30',
		badgeBg: 'bg-blue-100/70 text-blue-700',
		badgeTheme: 'theme-badge-blue',
		swatch: 'bg-blue-400',
	},
	default: {
		border: 'hover:border-purple-300 hover:bg-purple-50/30',
		badgeBg: 'bg-purple-100/70 text-purple-700',
		badgeTheme: 'theme-badge-purple',
		swatch: 'bg-purple-400',
	},
};
