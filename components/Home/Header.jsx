import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Header() {
    const { user } = useUser();

    return (
        <View>
            <View style={{
                flexDirection: 'row',   
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 15,
            }}> 
                <View>  
                    <Text style={{
                        fontFamily: 'outfit-black',
                        fontSize: 30,
                    }}>Welcome</Text>
                    <Text style={{
                        fontFamily: 'outfit-light',
                        fontSize: 19,
                    }}>{user?.fullName}</Text>
                </View>

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
    );
}