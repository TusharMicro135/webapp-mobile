import React from 'react';
import LoginScreen from '../screens/LoginScreen';
import {ROUTES} from './routes';

// The scaffold has one initial route. Keep registration here so later screens
// can extend the navigation layer without importing one another.
export const SCREEN_REGISTRY = Object.freeze({
  [ROUTES.LOGIN]: LoginScreen,
});

export default function AppNavigator({initialRoute = ROUTES.LOGIN}) {
  const Screen = SCREEN_REGISTRY[initialRoute] || SCREEN_REGISTRY[ROUTES.LOGIN];
  return <Screen />;
}
