import React from 'react';
import LoginScreen from '../screens/LoginScreen';

export const ROUTES = {
  LOGIN: 'Login',
};

export const SCREENS = {
  [ROUTES.LOGIN]: LoginScreen,
};

export default function AppNavigator({initialRoute = ROUTES.LOGIN}) {
  const Screen = SCREENS[initialRoute] || SCREENS[ROUTES.LOGIN];

  return <Screen />;
}
