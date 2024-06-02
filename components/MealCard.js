import React, { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { AppStyles as styles } from '../styles/AppStyles';
import * as ImagePicker from 'expo-image-picker';

// mealTitle : 식사 제목, date : 식사 날짜, imageUri : 식사 이미지 URI, onImagePick : 이미지 선택 시 호출되는 콜백함수
const MealCard = ({ mealTitle, date, navigation, imageUri, onImagePick }) => {
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 URI 저장, 기본값은 null
  // 해당 식사 정보와 함께 영양 정보 화면으로 이동
  const handleNutritionInfo = () => {
    navigation.navigate('NutritionInfo', { mealTitle, date: date.toISOString(), imageUri });
  };

  // 이미지 선택 함수
  const handleImagePick = async () => {
    // 이미지 선택을 위한 권한 요청, 권한 요청의 결과는 status 변수에 할당
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // status 값을 확인했을 때 권한이 허용되지 않은 경우('granted'가 아닌 경우) 아래 알림 메시지 표시
    if (status !== 'granted') {
      alert('접근 권한이 필요합니다.');
      return;
    }

    // 이미지 선택, 선택 결과는 result 변수에 할당
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // 이미지 선택이 취소되지 않았다면 이미지 정보 전달
    if (!result.cancelled) {
      onImagePick(mealTitle, result.uri); // 선택한 이미지의 URI를 전달
      setSelectedImage(result.uri); // 선택된 이미지의 URI 저장
    }
  };

  return (
    <Card style={styles.mealCard}>
      {/* 각 카드 제목 */}
      <Card.Title title={mealTitle} titleStyle={styles.mealTitle} />

      {/* 각 카드 이미지 */}
      <Card.Content style={styles.mealContent}>
        {/* 선택된 이미지가 있을 경우 이미지 표시 */}
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.mealImage} />
        ) : (
          // 선택된 이미지가 없을 경우 '이미지를 선택하세요' 글자만 떠 있는 빈 이미지 출력, 이미지 클릭 시 이미지 선택하는 콜백함수 호출
          <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
            <Text style={[styles.imagePickerText, { textAlign: 'center' }]}>이미지를 선택하세요</Text>
          </TouchableOpacity>
        )}
      </Card.Content>

      {/* '정보' 버튼 클릭 시 해당 식사 정보와 함께 영양 정보 화면으로 이동 */}
      <Card.Actions>
        <Button
          style={[styles.nutritionButton, { minWidth: 100 }]} // 최소 너비 설정
          onPress={handleNutritionInfo} // 버튼을 누르면 식사 정보와 함께 영양 정보 화면으로 이동하는 함수 호출
        >
          정보
        </Button>
      </Card.Actions>
      
    </Card>
  );
};

export default MealCard;
