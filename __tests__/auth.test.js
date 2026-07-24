import {request} from '../src/api/client';
import {
  FIXTURE_CREDENTIALS,
  login,
  validateFixtureCredentials,
} from '../src/api/auth';

jest.mock('../src/api/client', () => ({
  request: jest.fn(),
}));

describe('fixture login API', () => {
  beforeEach(() => {
    request.mockReset();
  });

  it('rejects empty and non-fixture values before a request', async () => {
    expect(validateFixtureCredentials({username: '', password: ''})).toBe(
      'Both placeholder fields are required.',
    );
    await expect(
      login({username: 'not-a-fixture', password: 'not-a-fixture'}),
    ).rejects.toThrow('Only the supplied fixture values may be submitted.');
    expect(request).not.toHaveBeenCalled();
  });

  it('posts the web-compatible JSON shape through the shared client', async () => {
    const response = {fixture: 'dummy-placeholder'};
    request.mockResolvedValue(response);

    await expect(login(FIXTURE_CREDENTIALS)).resolves.toBe(response);
    expect(request).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        fixture: 'dummy-placeholder',
        username: FIXTURE_CREDENTIALS.username,
        password: FIXTURE_CREDENTIALS.password,
      }),
    });
  });
});
