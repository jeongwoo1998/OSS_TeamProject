import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import { Text } from 'react-native-paper';
import MealCard from '../components/MealCard';
import Header from '../components/Header';
import MenuScreen from '../components/MenuScreen';
import { Calendar } from 'react-native-calendars';
import { AppStyles as styles } from '../styles/AppStyles';
import api from '../utils/api';
import { formatDate } from '../utils/formatDate';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


const HomeScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // 현재 선택된 날짜, 기본값은 오늘 날짜
  const [showMenu, setShowMenu] = useState(false); // 메뉴 화면의 표시 여부, 기본 값은 안 보이는 것
  const [mealImages, setMealImages] = useState({}); // 각 식사의 이미지 URL을 관리, 기본 값은 빈 객체

  const toggleMenu = () => { // showMenu 상태를 반전시켜 메뉴 화면을 열거나 닫음
    setShowMenu(!showMenu);
  };

  const handleDateSelect = (date) => { // 캘린더에서 날짜를 선택할 때 호출, 선택된 날짜를 'selectedDate' 상태로 설정
    setSelectedDate(new Date(date.dateString));
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
        // NutritionInfoScreen으로 이동하면서 선택된 이미지 URI 전달
        navigation.navigate('NutritionInfo', { mealTitle, date: date.toISOString(), imageUri: selectedImageUri });
      }
    } catch (error) {
      console.error('Error picking or uploading image:', error);
    }
  };


  useEffect(() => {
    // 서버로부터 아침/점심/저녁 이미지 가져오기
    const fetchMealImages = async () => {
      try {
        const response = await api.get('/api/meal-images'); // 서버에서 식사 이미지를 반환하는 엔드포인트 입력
        setMealImages(response.data); // 서버로부터 받아온 식사 이미지의 url 사용 가능
      } catch (error) {
        console.error('Error fetching meal images:', error);
      }
    };
    fetchMealImages();
  }, []);
  

  return (
    // Header + Menu 화면 표시
    <SafeAreaView style={[styles.container, { paddingTop: StatusBar.currentHeight }]}>
      <Header showMenu={showMenu} toggleMenu={toggleMenu} navigation={navigation} title="오늘의 식단 정보" />
      {showMenu && ( // showMenu가 true일 때 MenuScreen을 오버레이로 표시
        <View style={styles.overlay}>
          <MenuScreen navigation={navigation} closeMenu={toggleMenu} />
        </View>
      )}

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

      {/* 식사 카드 */}
      <View style={styles.mealContainer}>
        <MealCard
          mealTitle="아침"
          date={selectedDate} // 달력에서 선택된 날짜
          navigation={navigation}
          imageUri={mealImages['아침']} // 아침에 업로드된 이미지 표시
          onImagePick={handleImagePick} // 이미지 클릭 시 갤러리에서 이미지 선택 가능
        />
        <MealCard
          mealTitle="점심"
          date={selectedDate}
          navigation={navigation}
          imageUri={mealImages['점심']}
          onImagePick={handleImagePick}
        />
        <MealCard
          mealTitle="저녁"
          date={selectedDate}
          navigation={navigation}
          imageUri={mealImages['저녁']}
          onImagePick={handleImagePick}
        />
      </View>

    </SafeAreaView>
  );
};

export default HomeScreen;