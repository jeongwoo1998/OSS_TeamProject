import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Text } from 'react-native-paper';
import { AppStyles as styles } from '../styles/AppStyles';
import Header from '../components/Header';
import MenuScreen from '../components/MenuScreen';
import axios from 'axios';
import { formatDate } from '../utils/formatDate';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// NutritionInfo 컴포넌트 정의 : 영양 정보 표시 역할
const NutritionInfo = ({ nutritionData }) => {
  return (
    <View style={styles.totalIntakeContainer}>
      <Text style={styles.totalIntakeTitle}>총 섭취량</Text>
      <Text style={styles.nutritionText}>
        <Text style={styles.nutritionLabel}>음식</Text> <Text style={styles.unit}> | </Text> <Text style={styles.nutritionValue}>{nutritionData.food}</Text>
      </Text>
      <Text style={styles.nutritionText}>
        <Text style={styles.nutritionLabel}>열량</Text> <Text style={styles.unit}> | </Text> <Text style={styles.nutritionValue}>{nutritionData.calories}</Text> <Text style={styles.unit}> kcal</Text>
      </Text>
      <Text style={styles.nutritionText}>
        <Text style={styles.nutritionLabel}>탄수화물</Text> <Text style={styles.unit}> | </Text> <Text style={styles.nutritionValue}>{nutritionData.carbs}</Text> <Text style={styles.unit}> g</Text>
      </Text>
      <Text style={styles.nutritionText}>
        <Text style={styles.nutritionLabel}>단백질</Text> <Text style={styles.unit}> | </Text> <Text style={styles.nutritionValue}>{nutritionData.protein}</Text> <Text style={styles.unit}> g</Text>
      </Text>
      <Text style={styles.nutritionText}>
        <Text style={styles.nutritionLabel}>지방</Text> <Text style={styles.unit}> | </Text> <Text style={styles.nutritionValue}>{nutritionData.fat}</Text> <Text style={styles.unit}> g</Text>
      </Text>
    </View>
  );
};

const NutritionInfoScreen = ({ route, navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date(route.params.date));
  const { mealTitle, date } = route.params;
  const [currentMeal, setCurrentMeal] = useState(mealTitle);
  const [nutritionData, setNutritionData] = useState(null);
  const [mealImage, setMealImage] = useState(route.params.imageUri);
  const [showMenu, setShowMenu] = useState(false);

  const handlePrevMeal = () => {
    if (currentMeal === '아침') return;
    if (currentMeal === '점심') setCurrentMeal('아침');
    if (currentMeal === '저녁') setCurrentMeal('점심');
  };

  const handleNextMeal = () => {
    if (currentMeal === '저녁') return;
    if (currentMeal === '아침') setCurrentMeal('점심');
    if (currentMeal === '점심') setCurrentMeal('저녁');
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const fetchMealImage = async (mealType) => {
    try {
      const token = await AsyncStorage.getItem('jwt_access_token');
      const response = await axios.get(`http://10.0.2.2:5000/GetDateData/${selectedDate.toISOString().slice(0, 10)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let mealData = {};
      if (mealType === '아침') mealData = response.data.breakfast;
      if (mealType === '점심') mealData = response.data.lunch;
      if (mealType === '저녁') mealData = response.data.dinner;

      setMealImage(mealData.pic + '?' + new Date().getTime());
      setNutritionData(mealData);
    } catch (error) {
      if (error.response) {
        // console.error('Error fetching meal image:', error.response.data);
      } else if (error.request) {
        // console.error('Error fetching meal image:', error.request);
      } else {
        // console.error('Error fetching meal image:', error.message);
      }
      setMealImage(null);
      setNutritionData({
        food: '-',
        calories: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
      });
    }
  };

  useEffect(() => {
    fetchMealImage(currentMeal);
  }, [currentMeal, selectedDate]);

  return showMenu ? (
    <MenuScreen navigation={navigation} closeMenu={toggleMenu} />
  ) : (
    <SafeAreaView style={[styles.container, { paddingTop: StatusBar.currentHeight }]}>
      <Header navigation={navigation} toggleMenu={toggleMenu} title="영양 정보" />
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{formatDate(selectedDate)}</Text>
        <Ionicons name="calendar" size={18} color="black" />
      </View>
      <View style={styles.mealContainer}>
        <TouchableOpacity onPress={handlePrevMeal}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.mealTitle}>{currentMeal}</Text>
        <TouchableOpacity onPress={handleNextMeal}>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.mealContent}>
        {mealImage ? (
          <Image source={{ uri: mealImage }} style={styles.mealImage} />
        ) : (
          <View style={styles.imagePicker}>
          <Text style={[styles.imagePickerText]}>음식 정보 없음</Text>
          </View>
        )}
      </View>
      {nutritionData ? (
        <NutritionInfo nutritionData={nutritionData} />
      ) : (
        <Text style={styles.loadingText}>영양 정보를 불러오는 중...</Text>
      )}
    </SafeAreaView>
  );
};

export default NutritionInfoScreen;
