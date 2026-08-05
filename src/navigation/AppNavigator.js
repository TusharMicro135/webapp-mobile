import React from 'react';
import LoginScreen from '../screens/LoginScreen';

export const ROUTES = Object.freeze({
  LOGIN: 'Login',
});

export const SCREEN_REGISTRY = Object.freeze({
  [ROUTES.LOGIN]: LoginScreen,
});

export const INITIAL_ROUTE_NAME = ROUTES.LOGIN;

export default function AppNavigator() {
  const InitialScreen = SCREEN_REGISTRY[INITIAL_ROUTE_NAME];

  return <InitialScreen />;
}
