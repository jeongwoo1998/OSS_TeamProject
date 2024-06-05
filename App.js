import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FirstPage from './FirstPage';
import SecondPage from './SecondPage';
import ThirdPage from './ThirdPage';
import FourthPage from './FourthPage';
import FifthPage from './FifthPage';
import KakaoLogin from './KakaoLogin';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FirstPage">
        <Stack.Screen name="FirstPage" component={FirstPage} />
        <Stack.Screen name="SecondPage" component={SecondPage} />
        <Stack.Screen name="ThirdPage" component={ThirdPage} />
        <Stack.Screen name="FourthPage" component={FourthPage} />
        <Stack.Screen name="FifthPage" component={FifthPage} />
        <Stack.Screen name="KakaoLogin" component={KakaoLogin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
