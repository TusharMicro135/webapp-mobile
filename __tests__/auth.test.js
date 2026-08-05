import {request} from '../src/api/client';
import {login} from '../src/api/auth';

jest.mock('../src/api/client', () => ({
  request: jest.fn(),
}));

describe('placeholder login API', () => {
  beforeEach(() => {
    request.mockReset();
  });

  it('posts the same fixture request shape as the web application', async () => {
    request.mockResolvedValue({fixture: 'dummy-placeholder'});

    await login({username: 'dummy-placeholder', password: 'dummy-placeholder'});

    expect(request).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        fixture: 'dummy-placeholder',
        username: 'dummy-placeholder',
        password: 'dummy-placeholder',
      }),
    });
  });
});
