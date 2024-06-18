import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';

const CLIENT_ID = '';
const REDIRECT_URI = '';

export default function KakaoLogin({ navigation }) {
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
        source={{ uri: `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=login` }}
        onMessage={handleWebViewMessage}
        onLoadEnd={() => setLoading(false)}
        startInLoadingState={true}
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
