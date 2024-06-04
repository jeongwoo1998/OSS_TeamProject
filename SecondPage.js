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

    </View>
  );
}