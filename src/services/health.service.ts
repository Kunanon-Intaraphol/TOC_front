import { useQuery } from '@tanstack/react-query';
import { apiClient } from './api.config';
import type { HealthResponse } from '../types/health.types';

const getHealth = (): Promise<HealthResponse> => {
	return apiClient<HealthResponse>('/health');
};

export const useHealthQuery = () => {
	return useQuery({
		queryKey: ['health'],
		queryFn: getHealth,
	});
};
