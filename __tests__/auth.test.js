import {
  login,
  MOBILE_FIXTURE_CREDENTIALS,
} from '../src/api/auth';
import {PLACEHOLDER_API_BASE_URL} from '../src/api/client';

describe('login API', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('posts the web-compatible fixture request shape', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({fixture: 'dummy-placeholder'}),
    });

    await login(MOBILE_FIXTURE_CREDENTIALS);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = global.fetch.mock.calls[0];

    expect(url).toBe(
      PLACEHOLDER_API_BASE_URL + '/auth/login',
    );
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({
      fixture: 'dummy-placeholder',
      username: MOBILE_FIXTURE_CREDENTIALS.username,
      password: MOBILE_FIXTURE_CREDENTIALS.password,
    });
  });
});
