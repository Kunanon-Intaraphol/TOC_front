export const RAW_URL = import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL = `${RAW_URL}/api/v1`;

export const apiClient = async <T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> => {
	const defaultHeaders = {
		'Content-Type': 'application/json',
	};

	const normalizedEndpoint = endpoint.startsWith('/')
		? endpoint
		: `/${endpoint}`;

	const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
		...options,
		headers: {
			...defaultHeaders,
			...options.headers,
		},
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			errorData.detail || `เกิดข้อผิดพลาด API: ${response.status}`,
		);
	}

	return response.json();
};
