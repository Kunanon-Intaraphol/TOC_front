import { useMutation } from '@tanstack/react-query';
import { apiClient } from './api.config';
import type { MaskRequest, MaskResponse } from '../types/mask.types';

const maskPii = (payload: MaskRequest): Promise<MaskResponse> => {
  return apiClient<MaskResponse>('/mask', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      include_matches: payload.include_matches ?? true,
    }),
  });
};

export const useMaskMutation = () => {
  return useMutation({
    mutationFn: maskPii,
  });
};