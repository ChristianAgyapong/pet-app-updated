import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HowItWorksSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>How Adoption Works</Text>
      <View style={styles.step}>
        <MaterialCommunityIcons name="magnify" size={22} color="#007AFF" />
        <Text style={styles.stepText}>Browse pets by category</Text>
      </View>
      <View style={styles.step}>
        <MaterialCommunityIcons name="account-check-outline" size={22} color="#007AFF" />
        <Text style={styles.stepText}>Contact the shelter</Text>
      </View>
      <View style={styles.step}>
        <MaterialCommunityIcons name="home-heart" size={22} color="#007AFF" />
        <Text style={styles.stepText}>Bring your new friend home!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    backgroundColor: '#F0F6FF',
    borderRadius: 12,
    padding: 16,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 10,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
});