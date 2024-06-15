import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import Header from '../components/Header';
import { AppStyles as styles } from '../styles/AppStyles';
import MapView, { Marker, Circle } from 'react-native-maps';
import MenuScreen from '../components/MenuScreen';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RestaurantRecommendationScreen = ({ navigation }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [recommendedFoods, setRecommendedFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.5666791,
    longitude: 126.9782914,
    latitudeDelta: 0.0222,
    longitudeDelta: 0.0121,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState(null);

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
    const fetchUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('접근 권한이 필요합니다.');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setUserLocation({ latitude, longitude });

        setMapRegion(prevRegion => ({
          ...prevRegion,
          latitude,
          longitude,
        }));
      } catch (error) {
        console.error('Error fetching user location:', error);
      }
    };

    fetchUserLocation();
  }, []);

  useEffect(() => {
    const fetchFoodRecommendations = async () => {
      if (!jwtToken) return;
      try {
        const date = new Date().toISOString().split('T')[0];
        const response = await axios.get(`http://10.0.2.2:5000/GetDateData/${date}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const foodRecommendations = response.data.food_recommendations || [];
        setRecommendedFoods(foodRecommendations);
      } catch (error) {
        // console.error('Error fetching food recommendations:', error);
      }
    };

    fetchFoodRecommendations();
  }, [jwtToken]);

  const searchKeyword = async (keyword, latitude, longitude, radius) => {
    const url = `http://10.0.2.2:5000/searchKeyword?keyword=${keyword}&latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
  
    try {
      const response = await fetch(url);
  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error(`Error ${response.status}: ${response.statusText}`);
        return null;
      }
    } catch (error) {
      console.error('Error searching keyword:', error);
      return null;
    }
  };

  const handleFoodSelect = async (food) => {
    if (!jwtToken || !userLocation) return;
    try {
      setLoading(true);
      setSelectedFood(food);

      const results = await searchKeyword(food, userLocation.latitude, userLocation.longitude, 1000);

      if (results) {
        setSearchResults(results);
      } else {
        console.error('No search results found');
      }
    } catch (error) {
      console.error('Error searching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  return showMenu ? (
    <MenuScreen navigation={navigation} closeMenu={toggleMenu} />
  ) : (
    <SafeAreaView style={[styles.container, { paddingTop: StatusBar.currentHeight }]}>
      <Header navigation={navigation} toggleMenu={toggleMenu} title="식당 추천" />
      <View style={styles.foodButtonContainer}>
        {recommendedFoods.map((foodObj) => {
          const food = foodObj.food;
          return (
            <TouchableOpacity
              key={food}
              style={[
                styles.foodButton,
                selectedFood === food && styles.selectedFoodButton,
              ]}
              onPress={() => handleFoodSelect(food)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.foodButtonText,
                  selectedFood === food && styles.selectedFoodButtonText,
                ]}
              >
                {food}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" style={styles.loading} />
      ) : (
        <MapView style={styles.mapContainer} region={mapRegion}>
          {userLocation && (
            <Circle
              center={userLocation}
              radius={30}
              strokeColor="rgba(255,0,0,1)"
              fillColor="rgba(255,0,0,1)"
            />
          )}
          {searchResults.map((result) => (
            <Marker
              key={result.id}
              coordinate={{
                latitude: parseFloat(result.y),
                longitude: parseFloat(result.x),
              }}
              title={result.place_name}
              description={result.address_name}
            />
          ))}
        </MapView>
      )}
    </SafeAreaView>
  );
};

export default RestaurantRecommendationScreen;
