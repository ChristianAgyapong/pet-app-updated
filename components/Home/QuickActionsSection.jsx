import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function QuickActionsSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <MaterialCommunityIcons name="dog-service" size={28} color="#007AFF" />
          <Text style={styles.actionText}>Find a Vet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <MaterialCommunityIcons name="food-drumstick" size={28} color="#007AFF" />
          <Text style={styles.actionText}>Pet Food</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <MaterialCommunityIcons name="account-group" size={28} color="#007AFF" />
          <Text style={styles.actionText}>Community</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
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
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    marginTop: 6,
    fontSize: 13,
    color: '#333',
    fontWeight: '500'
  }
});