import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, TextInput } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Header from '../components/Header';
import { AppStyles as styles } from '../styles/AppStyles';
import MapView, { Marker } from 'react-native-maps';
import MenuScreen from '../components/MenuScreen';
import * as Location from 'expo-location';
import api from '../utils/api'


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
  const [searchKeyword, setSearchKeyword] = useState('');  // 사용자가 입력한 검색어 저장
  const [searchResults, setSearchResults] = useState([]);  // 검색 결과 저장

  const toggleMenu = () => {    // showMenu 상태를 반전시켜 메뉴 화면을 열거나 닫음
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    // 사용자의 현재 위치 정보 가져오기
    const fetchUserLocation = async () => {
      try {
        // 위치 정보 접근 권한 요청
        const { status } = await Location.requestForegroundPermissionsAsync();
        // status 값을 확인했을 때 권한이 허용되지 않은 경우('granted'가 아닌 경우) 아래 알림 메시지 표시
        if (status !== 'granted') {
          console.error('접근 권한이 필요합니다.');
          return;
        }

        // 사용자의 현재 위치 가져오기
        const location = await Location.getCurrentPositionAsync({});
        // Marker를 표시하기 위해 현재 위치 저장
        const { latitude, longitude } = location.coords;

        // 가져온 위치 정보로 지도 영역 업데이트
        setMapRegion(prevRegion => ({
          ...prevRegion,
          latitude,
          longitude,
        }));
      } catch (error) {
        console.error('Error fetching user location:', error);
      }
    };

    fetchUserLocation();
  }, []);

  useEffect(() => {
    // 서버로부터 추천 음식 데이터 가져오기
    const fetchRecommendedFoods = async () => {
      try {
        // 여기에서 NutritionStatsScreen에서 총 영양소 섭취량 데이터를 받아와야 함
        // const response = await api.get('/api/recommended-foods');  // 서버 연결 시 쓸 코드 
        const recommendedFoods = ['한식', '중식', '일식']; // 임의 데이터
        setRecommendedFoods(recommendedFoods);  // setRecommendedFoods를 호출하여 받아온 음식 데이터로 recommendedFoods 상태를 업데이트함
      } catch (error) {
        // 서버 요청 실패 혹은 타임아웃 오류 발생 시 에러 메시지 출력
        console.error('Error fetching recommended foods:', error);
      }
    };

    fetchRecommendedFoods();
  }, []);


  // const handleSearch = async () => {
  //   // 검색 처리 함수
  //   try {
  //     // 검색 키워드를 사용하여 서버에 검색 요청 보내기, 응답 결과는 response에 전달
  //     const response = await api.get('/api/search', {
  //       params: {
  //         keyword: searchKeyword,  // params 객체에 keyword라는 키로 검색어(searchKeyword) 전달
  //       },
  //     });
  //     setSearchResults(response.data.results);  // 서버로부터 받은 응답의 data.results를 searchResults 상태에 저장
  //   } catch (error) {
  //     console.error('Error searching:', error);
  //   }
  // };

  const handleFoodSelect = async (food) => {
    // 음식 선택 처리 함수
    try {
      // 선택된 음식을 selectedFood 상태에 저장
      setSelectedFood(food);
      // 선택된 음식과 현재 위치를 기반으로 서버에 음식점 검색 요청 보내기
      const response = await api.get('/api/restaurants', {
        params: {  // params 객체에 food(음식 이름), latitude, longitude(위도, 경도)를 담아 서버에 전달
          food,
          latitude: mapRegion.latitude,
          longitude: mapRegion.longitude,
        },
      });
      // 그럼 서버로부터 id, name, address, latitude, longitude를 전달받아야 함
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Error searching restaurants:', error);
    }
  };

  return showMenu ? (
    // showMenu가 True라면 메뉴 화면 띄우기
    <MenuScreen navigation={navigation} closeMenu={toggleMenu} />
  ) : (
    // Header 컴포넌트, 현재 기기의 상태 표시줄의 높이만큼 상단에 패딩을 추가
    <SafeAreaView style={[styles.container, { paddingTop: StatusBar.currentHeight }]}>
      <Header navigation={navigation} toggleMenu={toggleMenu} title="식당 추천" />
   
      {/* 검색 기능 */}
      {/* <View>
        <TextInput
          style
          placeholder="검색어를 입력하세요"  // 입력 필드가 비어 있을 때 표시되는 텍스트
          value={searchKeyword}
          onChangeText={setSearchKeyword}
        />
        <Button mode="contained" onPress={handleSearch}>  // 버튼을 누르면 검색 처리 함수를 호출함
          검색
        </Button>
      </View> */}

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
      <MapView style={styles.mapContainer} region={mapRegion}>
        {searchResults.map((result) => (
          <Marker
            key={result.id}  // 마커에 고유한 key 설정. React가 각 마커를 고유하게 식별하도록 설정
            coordinate={{
              latitude: result.latitude,  // 마커가 찍힐 위도
              longitude: result.longitude,  // 마커가 찍힐 경도
            }}
            title={result.name}  // 마커의 이름 (식당 이름)
            description={result.address}  // 마커의 설명 (식당 설명)
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
};

export default RestaurantRecommendationScreen;