import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Modal, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const { width } = Dimensions.get('window');

export default function UserInfoScreen({ navigation, route }) {
  const { token } = route.params;
  const [genderVal, setGenderVal] = useState('');
  const [weight, setWeight] = useState('60 kg');
  const [height, setHeight] = useState('176 cm');
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [heightModalVisible, setHeightModalVisible] = useState(false);

  const weightData = [];
  for (let i = 50; i <= 120; i++) {
    weightData.push({ key: i, label: `${i} kg` });
  }

  const heightData = [];
  for (let i = 130; i <= 200; i++) {
    heightData.push({ key: i, label: `${i} cm` });
  }

  const handleWeightSelect = (selectedWeight) => {
    setWeight(`${selectedWeight} kg`);
    setWeightModalVisible(false);
  };

  const handleHeightSelect = (selectedHeight) => {
    setHeight(`${selectedHeight} cm`);
    setHeightModalVisible(false);
  };

  useEffect(() => {
    if (token) {
      auth()
        .signInWithCustomToken(token)
        .then(() => {
          console.log('Firebase sign-in successful!');
        })
        .catch(error => {
          console.error('Firebase sign-in error:', error);
        });
    }
  }, [token]);

  const handleSubmit = () => {
    const user = auth().currentUser;
    if (user) {
      firestore()
        .collection('users')
        .doc(user.uid)
        .set({
          gender: genderVal,
          weight: weight,
          height: height,
        })
        .then(() => {
          console.log('User information saved successfully!');
          navigation.navigate('Home');
        })
        .catch(error => {
          console.error('Error saving user information:', error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/dummy.png')} style={styles.image} resizeMode="contain" />
      <View style={styles.row}>
        <Text style={styles.label}>성별</Text>
        <TouchableOpacity 
          style={[styles.genderButton, genderVal === 'male' && styles.selectedButton]}
          onPress={() => setGenderVal('male')}
        >
          <Text style={[styles.buttonText, genderVal === 'male' && styles.selectedButtonText]}>남</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.genderButton, genderVal === 'female' && styles.selectedButton]}
          onPress={() => setGenderVal('female')}
        >
          <Text style={[styles.buttonText, genderVal === 'female' && styles.selectedButtonText]}>여</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>키</Text>
        <TouchableOpacity style={styles.infoButton} onPress={() => setHeightModalVisible(true)}>
          <Text style={styles.buttonText}>{height}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>체중</Text>
        <TouchableOpacity style={styles.infoButton} onPress={() => setWeightModalVisible(true)}>
          <Text style={styles.buttonText}>{weight}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
        <Text style={styles.nextButtonText}>시작하기</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={weightModalVisible}
        onRequestClose={() => setWeightModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              {weightData.map((item) => (
                <TouchableOpacity key={item.key} style={styles.modalItem} onPress={() => handleWeightSelect(item.key)}>
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={heightModalVisible}
        onRequestClose={() => setHeightModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              {heightData.map((item) => (
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