import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function FirstPage({ navigation }) {
  return (
    <View style={styles.container}> 
      <Image source={require('./assets/dummy.png')} style={styles.image} resizeMode="contain" />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('KakaoLogin')}>
          <Image source={require('./assets/kakaoLogin.png')} style={styles.buttonImage} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SecondPage')}>
          <Image source={require('./assets/naverLogin.png')} style={styles.buttonImage} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SecondPage')}>
          <Image source={require('./assets/googleLogin.png')} style={styles.buttonImage} resizeMode="contain" />
        </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingTop: 50,
      alignItems: 'center',
      backgroundColor: '#FFFFFF', 
    },
});
