import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function KakaoLogin({ navigation }) {
  const [loading, setLoading] = useState(true);

  const handleWebViewNavigationStateChange = (newNavState) => {
    const { url } = newNavState;
    if (url.includes('myapp://UserInfo')) {
      const token = url.split('token=')[1];
      if (token) {
        navigation.navigate('UserInfo', { token });
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
        source={{ uri: 'http://localhost:8081/login/kakao' }}
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
