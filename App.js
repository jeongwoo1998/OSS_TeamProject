import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import UserInfo from './UserInfo';
import DummyPage from './DummyPage';
import KakaoLogin from './KakaoLogin';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FirstPage">
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="UserInfo" component={UserInfo} />
        <Stack.Screen name="DummyPage" component={DummyPage} />
        <Stack.Screen name="KakaoLogin" component={KakaoLogin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
