import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import MenuScreen from '../components/MenuScreen';
import GoalInput from '../components/GoalInput';
import { AppStyles as styles } from '../styles/AppStyles';

const GoalSettingScreen = ({ navigation }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [calorieGoal, setCalorieGoal] = useState('');
  const [carbGoal, setCarbGoal] = useState('');
  const [proteinGoal, setProteinGoal] = useState('');
  const [fatGoal, setFatGoal] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [jwtToken, setJwtToken] = useState('');

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('jwt_access_token');
      setJwtToken(token);
    };
    getToken();
  }, []);

  useEffect(() => {
    const fetchIntakeGoal = async () => {
      if (!jwtToken) return;

      try {
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };

        const intakeGoalResponse = await axios.get('http://10.0.2.2:5000/GetIntakeGoal', { headers });
        const { calories, carbs, protein, fat } = intakeGoalResponse.data;

        setCalorieGoal(calories.toString());
        setCarbGoal(carbs.toString());
        setProteinGoal(protein.toString());
        setFatGoal(fat.toString());
      } catch (error) {
        // console.error(`Error fetching intake goal data: ${error}`);
      }
    };

    fetchIntakeGoal();
  }, [jwtToken]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!jwtToken) return;

      try {
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };

        const userInfoResponse = await axios.get('http://10.0.2.2:5000/GetUserInfo', { headers });
        const { user_sex, user_height, user_weight } = userInfoResponse.data;

        setGender(user_sex);
        setHeight(user_height.toString());
        setWeight(user_weight.toString()); 
      } catch (error) {
        // console.error(`Error fetching user info data: ${error}`);
      }
    };

    fetchUserInfo();
  }, [jwtToken]);

  const saveGoalData = async () => {
    if (!jwtToken) return;

    try {
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };

      await axios.post('http://10.0.2.2:5000/SetIntakeGoal', {
        intake_goal: {
          calories: parseInt(calorieGoal),
          carbs: parseInt(carbGoal),
          protein: parseInt(proteinGoal),
          fat: parseInt(fatGoal),
        },
      }, { headers });

      await axios.post('http://10.0.2.2:5000/SetUserInfo', {
        user_info: {
          user_sex: gender,
          user_height: parseInt(height),
          user_weight: parseInt(weight),
        },
      }, { headers });

      console.log('Goal data saved successfully');
      navigation.goBack();
    } catch (error) {
      console.error(`Error saving goal data: ${error}`);
    }
  };

  return showMenu ? (
    <MenuScreen navigation={navigation} closeMenu={toggleMenu} />
  ) : (
    <SafeAreaView style={[styles.container, { paddingTop: StatusBar.currentHeight }]}>
      <Header navigation={navigation} toggleMenu={toggleMenu} title="목표 섭취량 설정" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.goalContainer}>
          <Text style={styles.sectionTitle}>영양소</Text>
          <GoalInput
            label="열량"
            value={calorieGoal}
            onChangeText={setCalorieGoal}
            unit="Kcal"
          />
          <GoalInput
            label="탄수화물"
            value={carbGoal}
            onChangeText={setCarbGoal}
            unit="g"
          />
          <GoalInput
            label="단백질"
            value={proteinGoal}
            onChangeText={setProteinGoal}
            unit="g"
          />
          <GoalInput
            label="지방"
            value={fatGoal}
            onChangeText={setFatGoal}
            unit="g"
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
                <Text style={[styles.genderButtonText, gender === 'male' && styles.genderButtonTextActive]}>남</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
                onPress={() => setGender('female')}
              >
                <Text style={[styles.genderButtonText, gender === 'female' && styles.genderButtonTextActive]}>여</Text>
              </TouchableOpacity>
            </View>
          </View>

          <GoalInput
            label="키"
            value={height}
            onChangeText={setHeight}
            unit="cm"
          />
          <GoalInput
            label="몸무게"
            value={weight}
            onChangeText={setWeight}
            unit="kg"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveGoalData}>
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GoalSettingScreen;
