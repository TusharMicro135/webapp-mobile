import React from 'react';
import renderer, {act} from 'react-test-renderer';
import LoginScreen from '../LoginScreen';
import {login} from '../../api/auth';

jest.mock('../../api/auth', () => ({
  FIXTURE_INPUT: 'fixture-only',
  isFixtureLoginInput: value => value === 'fixture-only',
  login: jest.fn(),
}));

function findInteractive(tree, testID, handler) {
  return tree.root.findAll(
    node => node.props.testID === testID && typeof node.props[handler] === 'function',
  )[0];
}

describe('LoginScreen', () => {
  let tree;

  beforeEach(() => {
    login.mockReset();
    act(() => {
      tree = renderer.create(<LoginScreen />);
    });
  });

  afterEach(() => {
    act(() => tree.unmount());
  });

  it('validates empty inputs locally', async () => {
    await act(async () => {
      await findInteractive(tree, 'submit-login', 'onPress').props.onPress();
    });

    expect(login).not.toHaveBeenCalled();
    expect(JSON.stringify(tree.toJSON())).toContain('Enter both fixture-only values');
  });

  it('shows a successful fixture response', async () => {
    login.mockResolvedValue({fixture: 'dummy-placeholder'});
    act(() => {
      findInteractive(tree, 'username-input', 'onChangeText').props.onChangeText('fixture-only');
      findInteractive(tree, 'password-input', 'onChangeText').props.onChangeText('fixture-only');
    });

    await act(async () => {
      await findInteractive(tree, 'submit-login', 'onPress').props.onPress();
    });

    expect(login).toHaveBeenCalledWith({
      username: 'fixture-only',
      password: 'fixture-only',
    });
    expect(JSON.stringify(tree.toJSON())).toContain('Dummy fixture response received.');
  });

  it('shows failure feedback when the fixture request fails', async () => {
    login.mockRejectedValue(new Error('fixture request failed'));
    act(() => {
      findInteractive(tree, 'username-input', 'onChangeText').props.onChangeText('fixture-only');
      findInteractive(tree, 'password-input', 'onChangeText').props.onChangeText('fixture-only');
    });

    await act(async () => {
      await findInteractive(tree, 'submit-login', 'onPress').props.onPress();
    });

    expect(JSON.stringify(tree.toJSON())).toContain('Placeholder login failed.');
  });
});
