import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ThirdPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dummy Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', 
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
