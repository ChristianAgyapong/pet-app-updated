import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const testimonials = [
  {
    name: 'Sarah',
    text: 'Adopting Luna was the best decision ever! The process was smooth and the team was so helpful.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    name: 'James',
    text: 'Our family loves our new cat, Oliver. Thank you for making adoption easy and safe!',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  }
];

export default function TestimonialsSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>What Adopters Say</Text>
      {testimonials.map((t, idx) => (
        <View key={idx} style={styles.card}>
          <Image source={{ uri: t.avatar }} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{t.name}</Text>
            <Text style={styles.text}>{t.text}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    marginTop: 2,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    color: '#333'
  },
  text: {
    fontSize: 13,
    color: '#555'
  }
});