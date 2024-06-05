import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Text, RadioButton } from 'react-native-paper';
import Header from '../components/Header';
import MenuScreen from '../components/MenuScreen';
import GoalInput from '../components/GoalInput';
import { AppStyles as styles } from '../styles/AppStyles';
import api from '../utils/api';

const GoalSettingScreen = ({ navigation }) => {
  const [showMenu, setShowMenu] = useState(false);  // 메뉴 화면의 표시 여부, 기본 값은 안 보이는 것
  const [calorieGoal, setCalorieGoal] = useState(''); // 목표 칼로리 섭취량, 기본 값은 null
  const [carbGoal, setCarbGoal] = useState(''); // 목표 탄수화물 섭취량, 기본 값은 null
  const [proteinGoal, setProteinGoal] = useState(''); // 목표 단백질 섭취량, 기본 값은 null
  const [fatGoal, setFatGoal] = useState(''); // 목표 지방 섭취량, 기본 값은 null
  const [gender, setGender] = useState(''); // 사용자의 성별 정보, 기본 값은 null
  const [height, setHeight] = useState(''); // 사용자의 키 정보, 기본 값은 null
  const [weight, setWeight] = useState(''); // 사용자의 몸무게 정보, 기본 값은 null
  const [mealImages, setMealImages] = useState({}); // 각 식사의 이미지 URL을 관리, 기본 값은 빈 객체

  const toggleMenu = () => {  // showMenu 상태를 반전시켜 메뉴 화면을 열거나 닫음
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
      console.error(<Text>Error picking or uploading image: {error}</Text>);
    }
  };

  useEffect(() => {
    // 서버로부터 사용자의 목표 섭취량 가져오기
    const fetchGoalData = async () => {
      try {
        // race는 아래 두 가지 작업을 동시에 진행하고, 먼저 완료되는 작업의 결과를 처리하기 위해 사용된 메서드
        // response는 가장 먼저 완료된 Promise 결과가 response 변수에 할당됨. 즉, 서버로부터 받은 총 섭취량 데이터거나 타임아웃 오류가 발생한 경우의 에러 객체임
        const response = await Promise.race([
          api.get('/api/goal-data'),
          // 요청 이후 5초 뒤에 reject 함수를 호출하여 타임아웃 오류를 발생시킴
          new Promise((_, reject) => setTimeout(() => reject(new Error(<Text>Timeout</Text>)), 5000)),
        ]);
        
        // 받아온 데이터는 response.data 객체에 담겨 있으며 이 객체에서 각각의 속성을 해체하여 목표 섭취량 데이터를 추출함
        const { calorieGoal, carbGoal, proteinGoal, fatGoal, gender, height, weight } = response.data;
        // 서버에서 받은 데이터를 사용하여 각 영양소와 개인 정보 변경 함수 호출 및 상태 업데이트
        setCalorieGoal(calorieGoal);
        setCarbGoal(carbGoal);
        setProteinGoal(proteinGoal);
        setFatGoal(fatGoal);
        setGender(gender);
        setHeight(height);
        setWeight(weight);
      } catch (error) {
        // 서버 요청 실패 혹은 타임아웃 오류 발생 시 에러 메시지 출력
        console.error(<Text>Error fetching goal data: {error}</Text>);
      }
    };

    fetchGoalData();
  }, []);

  // 서버에 사용자가 설정한 목표 섭취량 데이터 저장하기
  const saveGoalData = async () => {
    try {
      // 서버에 post 요청을 보내 사용자가 입력한 데이터를 전송
      await api.post('/api/goal-data', {
        calorieGoal,
        carbGoal,
        proteinGoal,
        fatGoal,
        gender,
        height,
        weight,
      });
      // 전송 성공 시 현재 화면을 닫고 이전 화면으로 이동
      console.log(<Text>Goal data saved successfully</Text>);
      navigation.goBack();
    } catch (error) {
      // 전송 실패 시 에러 메시지 출력
      console.error(<Text>Error saving goal data: {error}</Text>);
    }
  };

  return showMenu ? (
    // {/* showMenu가 True라면 메뉴 화면 띄우기 */}
    <MenuScreen navigation={navigation} closeMenu={toggleMenu} />
  ) : (
    // {/* Header 컴포넌트, 현재 기기의 상태 표시줄의 높이만큼 상단에 패딩을 추가 */}
    <SafeAreaView style={[styles.container, { paddingTop: StatusBar.currentHeight }]}>
      <Header navigation={navigation} toggleMenu={toggleMenu} title={<Text>목표 섭취량 설정</Text>} />

      {/* 영양소 입력 칸 모음 */}
      <View style={styles.goalContainer}>
        <Text style={styles.sectionTitle}>영양소</Text>
        {/* 열량 입력, value : 기존에 사용자가 입력한 목표 열량, onChangeText 함수를 통해 사용자가 값을 입력하면 목표 열량 변경 */}
        <GoalInput
          label={<Text>열량</Text>}
          value={calorieGoal}
          onChangeText={setCalorieGoal}
          unit={<Text>Kcal</Text>}
        />
        {/* 탄수화물 입력 */}  
        <GoalInput
          label={<Text>탄수화물</Text>}
          value={carbGoal}
          onChangeText={setCarbGoal}
          unit={<Text>g</Text>}
        />
        {/* 단백질 입력 */} 
        <GoalInput
          label={<Text>단백질</Text>}
          value={proteinGoal}
          onChangeText={setProteinGoal}
          unit={<Text>g</Text>}
        />
        {/* 지방 입력 */}  
        <GoalInput
          label={<Text>지방</Text>}
          value={fatGoal}
          onChangeText={setFatGoal}
          unit={<Text>g</Text>}
        />
      </View>

      {/* 영양소와 개인 정보 구분 선 */} 
      <View style={styles.separator} />

      {/* 개인정보 입력 칸 모음 */}
      <View style={styles.goalContainer}>
        <Text style={styles.sectionTitle}>개인 정보</Text>
        {/* 성별 레이블 */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>성별</Text> 
          <View style={styles.genderContainer}>

            <TouchableOpacity        // 남자 버튼, 선택된 gender 상태가 male일 경우 Active 스타일 적용
              style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
              onPress={() => setGender('male')} // 누르면 gender 상태를 male로 변경
            >
              {/* '남' 레이블, 선택된 gender 상태가 male일 경우 Active 스타일 적용 */}
              <Text style={[styles.genderButtonText, gender === 'male' && styles.genderButtonTextActive]}><Text>남</Text></Text>
            </TouchableOpacity>

            <TouchableOpacity       // 여자 버튼, 선택된 gender 상태가 female일 경우 Active 스타일 적용   
              style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
              onPress={() => setGender('female')}  // 누르면 gender 상태를 female로 변경
            >
              {/* '여' 레이블, 선택된 gender 상태가 female일 경우 Active 스타일 적용 */}
              <Text style={[styles.genderButtonText, gender === 'female' && styles.genderButtonTextActive]}><Text>여</Text></Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 키 입력 */} 
        <GoalInput
          label={<Text>키</Text>}
          value={height}
          onChangeText={setHeight}
          unit={<Text>cm</Text>}
        />
        {/* 몸무게 입력 */} 
        <GoalInput
          label={<Text>몸무게</Text>}
          value={weight}
          onChangeText={setWeight}
          unit={<Text>kg</Text>}
        />
      </View>

      {/* 저장 버튼, 누르면 서버에 사용자가 설정한 목표 섭취량 데이터를 저장하는 saveGoalData 함수 호출 */}  
      <TouchableOpacity style={styles.saveButton} onPress={saveGoalData}>
        <Text style={styles.saveButtonText}>저장</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default GoalSettingScreen;