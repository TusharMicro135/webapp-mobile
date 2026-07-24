import React from 'react';
import LoginScreen from '../screens/LoginScreen';

export const ROUTES = Object.freeze({
  LOGIN: 'Login',
});

export const SCREEN_REGISTRY = Object.freeze({
  [ROUTES.LOGIN]: LoginScreen,
});

export default function AppNavigator() {
  const Screen = SCREEN_REGISTRY[ROUTES.LOGIN];
  return <Screen />;
}
