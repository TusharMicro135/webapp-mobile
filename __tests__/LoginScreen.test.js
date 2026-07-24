import React from 'react';
import renderer, {act} from 'react-test-renderer';
import LoginScreen, {
  validateFixtureCredentials,
} from '../src/screens/LoginScreen';
import {login} from '../src/api/auth';

jest.mock('../src/api/auth', () => ({
  login: jest.fn(),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects empty values before calling the API', () => {
    expect(
      validateFixtureCredentials({username: '', password: ''}),
    ).toBe('Enter both placeholder fields before continuing.');
    expect(login).not.toHaveBeenCalled();
  });

  it('rejects non-placeholder values', () => {
    expect(
      validateFixtureCredentials({
        username: 'placeholder-extra',
        password: 'placeholder-extra',
      }),
    ).toBe(
      'Only fixture placeholder values are accepted. Never enter real credentials.',
    );
  });

  it('submits the exact fixture fields and shows success', async () => {
    login.mockResolvedValue({
      fixture: 'dummy-placeholder',
      note: 'Dummy fixture response only.',
    });

    let screen;
    await act(async () => {
      screen = renderer.create(<LoginScreen />);
    });

    await act(async () => {
      screen.root
        .findByProps({testID: 'username-input'})
        .props.onChangeText('placeholder');
      screen.root
        .findByProps({testID: 'password-input'})
        .props.onChangeText('placeholder');
    });

    await act(async () => {
      await screen.root.findByProps({testID: 'login-button'}).props.onPress();
    });

    expect(login).toHaveBeenCalledWith({
      username: 'placeholder',
      password: 'placeholder',
    });
    expect(
      screen.root.findByProps({testID: 'login-status'}).props.children.props
        .children,
    ).toBe('Fixture login confirmed. No session value was stored.');
  });

  it('shows failure feedback when the request rejects', async () => {
    login.mockRejectedValue(new Error('fixture failure'));

    let screen;
    await act(async () => {
      screen = renderer.create(<LoginScreen />);
    });

    await act(async () => {
      screen.root
        .findByProps({testID: 'username-input'})
        .props.onChangeText('placeholder');
      screen.root
        .findByProps({testID: 'password-input'})
        .props.onChangeText('placeholder');
    });

    await act(async () => {
      await screen.root.findByProps({testID: 'login-button'}).props.onPress();
    });

    expect(
      screen.root.findByProps({testID: 'login-status'}).props.children.props
        .children,
    ).toBe('Placeholder login failed. Try again with fixture values.');
  });
});
