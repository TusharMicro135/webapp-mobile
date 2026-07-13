export const PLACEHOLDER_API_BASE_URL = 'https://mobile-placeholder.invalid';

export async function request(path, options = {}) {
  const response = await fetch(`${PLACEHOLDER_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error('Dummy fixture request failed; no production API is configured.');
  }

  return response.json();
}
