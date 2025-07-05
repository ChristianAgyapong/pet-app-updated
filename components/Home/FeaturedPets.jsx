import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function FeaturedPets() {
  const featuredPets = [
    {
      id: 'f1',
      name: 'Luna',
      type: 'Persian Cat',
      age: '1 year',
      distance: '2.5 km',
      image: 'https://placekitten.com/400/400',
      price: '$350'
    },
    // Add more featured pets...
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Featured Pets</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {featuredPets.map(pet => (
          <TouchableOpacity 
            key={pet.id}
            style={styles.petCard}
            activeOpacity={0.8}
          >
            <Image source={{ uri: pet.image }} style={styles.petImage} />
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petType}>{pet.type}</Text>
              <View style={styles.details}>
                <MaterialCommunityIcons name="clock-outline" size={14} color="#666" />
                <Text style={styles.detailText}>{pet.age}</Text>
                <MaterialCommunityIcons name="map-marker" size={14} color="#666" />
                <Text style={styles.detailText}>{pet.distance}</Text>
              </View>
              <Text style={styles.price}>{pet.price}</Text>
              <TouchableOpacity
                style={styles.detailsBtn}
                onPress={() => Alert.alert('Pet Details', `Details for ${pet.name}`)}
              >
                <Text style={styles.detailsBtnText}>See Details</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  seeAll: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  petCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginRight: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  petImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  petInfo: {
    padding: 12,
  },
  petName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  petType: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
    marginTop: 8,
  },
  detailsBtn: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  detailsBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});