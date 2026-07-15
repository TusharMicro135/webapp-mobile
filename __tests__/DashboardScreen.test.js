import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import DashboardScreen from '../src/screens/DashboardScreen';
import {getUser} from '../src/api/users';

jest.mock('../src/api/users', () => ({
  DEFAULT_PLACEHOLDER_USER_ID: 'placeholder-user-id',
  getUser: jest.fn(),
}));

describe('DashboardScreen', () => {
  beforeEach(() => {
    getUser.mockReset();
  });

  it('shows loading while the placeholder request is pending', () => {
    getUser.mockReturnValue(new Promise(() => {}));

    let renderer;
    act(() => {
      renderer = TestRenderer.create(<DashboardScreen />);
    });

    expect(
      renderer.root.findByProps({testID: 'dashboard-loading-state'}),
    ).toBeTruthy();

    act(() => {
      renderer.unmount();
    });
  });

  it('shows the empty state without requesting a missing ID', () => {
    let renderer;
    act(() => {
      renderer = TestRenderer.create(<DashboardScreen userId="   " />);
    });

    expect(
      renderer.root.findByProps({testID: 'dashboard-empty-state'}),
    ).toBeTruthy();
    expect(getUser).not.toHaveBeenCalled();

    act(() => {
      renderer.unmount();
    });
  });

  it('renders the returned placeholder user summary', async () => {
    getUser.mockResolvedValue({
      fixture: 'dummy-placeholder',
      id: 'placeholder-user-id',
      displayName: 'Placeholder User',
      note: 'Dummy fixture record; not a real person.',
    });

    let renderer;
    await act(async () => {
      renderer = TestRenderer.create(<DashboardScreen />);
      await Promise.resolve();
    });

    expect(
      renderer.root.findByProps({testID: 'dashboard-user-name'}).children,
    ).toEqual(['Placeholder User']);

    act(() => {
      renderer.unmount();
    });
  });

  it('shows failure state and a retry control', async () => {
    getUser.mockRejectedValue(new Error('Fixture request failed.'));

    let renderer;
    await act(async () => {
      renderer = TestRenderer.create(<DashboardScreen />);
      await Promise.resolve();
    });

    expect(
      renderer.root.findByProps({testID: 'dashboard-error-state'}),
    ).toBeTruthy();
    expect(
      renderer.root.findByProps({testID: 'dashboard-error-state-retry'}),
    ).toBeTruthy();

    act(() => {
      renderer.unmount();
    });
  });
});
