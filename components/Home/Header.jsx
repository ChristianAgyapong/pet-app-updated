import { View, Text, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Header({ greeting }) {
  const { user } = useUser();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
      }}>
        <View>
          <Text style={{
            fontFamily: 'outfit-black',
            fontSize: 24,
            color: '#007AFF'
          }}>{greeting}</Text>
          <Text style={{
            fontFamily: 'outfit-light',
            fontSize: 19,
          }}>{user?.fullName}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ marginRight: 16 }}>
            <MaterialCommunityIcons name="bell-outline" size={26} color="#007AFF" />
            <View style={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#FF5252',
              borderWidth: 1,
              borderColor: '#fff',
            }} />
          </TouchableOpacity>
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: user?.imageUrl }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 99,
              }}
            />
            <View style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: '#4CAF50',
              borderWidth: 2,
              borderColor: '#fff',
            }} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}