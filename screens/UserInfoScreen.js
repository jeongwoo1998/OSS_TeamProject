import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Modal, ScrollView } from 'react-native';

// 디바이스 창의 너비를 가져옴
const { width } = Dimensions.get('window');

// SecondPage 컴포넌트를 정의
export default function UserInfoScreen({ navigation }) {
  // 성별, 몸무게, 키, 몸무게 모달 가시성, 키 모달 가시성 관련 상태변수 셋팅.
  const [genderVal, setGenderVal] = useState('');
  const [weight, setWeight] = useState('60 kg'); // 몸무게 버튼의 기본 값 셋팅
  const [height, setHeight] = useState('176 cm'); // 키 버튼의 기본 값 세팅
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [heightModalVisible, setHeightModalVisible] = useState(false);

  // 체중 선택 데이터를 50 ~ 120 범위에서 1 단위로 생성
  const weightData = [];
  for (let i = 50; i <= 120; i++) {
    weightData.push({ key: i, label: `${i} kg` });
  }

  // 키 선택 데이터를 130 ~ 200 범위에서 1 단위로 생성
  const heightData = [];
  for (let i = 130; i <= 200; i++) {
    heightData.push({ key: i, label: `${i} cm` });
  }

  // 체중 선택 모달에서 선택한 값을 처리하는 함수
  const handleWeightSelect = (selectedWeight) => {
    setWeight(`${selectedWeight} kg`);
    setWeightModalVisible(false);
  };

  // 키 선택 모달에서 선택한 값을 처리하는 함수
  const handleHeightSelect = (selectedHeight) => {
    setHeight(`${selectedHeight} cm`);
    setHeightModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* 앱 로고 이미지 표시 */}
      <Image source={require('../assets/dummy.png')} style={styles.image} resizeMode="contain" />
      
      {/* 성별 선택 */}
      <View style={styles.row}>
        <Text style={styles.label}>성별</Text>
        {/* 성별을 남성으로 선택했을 경우 */}
        <TouchableOpacity 
          style={[styles.genderButton, genderVal === 'male' && styles.selectedButton]}
          onPress={() => setGenderVal('male')}
        >
          <Text style={[styles.buttonText, genderVal === 'male' && styles.selectedButtonText]}>남</Text>
        </TouchableOpacity>
        {/* 성별을 여성으로 선택했을 경우 */}
        <TouchableOpacity 
          style={[styles.genderButton, genderVal === 'female' && styles.selectedButton]}
          onPress={() => setGenderVal('female')}
        >
          <Text style={[styles.buttonText, genderVal === 'female' && styles.selectedButtonText]}>여</Text>
        </TouchableOpacity>
      </View>

      {/* 키 선택 -> 키 버튼을 누르면 키 설정 모달창이 나타남 */}
      <View style={styles.row}>
        <Text style={styles.label}>키</Text>
        <TouchableOpacity style={styles.infoButton} onPress={() => setHeightModalVisible(true)}>
          <Text style={styles.buttonText}>{height}</Text>
        </TouchableOpacity>
      </View>

      {/* 체중 선택 -> 체중 버튼을 누르면 몸무게 설정 모달창이 나타남 */}
      <View style={styles.row}>
        <Text style={styles.label}>체중</Text>
        <TouchableOpacity style={styles.infoButton} onPress={() => setWeightModalVisible(true)}>
          <Text style={styles.buttonText}>{weight}</Text>
        </TouchableOpacity>
      </View>

      {/* 시작하기 버튼을 누르면 navigate에서 설정해 둔 페이지로 넘어감 */}
      <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.nextButtonText}>시작하기</Text>
      </TouchableOpacity>

      {/* 체중 선택 모달 설정 */}
      <Modal
        transparent={true}
        visible={weightModalVisible}
        // 모달이 닫힐 때 호출 
        onRequestClose={() => setWeightModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              {weightData.map((item) => (
                // 모달의 각 항목에 고유 key 설정 -> 사용자가 항목을 누르면 handleWeightSelect
                <TouchableOpacity key={item.key} style={styles.modalItem} onPress={() => handleWeightSelect(item.key)}>
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 키 선택 모달 설정 */}
      <Modal
        transparent={true}
        visible={heightModalVisible}
        onRequestClose={() => setHeightModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              {heightData.map((item) => (
                // 모달의 각 항목에 고유 key 설정 -> 사용자가 항목을 누르면 handleHeightSelect
                <TouchableOpacity key={item.key} style={styles.modalItem} onPress={() => handleHeightSelect(item.key)}>
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  genderButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: 'lightgreen',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
  infoButton: {
    flex: 2,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#04B431',
  },
  nextButton: {
    position: 'absolute',
    bottom: 100,
    width: width * 0.8,
    left: width * 0.1,
    paddingVertical: 10,
    backgroundColor: '#32CD32',
    borderRadius: 5,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    maxHeight: '50%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalItem: {
    paddingVertical: 10,
  },
  modalItemText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
