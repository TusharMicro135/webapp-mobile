import {getUser} from '../src/api/users';

describe('getUser', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does not request a user when the placeholder ID is missing', async () => {
    await expect(getUser('   ')).resolves.toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('uses the exact encoded GET /users/:id endpoint', async () => {
    const response = {
      fixture: 'dummy-placeholder',
      id: 'fixture / user',
      displayName: 'Placeholder User',
      note: 'Dummy fixture record.',
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(response),
    });

    await expect(getUser(' fixture / user ')).resolves.toEqual(response);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://mobile-placeholder.invalid/users/fixture%20%2F%20user',
      expect.objectContaining({
        method: 'GET',
      }),
    );
    expect(global.fetch.mock.calls[0][1]).not.toHaveProperty('body');
  });
});
