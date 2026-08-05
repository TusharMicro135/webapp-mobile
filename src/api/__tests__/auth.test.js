import {request} from '../client';
import {FIXTURE_INPUT, login} from '../auth';

jest.mock('../client', () => ({request: jest.fn()}));

describe('fixture login API', () => {
  beforeEach(() => {
    request.mockReset();
  });

  it('uses the web endpoint, method, and JSON request shape', async () => {
    request.mockResolvedValue({fixture: 'dummy-placeholder'});

    await login({username: FIXTURE_INPUT, password: FIXTURE_INPUT});

    expect(request).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        fixture: 'dummy-placeholder',
        username: FIXTURE_INPUT,
        password: FIXTURE_INPUT,
      }),
    });
  });

  it('rejects non-fixture input without calling the shared client', async () => {
    await expect(login({username: 'other', password: 'other'})).rejects.toThrow(
      'Only the displayed fixture marker may be submitted.',
    );
    expect(request).not.toHaveBeenCalled();
  });
});
