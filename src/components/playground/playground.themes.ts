export type RuleTheme = {
	icon: string;
	group: string;
	border: string;
	badgeBg: string;
};

export const RULE_THEMES: Record<string, RuleTheme> = {
	address: {
		icon: 'ph-map-pin text-amber-500',
		group: 'group-hover:text-amber-800',
		border: 'hover:border-amber-300 hover:bg-amber-50/30',
		badgeBg: 'bg-amber-100/70 text-amber-700',
	},
	credit_card: {
		icon: 'ph-credit-card text-rose-500',
		group: 'group-hover:text-rose-800',
		border: 'hover:border-rose-300 hover:bg-rose-50/30',
		badgeBg: 'bg-rose-100/70 text-rose-700',
	},
	dob: {
		icon: 'ph-calendar text-fuchsia-500',
		group: 'group-hover:text-fuchsia-800',
		border: 'hover:border-fuchsia-300 hover:bg-fuchsia-50/30',
		badgeBg: 'bg-fuchsia-100/70 text-fuchsia-700',
	},
	email: {
		icon: 'ph-envelope-simple text-emerald-500',
		group: 'group-hover:text-emerald-800',
		border: 'hover:border-emerald-300 hover:bg-emerald-50/30',
		badgeBg: 'bg-emerald-100/70 text-emerald-700',
	},
	phone: {
		icon: 'ph-phone-call text-blue-500',
		group: 'group-hover:text-blue-800',
		border: 'hover:border-blue-300 hover:bg-blue-50/30',
		badgeBg: 'bg-blue-100/70 text-blue-700',
	},
	default: {
		icon: 'ph-identification-card text-purple-600',
		group: 'group-hover:text-purple-800',
		border: 'hover:border-purple-300 hover:bg-purple-50/30',
		badgeBg: 'bg-purple-100/70 text-purple-700',
	},
};
