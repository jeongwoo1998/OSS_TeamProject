import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function KakaoLogin({ navigation }) {
  const [loading, setLoading] = useState(true); // 로딩 중 여부, 초기값은 true

  const handleWebViewNavigationStateChange = (newNavState) => { // WebView의 네비게이션 상태가 변경될 때 실행되는 함수
    const { url } = newNavState;    // newNavState 객체에서 현재 로드된 URL을 'url' 변수에 할당
    if (url.includes('http://192.168.0.7:8081')) {    // 현재 로드된 URL이 'http://192.168.0.7:8081'을 포함하고 있는지 확인
      // Extract authorization code from the URL
      const authorizationCode = url.split('code=')[1];    // URL에서 'code='라는 문자열 뒤에 오는 값을 추출
      if (authorizationCode) {    // authorizationCode가 존재하는지 확인, 만약 있다면 이 안의 함수를 실행
        
        // 액세스 토큰을 성공적으로 획득한 후, UserInfoScreen(회원가입 시 유저 정보 입력화면)으로 네비게이트
       
        navigation.navigate('UserInfo');
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {loading && (   // loading일 때는 로딩 상태를 사용자에게 나타내는 ActivityIndicator 컴포넌트 보여주기
        <ActivityIndicator
          color='#0000ff'
          size='large'
          style={styles.loading}
        />
      )}
        <WebView        // uri 속성으로 Google OAuth 인증 페이지 로드
        source={{ uri: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=email%20profile' }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        onLoadEnd={() => setLoading(false)}     // 로딩이 끝나면 로딩 화면 사라짐
        startInLoadingState={true}       // 로딩 시작되면 다시 로딩 화면 생김
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
