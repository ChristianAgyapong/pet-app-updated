import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Link, Redirect } from 'expo-router'
import { useUser } from '@clerk/clerk-expo';

export default function index() {

  const { user } = useUser();

  return (
    <View style={{ flex: 1,
       justifyContent: 'center',
        alignItems: 'center' }}>

{user ? <Redirect href="/(tabs)/home" /> : <Redirect href="/login" />}
    </View>
  )
}