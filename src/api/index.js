import {request} from './client';

export const FIXTURE_LOGIN_INPUTS = Object.freeze({
  username: 'mobile-fixture-user',
  password: 'mobile-fixture-only',
});

export function login() {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      fixture: 'dummy-placeholder',
      username: FIXTURE_LOGIN_INPUTS.username,
      password: FIXTURE_LOGIN_INPUTS.password,
    }),
  });
}
