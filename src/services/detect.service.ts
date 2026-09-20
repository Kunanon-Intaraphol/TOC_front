import { useMutation } from '@tanstack/react-query';
import { apiClient } from './api.config';
import type { DetectRequest, DetectResponse } from '../types/detect.types';

const detectPii = (payload: DetectRequest): Promise<DetectResponse> => {
  return apiClient<DetectResponse>('/detect', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      include_matches: payload.include_matches ?? true,
    }),
  });
};

export const useDetectMutation = () => {
  return useMutation({
    mutationFn: detectPii,
  });
};