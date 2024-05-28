import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import NutritionStatsScreen from './screens/NutritionStatsScreen';
import GoalSettingScreen from './screens/GoalSettingScreen';
import NutritionInfoScreen from './screens/NutritionInfoScreen';
import RestaurantRecommendationScreen from './screens/RestaurantRecommendationScreen';

const Stack = createStackNavigator();

const screens = [
  { name: 'Home', component: HomeScreen }, // 메인 화면
  { name: 'NutritionStats', component: NutritionStatsScreen }, // 영양 통계 화면
  { name: 'GoalSetting', component: GoalSettingScreen }, // 목표 섭취량 설정 화면
  { name: 'NutritionInfo', component: NutritionInfoScreen }, // 영양 정보 화면
  { name: 'RestaurantRecommendation', component: RestaurantRecommendationScreen }, // 식당 추천 화면
];

const App = () => (
  <PaperProvider>
    <NavigationContainer> 
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        {screens.map(({ name, component }) => (
          <Stack.Screen key={name} name={name} component={component} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  </PaperProvider>
);

// 기본 헤더 파일을 없앤 후 커스텀 헤더 파일 사용
// Stack.Screen을 이용해 Screen 컴포넌트를 동적으로 생성

export default App;
