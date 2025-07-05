import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Home/Header';
import Slider from '../../components/Home/Slider';
import PetListByCategory from '../../components/Home/PetListByCategory';

import HowItWorksSection from '../../components/Home/HowItWorksSection';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('none');
  const [scale] = useState(new Animated.Value(1));

  const handleAddNewPet = () => {
    Alert.alert('Add New Pet', 'This is where you would navigate to add a new pet!');
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
      {/* <FeaturedPetBanner /> */} {/* Remove or comment out this line */}
      <Header greeting={greeting} />
      <Slider />
      <PetListByCategory
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
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
