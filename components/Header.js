import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { AppStyles as styles } from '../styles/AppStyles';
import { Feather } from '@expo/vector-icons';

// showMenu : 메뉴 표시 여부 변수, toggleMenu : 메뉴 토글 함수, title : 상단바에 표시될 제목
const Header = ({ showMenu, toggleMenu, navigation, title }) => {
  return (
    <View style={styles.header}>
      <View style={styles.topContainer}>
        {/* 메뉴 버튼 */}
        <TouchableOpacity onPress={() => toggleMenu(!showMenu)} style={styles.menuButton}>
          <Feather name="menu" size={32} color="black" />
        </TouchableOpacity>
        {/* 0Kcal 로고 */}
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.logo}>0Kcal</Text>
        </TouchableOpacity>

      </View>
      {/* 상단바의 제목 텍스트 */}
      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
};

export default Header;
