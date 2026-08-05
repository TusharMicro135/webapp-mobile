import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import AppNavigator from './src/navigation';

export default function App() {
  return (
    <SafeAreaView style={styles.page}>
      <AppNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: '#f5f7fb'},
});
