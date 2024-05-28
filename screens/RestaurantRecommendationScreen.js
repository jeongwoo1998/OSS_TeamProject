import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Text } from 'react-native-paper';
import Header from '../components/Header';
import { AppStyles as styles } from '../styles/AppStyles';
import MapView from 'react-native-maps';
import MenuScreen from '../components/MenuScreen';


const RestaurantRecommendationScreen = ({ navigation }) => {
  const [showMenu, setShowMenu] = useState(false);      // 메뉴 화면의 표시 여부, 기본 값은 안 보이는 것
  const [recommendedFoods, setRecommendedFoods] = useState([]);        // 서버로부터 받아온 추천 음식 데이터, 초기값은 빈 배열
  const [selectedFood, setSelectedFood] = useState(null);       // 사용자가 선택한 음식, 초기값은 null
  const [mapRegion, setMapRegion] = useState({      // 지도 영역의 위치와 확대 수준을 결정하는 상태 변수, 초기값은 임의로 설정
    latitude: 37.5666791,     // 지도 중심의 위도 좌표
    longitude: 126.9782914,   // 지도 중심의 경도 좌표
    latitudeDelta: 0.0922,    // 지도의 위도 범위
    longitudeDelta: 0.0421,   // 지도의 경도 범위
  });

  const toggleMenu = () => {    // showMenu 상태를 반전시켜 메뉴 화면을 열거나 닫음
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    // 서버로부터 추천 음식 데이터 가져오기
    const fetchRecommendedFoods = async () => {
      try {
        // 여기에서 NutritionStatsScreen에서 총 영양소 섭취량 데이터를 받아와야 함
        
        const recommendedFoods = ['한식', '중식', '일식'];  // 임의 데이터
        setRecommendedFoods(recommendedFoods);  // setRecommendedFoods를 호출하여 받아온 음식 데이터로 recommendedFoods 상태를 업데이트함
      } catch (error) {
        // 서버 요청 실패 혹은 타임아웃 오류 발생 시 에러 메시지 출력
        console.error('Error fetching recommended foods:', error);
      }
    };

    fetchRecommendedFoods();
  }, []);

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    // 여기에서 선택된 음식에 따라 지도 데이터를 업데이트하는 로직을 구현해야 함
    // 예를 들어, 카카오맵 API를 사용하여 해당 음식에 대한 근처 식당 데이터를 가져와 지도에 표시하기
  };

  return showMenu ? (
    // showMenu가 True라면 메뉴 화면 띄우기
    <MenuScreen navigation={navigation} closeMenu={toggleMenu} />
  ) : (
    // Header 컴포넌트, 현재 기기의 상태 표시줄의 높이만큼 상단에 패딩을 추가
    <SafeAreaView style={[styles.container, { paddingTop: StatusBar.currentHeight }]}>
      <Header navigation={navigation} toggleMenu={toggleMenu} title="식당 추천" />
    
      {/* map 함수를 통해 음식 버튼 3개 렌더링 */}
      <View style={styles.foodButtonContainer}>
        {recommendedFoods.map((food) => ( // recommendedFoods 배열에 있는 음식 데이터가 각 버튼의 텍스트 
          
          <TouchableOpacity
            key={food}
            style={[
                styles.foodButton, // 기본 버튼 스타일 적용
                selectedFood === food && styles.selectedFoodButton, // 선택된 버튼이라면 Active 스타일 적용
            ]}
            onPress={() => handleFoodSelect(food)} // 누르면 선택된 음식에 따라 지도 데이터를 업데이트하는 함수 호출
            activeOpacity={0.7}   // 눌렀을 때 버튼을 약간 어둡게 해서 사용자가 터치했음을 인식하게 하는 기능
            >
            <Text
                style={[
                styles.foodButtonText, // 기본 텍스트 스타일 적용
                selectedFood === food && styles.selectedFoodButtonText, // 선택된 버튼이라면 Active 스타일 적용
                ]}
            >
                {food} {/* 텍스트 내용 : 음식 이름 */}
            </Text>
        </TouchableOpacity>

        ))}
      </View>

      {/* MapView를 이용해 지도 영역 렌더링. mapRegion 상태 변수의 값을 전달해 지도의 위치와 확대 수준 설정 */}
      <MapView style={styles.mapContainer} region={mapRegion} />
    </SafeAreaView>
  );
};

export default RestaurantRecommendationScreen;