import {request} from './client';

// This marker is deliberately not a credential. No arbitrary input is sent.
export const FIXTURE_INPUT = 'fixture-only';

export function isFixtureLoginInput(value) {
  return typeof value === 'string' && value.trim() === FIXTURE_INPUT;
}

export function login(credentials = {}) {
  if (
    !isFixtureLoginInput(credentials.username) ||
    !isFixtureLoginInput(credentials.password)
  ) {
    return Promise.reject(
      new Error('Only the displayed fixture marker may be submitted.'),
    );
  }

  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      fixture: 'dummy-placeholder',
      username: credentials.username.trim(),
      password: credentials.password.trim(),
    }),
  });
}
