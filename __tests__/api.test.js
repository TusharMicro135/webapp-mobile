import {FIXTURE_LOGIN_INPUTS, login} from '../src/api';

describe('login API', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('posts the fixed dummy body to the web login endpoint', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        fixture: 'dummy-placeholder',
        note: 'Fixture response only.',
      }),
    });

    await login();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = global.fetch.mock.calls[0];

    expect(url).toBe('https://mobile-placeholder.invalid/auth/login');
    expect(options.method).toBe('POST');
    expect(options.headers).toEqual({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(options.body)).toEqual({
      fixture: 'dummy-placeholder',
      username: FIXTURE_LOGIN_INPUTS.username,
      password: FIXTURE_LOGIN_INPUTS.password,
    });
  });
});
