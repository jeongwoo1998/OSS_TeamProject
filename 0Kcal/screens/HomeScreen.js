import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import MealCard from '../components/MealCard';
import Header from '../components/Header';
import MenuScreen from '../components/MenuScreen';
import { Calendar } from 'react-native-calendars';
import { AppStyles } from '../styles/AppStyles';
import { formatDate } from '../utils/formatDate';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMenu, setShowMenu] = useState(false);
  const [mealImages, setMealImages] = useState({});
  const [loading, setLoading] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleDateSelect = (date) => setSelectedDate(new Date(date.dateString));

  const getEnglishMealTitle = (mealTitle) => {
    switch (mealTitle) {
      case '아침':
        return 'breakfast';
      case '점심':
        return 'lunch';
      case '저녁':
        return 'dinner';
      default:
        return '';
    }
  };

  const uploadImage = async (imageUri, mealTitle, date) => {
    const englishMealTitle = getEnglishMealTitle(mealTitle);
    const currentTime = new Date().toISOString().slice(11, 19).replace(/:/g, '');
    const imageName = `${date.toISOString().slice(0, 10)}_${englishMealTitle}_${currentTime}.jpg`;
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: imageName,
      type: 'image/jpeg',
    });

    try {
      const token = await AsyncStorage.getItem('jwt_access_token');
      console.log('Uploading image to http://10.0.2.2:5000/UploadImage');
      const response = await axios.post('http://10.0.2.2:5000/UploadImage', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Image uploaded successfully:', response.data);
      return response.data.image_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      console.log('Error details:', error.toJSON());
      throw error;
    }
  };

  const detectFood = async (imageUrl) => {
    try {
      const response = await axios.post('http://10.0.2.2:5000/detect', {
        image_path: imageUrl,
      });
      return response.data;
    } catch (error) {
      console.error('Error detecting food:', error);
      console.log('Error details:', error.toJSON());
      throw error;
    }
  };

  const saveMealData = async (mealTitle, date, imageUrl, nutritionInfo) => {
    let saveDataEndpoint = '';
    let dataKey = '';
    switch (mealTitle) {
      case '아침':
        saveDataEndpoint = 'http://10.0.2.2:5000/SetBreakfastData';
        dataKey = 'breakfast_data';
        break;
      case '점심':
        saveDataEndpoint = 'http://10.0.2.2:5000/SetLunchData';
        dataKey = 'lunch_data';
        break;
      case '저녁':
        saveDataEndpoint = 'http://10.0.2.2:5000/SetDinnerData';
        dataKey = 'dinner_data';
        break;
      default:
        break;
    }

    const token = await AsyncStorage.getItem('jwt_access_token');
    const nutrition = nutritionInfo[0];
    const data = {
      date: date.toISOString().slice(0, 10),
      [dataKey]: {
        pic: imageUrl,
        food: nutrition.food,
        calories: parseFloat(nutrition.calories),
        carbs: parseFloat(nutrition.carbs),
        protein: parseFloat(nutrition.protein),
        fat: parseFloat(nutrition.fat),
      },
    };

    try {
      const response = await axios.post(saveDataEndpoint, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Meal data saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving meal data:', error);
      console.log('Error details:', error.toJSON());
      throw error;
    }
  };

  const handleImagePick = async (mealTitle, date) => {
    setLoading(true); // Start loading
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        const imageUrl = await uploadImage(result.assets[0].uri, mealTitle, date);
        const timestampedUrl = imageUrl + '?' + new Date().getTime();
        const nutritionInfo = await detectFood(imageUrl);
        await saveMealData(mealTitle, date, imageUrl, nutritionInfo);
        setMealImages((prevImages) => ({
          ...prevImages,
          [date.toISOString().slice(0, 10)]: {
            ...prevImages[date.toISOString().slice(0, 10)],
            [mealTitle]: timestampedUrl,
          },
        }));
        navigation.navigate('NutritionInfo', { mealTitle, date: date.toISOString(), imageUri: timestampedUrl, nutritionInfo });
      }
    } catch (error) {
      console.error('Error picking or uploading image:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const fetchMealImages = async (date) => {
    try {
      const token = await AsyncStorage.getItem('jwt_access_token');
      const response = await axios.get(`http://10.0.2.2:5000/GetDateData/${date.toISOString().slice(0, 10)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mealData = response.data;
      const timestampedBreakfastPic = mealData.breakfast ? mealData.breakfast.pic + '?' + new Date().getTime() : null;
      const timestampedLunchPic = mealData.lunch ? mealData.lunch.pic + '?' + new Date().getTime() : null;
      const timestampedDinnerPic = mealData.dinner ? mealData.dinner.pic + '?' + new Date().getTime() : null;
      setMealImages((prevImages) => ({
        ...prevImages,
        [date.toISOString().slice(0, 10)]: {
          '아침': timestampedBreakfastPic,
          '점심': timestampedLunchPic,
          '저녁': timestampedDinnerPic,
        },
      }));
    } catch (error) {
      // console.error('Error fetching meal images:', error);
      setMealImages((prevImages) => ({
        ...prevImages,
        [date.toISOString().slice(0, 10)]: {
          '아침': null,
          '점심': null,
          '저녁': null,
        },
      }));
    }
  };

  useEffect(() => {
    fetchMealImages(selectedDate);
  }, [selectedDate]);

  return (
    <SafeAreaView style={[AppStyles.container, { paddingTop: StatusBar.currentHeight }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Header showMenu={showMenu} toggleMenu={toggleMenu} navigation={navigation} title="오늘의 식단 정보" />
          {showMenu && (
            <View style={AppStyles.overlay}>
              <MenuScreen navigation={navigation} closeMenu={toggleMenu} />
            </View>
          )}
          <View style={AppStyles.dateContainer}>
            <Text style={AppStyles.date}>{formatDate(selectedDate)}</Text>
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
          <View style={AppStyles.mealContainer}>
            {['아침', '점심', '저녁'].map((mealTitle) => (
              <MealCard
                key={mealTitle}
                mealTitle={mealTitle}
                date={selectedDate}
                navigation={navigation}
                imageUri={mealImages[selectedDate.toISOString().slice(0, 10)] ? mealImages[selectedDate.toISOString().slice(0, 10)][mealTitle] : null}
                onImagePick={handleImagePick}
              />
            ))}
          </View>
          {loading && (
            <View style={localStyles.loadingOverlay}>
              <ActivityIndicator size="large" color="#6200ee" />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default HomeScreen;
