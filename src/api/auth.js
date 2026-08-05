import {request} from './client';

export const MOBILE_FIXTURE_CREDENTIALS = Object.freeze({
  username: 'mobile-fixture-user',
  password: 'mobile-fixture-input',
});

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
