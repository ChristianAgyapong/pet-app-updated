import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Home/Header';
import Slider from '../../components/Home/Slider';
import PetListByCategory from '../../components/Home/PetListByCategory';


export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('none');

  const handleAddNewPet = () => {
    Alert.alert('Add New Pet', 'This is where you would navigate to add a new pet!');
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      <Header />
      <Slider />

      {/* Pet list includes category selection inside it */}
      <PetListByCategory
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <TouchableOpacity style={styles.addNewPetBtn} onPress={handleAddNewPet}>
        <Icon name="dog" size={20} color="#FFD700" style={{ marginRight: 8 }} />
        <Text style={styles.addNewPetText}>Add New Pet</Text>
      </TouchableOpacity>
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
  },
  addNewPetText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
