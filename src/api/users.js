import {request} from './client';

export const DEFAULT_PLACEHOLDER_USER_ID = 'placeholder-user-id';

export function getUser(id = DEFAULT_PLACEHOLDER_USER_ID) {
  const normalizedId = typeof id === 'string' ? id.trim() : '';

  if (!normalizedId) {
    return Promise.resolve(null);
  }

  return request(`/users/${encodeURIComponent(normalizedId)}`, {
    method: 'GET',
  });
}
