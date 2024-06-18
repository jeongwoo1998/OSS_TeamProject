import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}> 
      <Image source={require('../assets/dummy.png')} style={styles.image} resizeMode="contain" />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Kakao')}>
          <Image source={require('../assets/kakaoLogin.png')} style={styles.buttonImage} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Google')}>  
          <Image source={require('../assets/googleLogin.png')} style={styles.buttonImage} resizeMode="contain" />
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
    image: {
        width: 200,
        height: 200,
        marginBottom: 50, 
    },
    buttonContainer: {
     width: '80%',
     flexDirection: 'column',
     justifyContent: 'space-between',
     alignItems: 'center',
    },
    button: {
        width: '100%',
        height: 50, 
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonImage: {
        width: '100%',
        height: '100%',
    },
});
