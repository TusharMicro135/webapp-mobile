import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {TextInput} from 'react-native';
import LoginScreen from '../src/screens/LoginScreen';
import {
  MOBILE_FIXTURE_CREDENTIALS,
} from '../src/api/auth';

function renderScreen(loginRequest) {
  let renderer;

  act(() => {
    renderer = TestRenderer.create(
      <LoginScreen loginRequest={loginRequest} />,
    );
  });

  return renderer;
}

describe('LoginScreen', () => {
  test('renders fixture inputs and rejects empty values locally', async () => {
    const loginRequest = jest.fn();
    const renderer = renderScreen(loginRequest);
    const root = renderer.root;
    const inputs = root.findAllByType(TextInput);

    expect(inputs).toHaveLength(2);
    expect(inputs[0].props.value).toBe(
      MOBILE_FIXTURE_CREDENTIALS.username,
    );
    expect(inputs[1].props.value).toBe(
      MOBILE_FIXTURE_CREDENTIALS.password,
    );

    act(() => {
      inputs[0].props.onChangeText('');
    });

    await act(async () => {
      await root.findByProps({testID: 'submit-login'}).props.onPress();
    });

    expect(loginRequest).not.toHaveBeenCalled();
    expect(
      root.findByProps({testID: 'status-message'}).props.children,
    ).toBe(
      'Enter both fixture-only placeholder values before continuing.',
    );
  });

  test('shows loading and success without rendering response session data', async () => {
    let resolveRequest;
    const loginRequest = jest.fn(
      () =>
        new Promise(resolve => {
          resolveRequest = resolve;
        }),
    );
    const renderer = renderScreen(loginRequest);
    const root = renderer.root;
    let submission;

    await act(async () => {
      submission = root
        .findByProps({testID: 'submit-login'})
        .props.onPress();
      await Promise.resolve();
    });

    expect(root.findAllByProps({testID: 'login-spinner'})).toHaveLength(1);
    expect(loginRequest).toHaveBeenCalledWith(
      MOBILE_FIXTURE_CREDENTIALS,
    );

    await act(async () => {
      resolveRequest({
        fixture: 'dummy-placeholder',
        note: 'Fixture response only.',
      });
      await submission;
    });

    expect(
      root.findByProps({testID: 'status-message'}).props.children,
    ).toBe('Fixture login completed successfully.');
    expect(JSON.stringify(renderer.toJSON())).not.toContain('session');
  });

  test('shows a sanitized failure state', async () => {
    const loginRequest = jest.fn().mockRejectedValue(
      new Error('request failed'),
    );
    const renderer = renderScreen(loginRequest);
    const root = renderer.root;

    await act(async () => {
      await root.findByProps({testID: 'submit-login'}).props.onPress();
    });

    expect(
      root.findByProps({testID: 'status-message'}).props.children,
    ).toBe(
      'Fixture login failed. No production service or credentials were used.',
    );
  });
});
