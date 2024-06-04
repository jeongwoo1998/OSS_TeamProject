import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function FirstPage({ navigation }) {
  return (
    <View style={styles.container}>
    // 앱 로고 이미지 
      <Image source={require('./assets/dummy.png')} style={styles.image} resizeMode="contain" />
    </View> )}