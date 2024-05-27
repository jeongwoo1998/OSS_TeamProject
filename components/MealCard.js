import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { AppStyles as styles } from '../styles/AppStyles';

// mealTitle : 식사 제목, date : 식사 날짜, imageUri : 식사 이미지 URI, onImagePick : 이미지 선택 시 호출되는 콜백함수
const MealCard = ({ mealTitle, date, navigation, imageUri, onImagePick }) => {
  // 해당 식사 정보와 함께 영양 정보 화면으로 이동
  const handleNutritionInfo = () => {
    navigation.navigate('NutritionInfo', { mealTitle, date: date.toISOString(), imageUri });
  };

  return (
    <Card style={styles.mealCard}>
      {/* 각 카드 제목 */}
      <Card.Title title={mealTitle} titleStyle={styles.mealTitle} />

      {/* 각 카드 이미지 */}
      <Card.Content style={styles.mealContent}>
        {/* imageUri가 있을 경우 이미지 표시 */}
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.mealImage} />
        ) : (
          // imageUri가 없을 경우 '이미지를 선택하세요' 글자만 떠 있는 빈 이미지 출력, 이미지 클릭 시 이미지 선택하는 콜백함수 호출
          <TouchableOpacity onPress={() => onImagePick(mealTitle)} style={styles.imagePicker}>
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
