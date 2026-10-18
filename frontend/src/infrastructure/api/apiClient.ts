const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface RequestOptions extends RequestInit {
  bodyData?: unknown;
  token?: string;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { bodyData, headers, token, ...customConfig } = options;

  // Si no se pasó token explícito, intentar obtenerlo de localStorage en el navegador
  let resolvedToken = token;
  if (!resolvedToken && typeof window !== 'undefined') {
    try {
      resolvedToken =
        localStorage.getItem('roomies_token') ||
        localStorage.getItem('token') ||
        localStorage.getItem('access_token') ||
        localStorage.getItem('authToken') ||
        undefined;
    } catch {
      // Ignorar si localStorage no está accesible
    }
  }

  const authHeaders: Record<string, string> = resolvedToken
    ? {
        Authorization: resolvedToken.startsWith('Bearer ')
          ? resolvedToken
          : `Bearer ${resolvedToken}`,
      }
    : {};

  const config: RequestInit = {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
  };

  if (bodyData !== undefined) {
    config.body = JSON.stringify(bodyData);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Si la respuesta no tiene contenido (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error || data.message || data.details || `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${config.method || 'GET'} ${endpoint}:`, error);
    throw error;
  }
}