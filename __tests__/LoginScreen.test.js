import React from 'react';
import renderer, {act} from 'react-test-renderer';
import {Text, TextInput} from 'react-native';
import LoginScreen from '../src/screens/LoginScreen';
import {login} from '../src/api';

jest.mock('../src/api', () => {
  const actual = jest.requireActual('../src/api');
  return {...actual, login: jest.fn()};
});

function renderedText(screen) {
  return screen.root
    .findAllByType(Text)
    .map(node => node.props.children)
    .flat(Infinity)
    .filter(value => typeof value === 'string')
    .join(' ');
}

function submitButton(screen) {
  return screen.root.findByProps({accessibilityLabel: 'Submit fixture login'});
}

describe('LoginScreen', () => {
  beforeEach(() => {
    login.mockReset();
  });

  it('blocks empty and non-fixture input without making a request', () => {
    const screen = renderer.create(<LoginScreen />);
    const inputs = screen.root.findAllByType(TextInput);

    act(() => {
      inputs[0].props.onChangeText('');
      submitButton(screen).props.onPress();
    });

    expect(login).not.toHaveBeenCalled();
    expect(renderedText(screen)).toContain('Both fixture-only fields are required');

    act(() => {
      inputs[0].props.onChangeText('not-a-fixture-value');
      submitButton(screen).props.onPress();
    });

    expect(login).not.toHaveBeenCalled();
    expect(renderedText(screen)).toContain('Only the displayed fixture values are accepted');
  });

  it('shows loading and then a sanitized success state', async () => {
    let resolveLogin;
    login.mockReturnValue(
      new Promise(resolve => {
        resolveLogin = resolve;
      }),
    );
    const screen = renderer.create(<LoginScreen />);

    let submission;
    act(() => {
      submission = submitButton(screen).props.onPress();
    });

    expect(renderedText(screen)).toContain('Using placeholder login');
    expect(submitButton(screen).props.disabled).toBe(true);

    await act(async () => {
      resolveLogin({fixture: 'dummy-placeholder', note: 'Fixture response only.'});
      await submission;
    });

    expect(login).toHaveBeenCalledWith();
    expect(renderedText(screen)).toContain('Fixture login complete');
    expect(submitButton(screen).props.disabled).toBe(false);
  });

  it('shows empty-response and request-failure states', async () => {
    const emptyScreen = renderer.create(<LoginScreen />);
    login.mockResolvedValueOnce({});

    await act(async () => {
      await submitButton(emptyScreen).props.onPress();
    });

    expect(renderedText(emptyScreen)).toContain('No fixture response was returned');

    const errorScreen = renderer.create(<LoginScreen />);
    login.mockRejectedValueOnce(new Error('fixture failure'));

    await act(async () => {
      await submitButton(errorScreen).props.onPress();
    });

    expect(renderedText(errorScreen)).toContain('The placeholder request failed');
  });
});
