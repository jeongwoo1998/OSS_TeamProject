import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { AppStyles as styles } from '../styles/AppStyles';
import Header from '../components/Header';
import MenuScreen from '../components/MenuScreen';
import api from '../utils/api';
import { formatDate } from '../utils/formatDate';
import { Ionicons } from '@expo/vector-icons';


const NutritionStatsScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // 현재 선택된 날짜, 기본값은 오늘 날짜
  const [totalIntakeData, setTotalIntakeData] = useState(null); // 서버로부터 가져온 총 섭취량 데이터, 기본값은 null
  const [loading, setLoading] = useState(false); // 데이터 로딩 상태를 나타내는 boolean 변수, 기본값은 false
  const [showMenu, setShowMenu] = useState(false); // 메뉴 화면의 표시 여부, 기본 값은 안 보이는 것

  const handleDateSelect = (date) => {  // 캘린더에서 날짜를 선택할 때 호출, 선택된 날짜를 'selectedDate' 상태로 설정
    setSelectedDate(new Date(date.dateString));
  };

  const toggleMenu = () => { // showMenu 상태를 반전시켜 메뉴 화면을 열거나 닫음
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    // 서버로부터 총 섭취량 데이터 가져오기
    const fetchTotalIntakeData = async () => {
      setLoading(true);
      try {
        // race는 아래 두 가지 작업을 동시에 진행하고, 먼저 완료되는 작업의 결과를 처리하기 위해 사용된 메서드
        // response는 가장 먼저 완료된 Promise 결과가 response 변수에 할당됨. 즉, 서버로부터 받은 총 섭취량 데이터거나 타임아웃 오류가 발생한 경우의 에러 객체임
        const response = await Promise.race([
          api.get(`/api/total-intake?date=${selectedDate.toISOString()}`),
          // 요청 이후 5초 뒤에 reject 함수를 호출하여 타임아웃 오류를 발생시킴
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000)),
        ]);
        
        setTotalIntakeData(response.data);
      } catch (error) {
        // 서버 요청 실패 혹은 타임아웃 오류 발생 시 totalIntakeData 상태를 기본값으로 설정하여 초기화
        console.error('Error fetching total intake data:', error);
        setTotalIntakeData({
          calories: 0,
          calorieGoal: 0,
          carbs: 0,
          carbGoal: 0,
          protein: 0,
          proteinGoal: 0,
          fat: 0,
          fatGoal: 0,
        });
      }
    };

    fetchTotalIntakeData();
  }, [selectedDate]);

  return showMenu ? (
    // showMenu가 True라면 메뉴 화면 띄우기
    <MenuScreen navigation={navigation} closeMenu={toggleMenu} />
  ) : (
    // Header 컴포넌트, 현재 기기의 상태 표시줄의 높이만큼 상단에 패딩을 추가
    <SafeAreaView style={[styles.container, { paddingTop: StatusBar.currentHeight }]}>
      <Header navigation={navigation} toggleMenu={toggleMenu} title="영양 통계" />

    {/* 날짜 표시 및 캘린더 아이콘 */}
    <View style={styles.dateContainer}>
      <Text style={styles.date}>{formatDate(selectedDate)}</Text>
      <Ionicons name="calendar" size={18} color="black" />
    </View>

    <Calendar
      onDayPress={handleDateSelect} // 캘린더의 날짜 선택 시 handleDateSelect 함수 호출
      markedDates={{ // 선택된 날짜에 대한 style 지정
        [selectedDate.toISOString().slice(0, 10)]: { 
          selected: true,
          selectedColor: '#6200ee',
        },
      }}
      theme={{ // 달력에 대한 색 지정
        selectedDayBackgroundColor: '#6200ee',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#6200ee',
        dotColor: '#6200ee',
        arrowColor: '#6200ee',
      }}
    />

      {/* 총 섭취량 데이터가 로드되었다면 총 섭취량 컴포넌트 렌더링, 로드 중이면 "총 섭취량을 불러오는 중" 텍스트 띄우기 */}
      { loading ? (
        <Text style={styles.loadingText}>총 섭취량을 불러오는 중...</Text>
      ) : (
        totalIntakeData && (
          <View style={styles.totalIntakeContainer}>
            <Text style={styles.totalIntakeTitle}>총 섭취량</Text>
            <View style={styles.nutritionInfo}>
              <Text style={styles.nutritionText}>
                <Text style={styles.nutritionLabel}>열량</Text> | <Text style={styles.nutritionValue}>{totalIntakeData.calories}</Text> / <Text style={styles.nutritionGoal}>{totalIntakeData.calorieGoal}</Text> <Text>Kcal</Text>
              </Text>
              <Text style={styles.nutritionText}>
                <Text style={styles.nutritionLabel}>탄수화물</Text> | <Text style={styles.nutritionValue}>{totalIntakeData.carbs}</Text> / <Text style={styles.nutritionGoal}>{totalIntakeData.carbGoal}</Text> <Text>g</Text>
              </Text>
              <Text style={styles.nutritionText}>
                <Text style={styles.nutritionLabel}>단백질</Text> | <Text style={styles.nutritionValue}>{totalIntakeData.protein}</Text> / <Text style={styles.nutritionGoal}>{totalIntakeData.proteinGoal}</Text> <Text>g</Text>
              </Text>
              <Text style={styles.nutritionText}>
                <Text style={styles.nutritionLabel}>지방</Text> | <Text style={styles.nutritionValue}>{totalIntakeData.fat}</Text> / <Text style={styles.nutritionGoal}>{totalIntakeData.fatGoal}</Text> <Text>g</Text>
              </Text>
            </View>
          </View>
        )
      )}
    </SafeAreaView>
  );
};

export default NutritionStatsScreen;