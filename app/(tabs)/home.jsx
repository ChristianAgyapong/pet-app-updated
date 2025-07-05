import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Home/Header';
import Slider from '../../components/Home/Slider';
import PetListByCategory from '../../components/Home/PetListByCategory';
import HowItWorksSection from '../../components/Home/HowItWorksSection';
import TestimonialsSection from '../../components/Home/TestimonialsSection';
import QuickActionsSection from '../../components/Home/QuickActionsSection';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('none');
  const [selectedPet, setSelectedPet] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [scale] = useState(new Animated.Value(1));

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem('favorites').then(data => {
      if (data) setFavorites(JSON.parse(data));
    });
  }, []);

  // Save favorites to AsyncStorage when changed
  useEffect(() => {
    AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleAddNewPet = () => {
    if (!selectedPet) {
      Alert.alert('No Pet Selected', 'Please select a pet to add to favorites.');
      return;
    }
    if (favorites.some(pet => pet.id === selectedPet.id)) {
      Alert.alert('Already Added', 'This pet is already in your favorites.');
      return;
    }
    setFavorites(prev => [...prev, selectedPet]);
    Alert.alert('Added to Favorites', `${selectedPet.name} has been added to your favorites!`);
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
    handleAddNewPet();
  };

  // Greeting based on time
  const hour = new Date().getHours();
  let greeting = 'Welcome';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';
  else greeting = 'Good evening';

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, paddingBottom: 30, backgroundColor: '#F8FAFC' }}
      showsVerticalScrollIndicator={false}
    >
      <Header greeting={greeting} />
      <Slider />
      <PetListByCategory
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPet={selectedPet}
        setSelectedPet={setSelectedPet}
      />
      <Animated.View style={{ transform: [{ scale }], marginTop: 10 }}>
        <TouchableOpacity
          style={styles.addNewPetBtn}
          onPress={animateButton}
          activeOpacity={0.85}
        >
          <Icon name="dog" size={20} color="#FFD700" style={{ marginRight: 8 }} />
          <Text style={styles.addNewPetText}>Add New Pet</Text>
        </TouchableOpacity>
      </Animated.View>
      <HowItWorksSection />
      <TestimonialsSection />
      <QuickActionsSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addNewPetBtn: {
    marginTop: 20,
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  addNewPetText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
