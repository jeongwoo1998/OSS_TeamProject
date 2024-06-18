import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AppStyles as styles } from '../styles/AppStyles';
import Header from '../components/Header';
import MenuScreen from '../components/MenuScreen';
import { formatDate } from '../utils/formatDate';
import { Ionicons } from '@expo/vector-icons';

const NutritionStatsScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // 현재 선택된 날짜, 기본값은 오늘 날짜
  const [totalIntakeData, setTotalIntakeData] = useState(null); // 서버로부터 가져온 총 섭취량 데이터, 기본값은 null
  const [intakeGoal, setIntakeGoal] = useState(null); // 서버로부터 가져온 목표 섭취량 데이터, 기본값은 null
  const [loading, setLoading] = useState(false); // 데이터 로딩 상태를 나타내는 boolean 변수, 기본값은 false
  const [showMenu, setShowMenu] = useState(false); // 메뉴 화면의 표시 여부, 기본값은 false
  const [jwtToken, setJwtToken] = useState(null); // JWT 토큰 상태

  const handleDateSelect = (date) => {
    setSelectedDate(new Date(date.dateString)); // 선택된 날짜를 설정
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu); // 메뉴 화면의 표시 여부를 토글
  };

  const formatDateForServer = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('jwt_access_token');
      setJwtToken(token);
    };
    getToken();
  }, []);

  useEffect(() => {
    const fetchTotalIntakeData = async () => {
      setLoading(true); // 로딩 시작
      try {
        const formattedDate = formatDateForServer(selectedDate);
        const response = await axios.get(`http://10.0.2.2:5000/GetTotalData/${formattedDate}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // JWT 토큰을 헤더에 포함
          },
        });

        setTotalIntakeData(response.data);
      } catch (error) {
        // console.error('Error fetching total intake data:', error.response ? error.response.data : error.message);
        setTotalIntakeData({
          calories: ' - ',
          carbs: ' - ',
          protein: ' - ',
          fat: ' - ',
        });
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    const fetchIntakeGoal = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:5000/GetIntakeGoal`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // JWT 토큰을 헤더에 포함
          },
        });

        setIntakeGoal(response.data);
      } catch (error) {
        // console.error('Error fetching intake goal:', error.response ? error.response.data : error.message);
        setIntakeGoal({
          calories: 0,
          carbs: 0,
          protein: 0,
          fat: 0,
        });
      }
    };

    if (jwtToken) { // jwtToken이 있을 때만 데이터 가져오기
      fetchTotalIntakeData();
      fetchIntakeGoal();
    }
  }, [selectedDate, jwtToken]); // selectedDate 또는 jwtToken이 변경될 때마다 실행

  return showMenu ? (
    <MenuScreen navigation={navigation} closeMenu={toggleMenu} /> // 메뉴 화면 표시
  ) : (
    <SafeAreaView style={[styles.container, { paddingTop: StatusBar.currentHeight }]}>
      <Header navigation={navigation} toggleMenu={toggleMenu} title="영양 통계" />

      {/* 날짜 표시 및 캘린더 아이콘 */}
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{formatDate(selectedDate)}</Text>
        <Ionicons name="calendar" size={18} color="black" />
      </View>

      <Calendar
        onDayPress={handleDateSelect}
        markedDates={{
          [selectedDate.toISOString().slice(0, 10)]: {
            selected: true,
            selectedColor: '#6200ee',
          },
        }}
        theme={{
          selectedDayBackgroundColor: '#6200ee',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#6200ee',
          dotColor: '#6200ee',
          arrowColor: '#6200ee',
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" style={styles.loading} />
      ) : (
        totalIntakeData && intakeGoal && (
          <View style={styles.totalIntakeContainer}>
            <Text style={styles.totalIntakeTitle}>총 섭취량</Text>
            <View style={styles.nutritionInfo}>
              <Text style={styles.nutritionText}>
                <Text style={styles.nutritionLabel}>열량</Text><Text style={styles.unit}> | </Text>
                <Text style={styles.nutritionValue}>{totalIntakeData.calories}</Text><Text style={styles.unit}> / </Text>
                <Text style={styles.nutritionGoal}>{intakeGoal.calories}</Text><Text style={styles.unit}> kcal</Text>
              </Text>
              <Text style={styles.nutritionText}>
                <Text style={styles.nutritionLabel}>탄수화물</Text><Text style={styles.unit}> | </Text>
                <Text style={styles.nutritionValue}>{totalIntakeData.carbs}</Text><Text style={styles.unit}> / </Text>
                <Text style={styles.nutritionGoal}>{intakeGoal.carbs}</Text><Text style={styles.unit}> g</Text>
              </Text>
              <Text style={styles.nutritionText}>
                <Text style={styles.nutritionLabel}>단백질</Text><Text style={styles.unit}> | </Text>
                <Text style={styles.nutritionValue}>{totalIntakeData.protein}</Text><Text style={styles.unit}> / </Text>
                <Text style={styles.nutritionGoal}>{intakeGoal.protein}</Text><Text style={styles.unit}> g</Text>
              </Text>
              <Text style={styles.nutritionText}>
                <Text style={styles.nutritionLabel}>지방</Text><Text style={styles.unit}> | </Text>
                <Text style={styles.nutritionValue}>{totalIntakeData.fat}</Text><Text style={styles.unit}> / </Text>
                <Text style={styles.nutritionGoal}>{intakeGoal.fat}</Text><Text style={styles.unit}> g</Text>
              </Text>
            </View>
          </View>
        )
      )}
    </SafeAreaView>
  );
};

export default NutritionStatsScreen;
