// components/ProfilePage.js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ProgressPage = () => {
  return (
    <View style={styles.container}>
      <Text>This is the Progress Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProgressPage;
