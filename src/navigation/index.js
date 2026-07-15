import DashboardScreen from '../screens/DashboardScreen';

export const INITIAL_ROUTE_NAME = 'Dashboard';

export const routes = Object.freeze({
  Dashboard: DashboardScreen,
});

export function resolveRoute(routeName) {
  return routes[routeName] || routes[INITIAL_ROUTE_NAME];
}
