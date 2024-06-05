import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Text } from 'react-native-paper';
import { AppStyles as styles } from '../styles/AppStyles';
import Header from '../components/Header';
import MenuScreen from '../components/MenuScreen';
import api from '../utils/api';
import { formatDate } from '../utils/formatDate';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';


// NutritionInfo 컴포넌트 정의 : 영양 정보 표시 역할
const NutritionInfo = ({ nutritionData }) => {
  return (
    <View style={styles.totalIntakeContainer}>

      <Text style={styles.totalIntakeTitle}>총 섭취량</Text>

      <Text style={styles.nutritionText}>
        <Text style={styles.nutritionLabel}>열량</Text> <Text> | </Text> <Text style={styles.nutritionValue}>{nutritionData.calories}</Text> <Text> kcal</Text>
      </Text>

      <Text style={styles.nutritionText}>
        <Text style={styles.nutritionLabel}>탄수화물</Text> <Text> | </Text> <Text style={styles.nutritionValue}>{nutritionData.carbs}</Text> <Text> g</Text>
      </Text>

      <Text style={styles.nutritionText}>
        <Text style={styles.nutritionLabel}>단백질</Text> <Text> | </Text> <Text style={styles.nutritionValue}>{nutritionData.protein}</Text> <Text> g</Text>
      </Text>

      <Text style={styles.nutritionText}>
        <Text style={styles.nutritionLabel}>지방</Text> <Text> | </Text> <Text style={styles.nutritionValue}>{nutritionData.fat}</Text> <Text> g</Text>
      </Text>

    </View>
  );
};

const NutritionInfoScreen = ({ route, navigation }) => { // route : 이전 화면에서 전달된 매개변수를 포함함
  const [selectedDate, setSelectedDate] = useState(new Date(route.params.date)); // 현재 선택된 날짜를 저장하는 상태, 사용자가 날짜를 선택하면 해당 날짜로 업데이트됨
  const { mealTitle, date, imageUri } = route.params; // 현재 식사 제목, 날짜, 이미지 URI 저장
  const [currentMeal, setCurrentMeal] = useState(mealTitle); // 현재 식사 제목 저장, 기본값은 mealTitle, 사용자가 식사 변경 시 반영
  const [nutritionData, setNutritionData] = useState(null); // 영양 정보 저장 변수, 초기값은 null, 서버로부터 영양 정보를 가져와서 이 변수에 저장
  const [showMenu, setShowMenu] = useState(false); // 메뉴 화면 표시 여부 저장 변수, 초기값은 메뉴 화면 안 보여주기

  const handlePrevMeal = () => { // 이전 식사로 이동하는 함수
    if (currentMeal === '아침') return;
    if (currentMeal === '점심') setCurrentMeal('아침');
    if (currentMeal === '저녁') setCurrentMeal('점심');
  };

  const handleNextMeal = () => { // 다음 식사로 이동하는 함수
    if (currentMeal === '저녁') return;
    if (currentMeal === '아침') setCurrentMeal('점심');
    if (currentMeal === '점심') setCurrentMeal('저녁');
  };

  const toggleMenu = () => { // 메뉴 화면을 토글하는 함수
    setShowMenu(!showMenu);
  };

  // 사용자가 이미지를 선택하고, 선택된 이미지를 해당 식사의 이미지로 설정하며, 서버에 업로드하는 함수
  // ImagePicker.launchImageLibraryAsync : 이미지 선택을 위한 라이브러리 호출
  // setMealImages를 통해 mealImage 상태 업데이트
  // 이미지를 서버에 업로드하기 위해 FormData를 생성하고, axios.post를 통해 서버에 전송

  const handleImagePick = async (mealTitle, date) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        const selectedImageUri = result.uri; // 사용자가 선택한 이미지의 로컬 uri
        setMealImages((prevImages) => ({ ...prevImages, [mealTitle]: selectedImageUri }));
        // 서버로 이미지 업로드
        const formData = new FormData();
        formData.append('image', { uri: selectedImageUri, name: 'image.jpg', type: 'image/jpeg' });
        await axios.post('/api/upload-image', formData); // 첫 번째 변수에 이미지 요청에 대한 상대 경로 입력
        // 선택된 이미지 URI로 상태 업데이트
        navigation.setParams({ imageUri: selectedImageUri });
      }
    } catch (error) {
      console.error('Error picking or uploading image:', error);
    }
  };

  useEffect(() => {
    // 서버로부터 영양 정보 가져오기
    const fetchNutritionData = async () => {
      try {
        // race는 아래 두 가지 작업을 동시에 진행하고, 먼저 완료되는 작업의 결과를 처리하기 위해 사용된 메서드
        // response는 가장 먼저 완료된 Promise 결과가 response 변수에 할당됨. 즉, 서버로부터 받은 영양 정보거나 타임아웃 오류가 발생한 경우의 에러 객체임
        const response = await Promise.race([
          // 서버로부터 영양 정보를 가져오는 작업 수행, 요청 URL에는 선택된 날짜와 식사에 해당하는 정보가 포함
          api.get(`/api/nutrition-info?date=${selectedDate.toISOString()}&meal=${currentMeal}`),
          // 요청 이후 5초 뒤에 reject 함수를 호출하여 타임아웃 오류를 발생시킴
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000)),
        ]);
        setNutritionData(response.data); // 서버로부터 응답을 받으면 해당 응답 데이터를 사용하여 setNutritionData 함수 호출, nutritionData 상태 업데이트
      } catch (error) {
        // 서버 요청 실패 혹은 타임아웃 오류 발생 시 nutritionData 상태를 기본값으로 설정하여 초기화
        console.error('Error fetching nutrition data:', error); 
        setNutritionData({
          calories: 0,
          carbs: 0,
          protein: 0,
          fat: 0,
        });
      }
    };

    fetchNutritionData();
  }, [selectedDate, currentMeal]);

  return showMenu ? (
    // showMenu가 True라면 메뉴 화면 띄우기
    <MenuScreen navigation={navigation} closeMenu={toggleMenu} />
  ) : (
    // Header 컴포넌트, 현재 기기의 상태 표시줄의 높이만큼 상단에 패딩을 추가
    <SafeAreaView style={[styles.container, { paddingTop: StatusBar.currentHeight }]}>
      <Header navigation={navigation} toggleMenu={toggleMenu} title="영양 정보" />

      {/* 날짜 표시 및 캘린더 아이콘 */}
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{formatDate(selectedDate)}</Text>
        <Ionicons name="calendar" size={18} color="black" />
      </View>

      {/* 이전/다음 식사를 선택할 수 있는 좌우 화살표와 현재 식사 제목 Text */}
      <View style={styles.mealContainer}>
        {/* 왼쪽 화살표 */}
        <TouchableOpacity onPress={handlePrevMeal}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        {/* 현재 식사 제목 Text */}
        <Text style={styles.mealTitle}>{currentMeal}</Text>
        {/* 오른쪽 화살표 */}
        <TouchableOpacity onPress={handleNextMeal}>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* 현재 선택된 식사의 이미지를 표시하는 Image 컴포넌트 */}
      <View style={styles.mealContent}>
        {/* imageUri가 있을 경우 이미지 표시 */}
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.mealImage} />
        ) : (
          // imageUri가 없을 경우 '이미지를 선택하세요' 글자만 떠 있는 빈 이미지 출력, 이미지 클릭 시 이미지 선택하는 콜백함수 호출
          <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
            <Text style={[styles.imagePickerText, { textAlign: 'center' }]}>이미지를 선택하세요</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 영양 정보가 로드되었다면 NutritionInfo 컴포넌트 렌더링, 로드 중이면 "영양 정보를 불러오는 중..." Text */}
      {nutritionData ? (
        <NutritionInfo nutritionData={nutritionData} />
      ) : (
        <Text style={styles.loadingText}>영양 정보를 불러오는 중...</Text>
      )}
    </SafeAreaView>
  );
};

export default NutritionInfoScreen;