import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { AppStyles as styles } from '../styles/AppStyles';

const menuItems = [     // 메뉴 항목에 대한 정보를 객체로 저장
  { label: '오늘의 식단', screen: 'Home' },
  { label: '일별 통계', screen: 'NutritionStats' },
  // { label: '식당 추천', screen: 'RestaurantRecommendation' },
  { label: '목표 섭취량 설정', screen: 'GoalSetting' },
];

const MenuScreen = ({ navigation, closeMenu }) => {
  return ( // menuItems.map 메서드를 이용해 배열의 각 항목에 대해 TouchableOpacity 컴포넌트 생성
    <View style={styles.menuContainer}>  
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.screen}
          style={styles.menuItem}
          onPress={() => { closeMenu(); navigation.navigate(item.screen); }}  // 누르면 메뉴 화면을 닫고 해당 화면으로 네비게이션
        >
          <Text style={styles.menuItemText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default MenuScreen;
