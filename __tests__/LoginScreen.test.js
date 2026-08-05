import React from 'react';
import {ActivityIndicator, Text, TextInput} from 'react-native';
import renderer, {act} from 'react-test-renderer';
import {login} from '../src/api/auth';
import LoginScreen from '../src/screens/LoginScreen';

jest.mock('../src/api/auth', () => ({
  login: jest.fn(),
}));

function renderScreen() {
  let screen;

  act(() => {
    screen = renderer.create(<LoginScreen />);
  });

  return screen;
}

function setFixtureValues(screen) {
  const fields = screen.root.findAllByType(TextInput);

  act(() => {
    fields[0].props.onChangeText('dummy-placeholder');
    fields[1].props.onChangeText('dummy-placeholder');
  });
}

function findText(screen, value) {
  return screen.root.findAll(
    node => node.type === Text && node.props.children === value,
  );
}

describe('LoginScreen', () => {
  beforeEach(() => {
    login.mockReset();
  });

  it('renders both empty fixture inputs and the initial status', () => {
    const screen = renderScreen();

    expect(screen.root.findAllByType(TextInput)).toHaveLength(2);
    expect(findText(screen, 'Dummy fixture: not submitted')).toHaveLength(1);
  });

  it('rejects empty input without calling the API', () => {
    const screen = renderScreen();
    const button = screen.root.findByProps({
      accessibilityLabel: 'Submit placeholder login',
    });

    act(() => {
      button.props.onPress();
    });

    expect(login).not.toHaveBeenCalled();
    expect(
      findText(screen, 'Enter both dummy placeholder values before continuing.'),
    ).toHaveLength(1);
  });

  it('does not accept non-fixture input', () => {
    const screen = renderScreen();
    const field = screen.root.findAllByType(TextInput)[0];

    act(() => {
      field.props.onChangeText('non-fixture-input');
    });

    expect(screen.root.findAllByType(TextInput)[0].props.value).toBe('');
    expect(login).not.toHaveBeenCalled();
  });

  it('shows loading and a safe success message', async () => {
    let resolveLogin;
    login.mockImplementation(
      () => new Promise(resolve => {
        resolveLogin = resolve;
      }),
    );

    const screen = renderScreen();
    setFixtureValues(screen);

    act(() => {
      screen.root
        .findByProps({accessibilityLabel: 'Submit placeholder login'})
        .props.onPress();
    });

    expect(screen.root.findAllByType(ActivityIndicator)).toHaveLength(1);

    await act(async () => {
      resolveLogin({fixture: 'dummy-placeholder'});
    });

    expect(findText(screen, 'Fixture status: dummy-placeholder')).toHaveLength(1);
  });

  it('shows a safe failure message when the request fails', async () => {
    login.mockRejectedValue(new Error('Fixture request failed'));

    const screen = renderScreen();
    setFixtureValues(screen);

    await act(async () => {
      await screen.root
        .findByProps({accessibilityLabel: 'Submit placeholder login'})
        .props.onPress();
    });

    expect(
      findText(
        screen,
        'Placeholder login failed. No production credentials were sent.',
      ),
    ).toHaveLength(1);
  });
});
