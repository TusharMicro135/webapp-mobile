import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.shell}>
        <Text accessibilityRole="header" style={styles.title}>Dummy Mobile Build Fixture</Text>
        <Text style={styles.body}>Placeholder root shell only. Feature screens are intentionally not part of setup.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1},
  shell: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24},
  title: {fontSize: 22, fontWeight: '600', marginBottom: 12},
  body: {fontSize: 16, textAlign: 'center'},
});
