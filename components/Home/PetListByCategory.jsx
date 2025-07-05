import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Category from './Category';



const pets = [
  // Dogs with real breed images
  { 
    id: '1', 
    name: 'Bella', 
    category: 'Dogs', 
    price: '$200', 
    breed: 'Labrador', 
    imageUrl: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=400&h=400&fit=crop' 
  },
  { 
    id: '2', 
    name: 'Max', 
    category: 'Dogs', 
    price: '$150', 
    breed: 'Beagle',
    imageUrl: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&h=400&fit=crop'
  },
  { 
    id: '3', 
    name: 'Luna', 
    category: 'Dogs', 
    price: '$300', 
    breed: 'German Shepherd',
    imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop'
  },
  { 
    id: '4', 
    name: 'Rocky', 
    category: 'Dogs', 
    price: '$250', 
    breed: 'Husky',
    imageUrl: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=400&fit=crop'
  },
  { 
    id: '5', 
    name: 'Charlie', 
    category: 'Dogs', 
    price: '$180', 
    breed: 'Golden Retriever',
    imageUrl: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=400&fit=crop'
  },
  
  // Cats with breed-specific images
  { 
    id: '6', 
    name: 'Whiskers', 
    category: 'Cats', 
    price: '$100', 
    breed: 'Siamese',
    imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop'
  },
  { 
    id: '7', 
    name: 'Oliver', 
    category: 'Cats', 
    price: '$120', 
    breed: 'Persian',
    imageUrl: 'https://images.unsplash.com/photo-1616750819459-6eae89c3b5bb?w=400&h=400&fit=crop'
  },
  { 
    id: '8', 
    name: 'Milo', 
    category: 'Cats', 
    price: '$90', 
    breed: 'Maine Coon',
    imageUrl: 'https://images.unsplash.com/photo-1607242792481-37f27e1d74e1?w=400&h=400&fit=crop'
  },
  { 
    id: '9', 
    name: 'Lucy', 
    category: 'Cats', 
    price: '$150', 
    breed: 'British Shorthair',
    imageUrl: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&h=400&fit=crop'
  },
  { 
    id: '10', 
    name: 'Leo', 
    category: 'Cats', 
    price: '$110', 
    breed: 'Russian Blue',
    imageUrl: 'https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?w=400&h=400&fit=crop'
  },

  // Birds with high-quality aviary images
  { 
    id: '11', 
    name: 'Tweety', 
    category: 'Birds', 
    price: '$50', 
    breed: 'Canary',
    imageUrl: 'https://images.unsplash.com/photo-1591198936750-16d8e15edb9e?w=400&h=400&fit=crop'
  },
  { 
    id: '12', 
    name: 'Rio', 
    category: 'Birds', 
    price: '$75', 
    breed: 'Macaw',
    imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=400&fit=crop'
  },
  { 
    id: '13', 
    name: 'Polly', 
    category: 'Birds', 
    price: '$60', 
    breed: 'Cockatiel',
    imageUrl: 'https://images.unsplash.com/photo-1591198936750-16d8e15edb9e?w=400&h=400&fit=crop'
  },
  { 
    id: '14', 
    name: 'Sky', 
    category: 'Birds', 
    price: '$45', 
    breed: 'Budgie',
    imageUrl: 'https://images.unsplash.com/photo-1595705403780-c383d0999869?w=400&h=400&fit=crop'
  },
  { 
    id: '15', 
    name: 'Echo', 
    category: 'Birds', 
    price: '$80', 
    breed: 'African Grey',
    imageUrl: 'https://images.unsplash.com/photo-1544923408-75c5cef46f14?w=400&h=400&fit=crop'
  },

  // Fish with aquarium-quality images
  { 
    id: '16', 
    name: 'Nemo', 
    category: 'Fish', 
    price: '$25', 
    breed: 'Clownfish',
    imageUrl: 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?w=400&h=400&fit=crop'
  },
  { 
    id: '17', 
    name: 'Bubbles', 
    category: 'Fish', 
    price: '$30', 
    breed: 'Guppy',
    imageUrl: 'https://images.unsplash.com/photo-1520302659201-7ecf4c432d52?w=400&h=400&fit=crop'
  },
  { 
    id: '18', 
    name: 'Flash', 
    category: 'Fish', 
    price: '$40', 
    breed: 'Betta',
    imageUrl: 'https://images.unsplash.com/photo-1545048984-24c7c2045260?w=400&h=400&fit=crop'
  },
  { 
    id: '19', 
    name: 'Goldie', 
    category: 'Fish', 
    price: '$20', 
    breed: 'Goldfish',
    imageUrl: 'https://images.unsplash.com/photo-1583106617217-52ed2fed2876?w=400&h=400&fit=crop'
  },
  { 
    id: '20', 
    name: 'Angel', 
    category: 'Fish', 
    price: '$35', 
    breed: 'Angelfish',
    imageUrl: 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=400&h=400&fit=crop'
  },
];

export default function PetListByCategory({
  selectedCategory,
  setSelectedCategory,
  selectedPet,
  setSelectedPet
}) {
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [lastTap, setLastTap] = useState(null);
  const DOUBLE_TAP_DELAY = 300; // milliseconds

  useEffect(() => {
    // Reset pet selection when category changes
    setSelectedPetId(null);

    if (!selectedCategory || selectedCategory === 'none') {
      setFilteredPets([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      const result = pets.filter(pet => pet.category === selectedCategory);
      setFilteredPets(result);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const handlePetPress = (petId) => {
    const now = Date.now();
    if (lastTap && (now - lastTap) < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (selectedPetId === petId) {
        setSelectedPetId(null); // Deselect on double tap
      }
    } else {
      // Single tap
      setSelectedPetId(petId);
    }
    setLastTap(now);
  };

  const handleCategoryPress = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory('none'); // Reset category on double selection
      setSelectedPetId(null); // Clear selected pet
      setFilteredPets([]); // Clear filtered pets
    } else {
      setSelectedCategory(category);
    }
  };

  const renderPetCard = ({ item }) => {
    const isSelected = selectedPet && selectedPet.id === item.id;
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.petCard,
          isSelected && { borderColor: '#007AFF', borderWidth: 2 }
        ]}
        onPress={() => setSelectedPet(item)}
      >
        <ImageBackground
          source={{ uri: item.imageUrl }}
          style={styles.petImage}
          imageStyle={{ borderRadius: 15 }}
          accessible={true}
          accessibilityLabel={`${item.name}, ${item.breed}, costs ${item.price}`}
        >
          <View style={styles.textOverlay}>
            <Text style={styles.petName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.petBreed} numberOfLines={1}>{item.breed}</Text>
            <Text style={styles.petPrice}>{item.price}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Category
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryPress}
      />

      {!selectedCategory || selectedCategory === 'none' ? (
        <Text style={styles.emptyText}>Please select a category.</Text>
      ) : loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : filteredPets.length === 0 ? (
        <Text style={styles.emptyText}>No pets found in this category.</Text>
      ) : (
        <FlatList
          data={filteredPets}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={renderPetCard}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  petCard: {
    width: 180,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#f3f3f3',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedPetCard: {
    borderWidth: 3,
    borderColor: '#007AFF',
    backgroundColor: '#e6f0ff',
  },
  petImage: {
    width: '100%',
    height: 180,
    justifyContent: 'flex-end',
  },
  textOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 6,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  petName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },
  petBreed: {
    color: '#fff',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  petPrice: {
    color: '#ffd700',
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
  },
});















