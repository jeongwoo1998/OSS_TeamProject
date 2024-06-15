import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { AppStyles as styles } from '../styles/AppStyles';

const MealCard = ({ mealTitle, date, navigation, imageUri, onImagePick }) => {
  const handleNutritionInfo = () => {
    navigation.navigate('NutritionInfo', { mealTitle, date: date.toISOString(), imageUri });
  };

  return (
    <Card style={styles.mealCard}>
      <Card.Title title={mealTitle} titleStyle={styles.mealTitle} />
      <Card.Content style={styles.mealContent}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.mealImage} />
        ) : (
          <TouchableOpacity onPress={() => onImagePick(mealTitle, date)} style={styles.imagePicker}>
            <Text style={[styles.imagePickerText, { textAlign: 'center' }]}>이미지를 선택하세요</Text>
          </TouchableOpacity>
        )}
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button style={styles.nutritionButton} onPress={handleNutritionInfo}>
          정보
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default MealCard;
