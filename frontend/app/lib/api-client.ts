

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("API_URL:", API_URL);


let csrfToken: string | null = null


async function fetchCsrfToken(): Promise<void> {
  const res = await fetch(`${API_URL}/auth/csrf-token`, {
    credentials: "include"
  });

  const data = await res.json();
  csrfToken = data.csrfToken;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase();
  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

  if (isMutation && !csrfToken) {
    await fetchCsrfToken();
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
      ...(isMutation && csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      ...(options.headers),
    },
  });


  if (res.status === 401 && path !== '/auth/login') {
    try {
      await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: "include",
      });
      return request<T>(path, options);

    } catch {
      window.location.href = '/login';
      throw new Error('Sessão expirada');
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    
    throw {status: res.status, message:body.message, errors:body.errors,}
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
