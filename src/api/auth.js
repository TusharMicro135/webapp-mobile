import {request} from './client';

export function login(credentials) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      fixture: 'dummy-placeholder',
      username: credentials.username,
      password: credentials.password,
    }),
  });
}
