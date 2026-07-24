import {request} from './client';

export const FIXTURE_CREDENTIALS = Object.freeze({
  username: 'fixture-user',
  password: 'fixture-password',
});

export function validateFixtureCredentials(credentials) {
  if (!credentials?.username?.trim() || !credentials?.password?.trim()) {
    return 'Both placeholder fields are required.';
  }

  if (
    credentials.username !== FIXTURE_CREDENTIALS.username ||
    credentials.password !== FIXTURE_CREDENTIALS.password
  ) {
    return 'Only the supplied fixture values may be submitted.';
  }

  return null;
}

export async function login(credentials) {
  const validationError = validateFixtureCredentials(credentials);
  if (validationError) {
    throw new Error(validationError);
  }

  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      fixture: 'dummy-placeholder',
      username: credentials.username,
      password: credentials.password,
    }),
  });
}
