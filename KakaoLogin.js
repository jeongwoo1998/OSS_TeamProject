import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function KakaoLogin({ navigation }) {
  const [loading, setLoading] = useState(true);

  const handleWebViewNavigationStateChange = (newNavState) => {
    const { url } = newNavState;
    if (url.includes('http://192.168.0.7:8081')) { 
      // Extract authorization code from the URL
      const authorizationCode = url.split('code=')[1];
      if (authorizationCode) {
        // Handle the authorization code and get the access token
        // Once successful, navigate to SecondPage
        navigation.navigate('SecondPage');
      }
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
        source={{ uri: 'https://kauth.kakao.com/oauth/authorize?client_id=06535f3e8b613de6bf04036d2fe1f580&redirect_uri=http://192.168.0.7:8081&response_type=code' }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
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
