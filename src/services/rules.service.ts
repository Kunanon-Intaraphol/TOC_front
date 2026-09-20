import { useQuery } from '@tanstack/react-query';
import { apiClient } from './api.config';
import type { RulesResponse } from '../types/rules.types';

const getRules = (): Promise<RulesResponse> => {
	return apiClient<RulesResponse>('/rules');
};

export const useRulesQuery = () => {
	return useQuery({
		queryKey: ['rules'],
		queryFn: getRules,
		staleTime: Infinity,
	});
};
