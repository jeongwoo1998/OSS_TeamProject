import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

export default function GoogleLogin() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const handleWebViewMessage = async (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.jwt_access_token) {
      await AsyncStorage.setItem('jwt_access_token', data.jwt_access_token);
      navigation.navigate('UserInfo');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <ActivityIndicator
          color='#0000ff'
          size='large'
          style={styles.loading}
        />
      )}
      <WebView
        source={{ uri: 'https://e30b-14-55-53-188.ngrok-free.app/google/login' }}
        onMessage={handleWebViewMessage}
        onLoadEnd={() => setLoading(false)}
        startInLoadingState={true}
        userAgent='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
