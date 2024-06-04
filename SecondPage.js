import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Modal, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

export default function SecondPage({ navigation }) {
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

  return (
      <View style={styles.container}>
        <Image source={require('./assets/dummy.png')} style={styles.image} resizeMode="contain" />
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

    </View>
  );
}