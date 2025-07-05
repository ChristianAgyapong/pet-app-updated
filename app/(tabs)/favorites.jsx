import { View, Text, SafeAreaView, StyleSheet, ScrollView, ActivityIndicator, ToastAndroid, Platform, Alert, Image } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import Colors from '../../constants/Colors';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function FavoritesScreen() {
  const { user } = useAuth();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [lastAddedPet, setLastAddedPet] = useState(null);
  const [isAdding, setIsAdding] = useState(false); // <-- Add this

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Load favorites from AsyncStorage
        const data = await AsyncStorage.getItem('favorites');
        setFavorites(data ? JSON.parse(data) : []);
      } catch (err) {
        setError('Failed to load favorites');
        console.error('Error loading favorites:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user, isFocused]);

  const handleAddNewPet = async () => {
    if (!selectedPet) {
      Alert.alert('No Pet Selected', 'Please select a pet to add to favorites.');
      return;
    }
    if (favorites.some(pet => pet.id === selectedPet.id)) {
      Alert.alert('Already Added', 'This pet is already in your favorites.');
      return;
    }
    if (favorites.length >= 10) {
      Alert.alert('Limit Reached', 'You can only have up to 10 favorites.');
      return;
    }
    setIsAdding(true); // Start loading
    // Simulate async add (e.g., saving to AsyncStorage or backend)
    setTimeout(() => {
      setFavorites(prev => [...prev, selectedPet]);
      setLastAddedPet(selectedPet);
      setIsAdding(false); // Stop loading
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravityAndOffset(
          `${selectedPet.name} added to favorites! (Undo)`,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          0, 100
        );
      }
      // For iOS, use a custom Snackbar/Toast library
    }, 1000); // Simulate 1s loading
  };

  // Add undo logic (e.g., a button in your UI or a custom Snackbar)
  const handleUndo = () => {
    if (lastAddedPet) {
      setFavorites(prev => prev.filter(pet => pet.id !== lastAddedPet.id));
      setLastAddedPet(null);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (!favorites.length) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No favorites yet</Text>
        </View>
      );
    }

    return (
      <View style={styles.content}>
        {favorites.map(pet => (
          <View key={pet.id} style={styles.petCard}>
            <Image
              source={{ uri: pet.imageUrl }}
              style={styles.petImage}
              resizeMode="cover"
            />
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petBreed}>{pet.breed}</Text>
              <Text style={styles.petPrice}>{pet.price}</Text>
              <Text style={styles.petCategory}>{pet.category}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>Your Favorites</Text>
          <Text style={styles.subtitle}>
            Pets you've marked as favorites will appear here
          </Text>
        </View>
        {isAdding && (
          <View style={styles.addingOverlay}>
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
            <Text style={{ marginTop: 10, color: Colors.PRIMARY }}>Adding to favorites...</Text>
          </View>
        )}
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.WHITE,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.BLACK,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.GRAY,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.GRAY,
    textAlign: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.ERROR || 'red',
    textAlign: 'center',
  },
  addingOverlay: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingVertical: 30,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    elevation: 2,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    width: '100%',
  },
  petImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#eee',
    marginRight: 16,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.BLACK,
  },
  petBreed: {
    color: Colors.GRAY,
    fontSize: 14,
    marginTop: 2,
  },
  petPrice: {
    color: Colors.PRIMARY,
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 4,
  },
  petCategory: {
    color: Colors.GRAY,
    fontSize: 13,
    marginTop: 2,
  },
});