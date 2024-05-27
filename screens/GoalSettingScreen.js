import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Text, RadioButton } from 'react-native-paper';
import Header from '../components/Header';
import MenuScreen from '../components/MenuScreen';
import GoalInput from '../components/GoalInput';
import { AppStyles as styles } from '../styles/AppStyles';
import api from '../utils/api';

const GoalSettingScreen = ({ navigation }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [calorieGoal, setCalorieGoal] = useState('');
  const [carbGoal, setCarbGoal] = useState('');
  const [proteinGoal, setProteinGoal] = useState('');
  const [fatGoal, setFatGoal] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [mealImages, setMealImages] = useState({});

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleImagePick = async (mealTitle, date) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        const selectedImageUri = result.uri;
        setMealImages((prevImages) => ({ ...prevImages, [mealTitle]: selectedImageUri }));
        const formData = new FormData();
        formData.append('image', { uri: selectedImageUri, name: 'image.jpg', type: 'image/jpeg' });
        await axios.post('/api/upload-image', formData);
        navigation.setParams({ imageUri: selectedImageUri });
      }
    } catch (error) {
      console.error(<Text>Error picking or uploading image: {error}</Text>);
    }
  };

  useEffect(() => {
    const fetchGoalData = async () => {
      try {
        const response = await Promise.race([
          api.get('/api/goal-data'),
          new Promise((_, reject) => setTimeout(() => reject(new Error(<Text>Timeout</Text>)), 5000)),
        ]);
        
        const { calorieGoal, carbGoal, proteinGoal, fatGoal, gender, height, weight } = response.data;
        setCalorieGoal(calorieGoal);
        setCarbGoal(carbGoal);
        setProteinGoal(proteinGoal);
        setFatGoal(fatGoal);
        setGender(gender);
        setHeight(height);
        setWeight(weight);
      } catch (error) {
        console.error(<Text>Error fetching goal data: {error}</Text>);
      }
    };

    fetchGoalData();
  }, []);

  const saveGoalData = async () => {
    try {
      await api.post('/api/goal-data', {
        calorieGoal,
        carbGoal,
        proteinGoal,
        fatGoal,
        gender,
        height,
        weight,
      });
      console.log(<Text>Goal data saved successfully</Text>);
      navigation.goBack();
    } catch (error) {
      console.error(<Text>Error saving goal data: {error}</Text>);
    }
  };

  return showMenu ? (
    <MenuScreen navigation={navigation} closeMenu={toggleMenu} />
  ) : (
    <SafeAreaView style={[styles.container, { paddingTop: StatusBar.currentHeight }]}>
      <Header navigation={navigation} toggleMenu={toggleMenu} title={<Text>목표 섭취량 설정</Text>} />

      <View style={styles.goalContainer}>
        <Text style={styles.sectionTitle}>영양소</Text>
        <GoalInput
          label={<Text>열량</Text>}
          value={calorieGoal}
          onChangeText={setCalorieGoal}
          unit={<Text>Kcal</Text>}
        />
        <GoalInput
          label={<Text>탄수화물</Text>}
          value={carbGoal}
          onChangeText={setCarbGoal}
          unit={<Text>g</Text>}
        />
        <GoalInput
          label={<Text>단백질</Text>}
          value={proteinGoal}
          onChangeText={setProteinGoal}
          unit={<Text>g</Text>}
        />
        <GoalInput
          label={<Text>지방</Text>}
          value={fatGoal}
          onChangeText={setFatGoal}
          unit={<Text>g</Text>}
        />
      </View>

      <View style={styles.separator} />

      <View style={styles.goalContainer}>
        <Text style={styles.sectionTitle}>개인 정보</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>성별</Text>
          <View style={styles.genderContainer}>

            <TouchableOpacity
              style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
              onPress={() => setGender('male')}
            >
              <Text style={[styles.genderButtonText, gender === 'male' && styles.genderButtonTextActive]}><Text>남</Text></Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
              onPress={() => setGender('female')}
            >
              <Text style={[styles.genderButtonText, gender === 'female' && styles.genderButtonTextActive]}><Text>여</Text></Text>
            </TouchableOpacity>
          </View>
        </View>

        <GoalInput
          label={<Text>키</Text>}
          value={height}
          onChangeText={setHeight}
          unit={<Text>cm</Text>}
        />
        <GoalInput
          label={<Text>몸무게</Text>}
          value={weight}
          onChangeText={setWeight}
          unit={<Text>kg</Text>}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveGoalData}>
        <Text style={styles.saveButtonText}>저장</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default GoalSettingScreen;