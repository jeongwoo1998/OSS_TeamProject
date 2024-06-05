import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { AppStyles as styles } from '../styles/AppStyles';

const menuItems = [
  { label: '오늘의 식단', screen: 'Home' },
  { label: '일별 통계', screen: 'NutritionStats' },
  { label: '식당 추천', screen: 'RestaurantRecommendation' }, // 추가된 항목
  { label: '목표 섭취량 설정', screen: 'GoalSetting' },
];

const MenuScreen = ({ navigation, closeMenu }) => {  // menuItems.map 메서드를 이용해 배열의 각 하목에 대해 TouchableOpacity 컴포넌트 생성
  return (
    <View style={styles.menuContainer}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.screen}
          style={styles.menuItem}
          onPress={() => {    // 누르면 메뉴 화면을 닫고 해당 화면으로 네비게이션
            closeMenu();
            navigation.navigate(item.screen);
          }}
        >
          <Text style={styles.menuItemText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default MenuScreen;