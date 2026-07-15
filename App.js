import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  INITIAL_ROUTE_NAME,
  resolveRoute,
} from './src/navigation';

const InitialScreen = resolveRoute(INITIAL_ROUTE_NAME);

export default function App() {
  return (
    <SafeAreaView style={styles.page}>
      <InitialScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ecfeff',
    flex: 1,
  },
});
