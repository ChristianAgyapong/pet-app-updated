import {
  View,
  Text,
  Image,
  Pressable,
  Platform,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet
} from 'react-native'
import React, { useCallback, useEffect, useState, useRef } from "react";
import Colors from '../../constants/Colors'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import { useSSO, useAuth } from '@clerk/clerk-expo'
import * as AuthSession from 'expo-auth-session'
import { useRouter } from 'expo-router'
import { Modal } from 'react-native';

const { width } = Dimensions.get('window')

// Complete any pending auth sessions
if (Platform.OS !== 'web') {
  WebBrowser.maybeCompleteAuthSession()
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  heroContainer: {
    width: '100%',
    maxWidth: 480, // Increased for web
    height: Platform.select({ web: 420, default: 320 }), // Increased for both
    backgroundColor: Colors.PRIMARY_LIGHT,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'visible',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginBottom: 30,
    marginTop: 0,
  },
  heroImageContainer: {
    position: 'relative',
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: Platform.select({ web: 300, default: 220 }), // Larger on web, still bigger on mobile
    height: Platform.select({ web: 300, default: 220 }),
    borderRadius: Platform.select({ web: 150, default: 110 }),
    marginBottom: 0,
  },
  floatingBox: {
    position: 'absolute',
    width: Platform.select({ web: 60, default: 45 }), // Reduced size
    height: Platform.select({ web: 60, default: 45 }), // Reduced size
    backgroundColor: Colors.WHITE,
    borderRadius: Platform.select({ web: 16, default: 12 }), // Adjusted border radius
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 2
  },
  headingLarge: {
    fontSize: Platform.select({ web: 32, default: 28 }),
    fontFamily: 'outfit-bold',
    color: Colors.BLACK,
    textAlign: 'center',
    marginVertical: 20
  },
  subtitle: {
    fontSize: Platform.select({ web: 18, default: 16 }),
    fontFamily: 'outfit-regular',
    color: Colors.GRAY,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.PRIMARY_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: Colors.BACKGROUND,
    borderRadius: 20,
    padding: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.BLACK,
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.GRAY,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 30,
  },
  ctaButton: {
    backgroundColor: Colors.PRIMARY, // Yellow background
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  ctaButtonText: {
    color: Colors.BLACK, // Black text for contrast
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.BLACK, // Changed from Colors.PRIMARY to Colors.BLACK
    fontFamily: 'Poppins-Bold',
  },
});

if (Platform.OS !== 'web') {
  void WebBrowser.warmUpAsync();
}

export default function LoginScreen() {
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const buttonScale = new Animated.Value(1);

  // Clear any existing sessions on component mount
  useEffect(() => {
    const clearSessions = async () => {
      if (Platform.OS !== 'web') {
        try {
          await WebBrowser.coolDownAsync();
          await signOut();
        } catch (error) {
          console.log('Error clearing sessions:', error);
        }
      } else {
        // On web, just try to sign out
        try {
          await signOut();
        } catch (error) {
          console.log('Error signing out:', error);
        }
      }
    };
    
    clearSessions();
    
    // Cleanup function - only run coolDownAsync on native
    return () => {
      if (Platform.OS !== 'web') {
        WebBrowser.coolDownAsync().catch(console.error);
      }
    };
  }, [signOut]);

  const onPress = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First ensure we're signed out
      try {
        await signOut();
        if (Platform.OS !== 'web') {
          await WebBrowser.coolDownAsync();
        }
      } catch (err) {
        console.log('Signout error:', err);
      }

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri({ 
          useProxy: Platform.OS !== 'web',
          scheme: 'pet-app',
          path: 'oauth-callback'
        })
      });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        // Direct navigation to home screen
        router.push('/(tabs)/home');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [startSSOFlow, signOut, router]);

  // New animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  // Add new animations for floating boxes
  const box1Anim = useRef(new Animated.Value(0)).current;
  const box2Anim = useRef(new Animated.Value(0)).current;
  const box3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start()
  }, [])

  useEffect(() => {
    const animateBoxes = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(box1Anim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(box2Anim, {
              toValue: 1,
              duration: 2500,
              useNativeDriver: true,
            }),
            Animated.timing(box3Anim, {
              toValue: 1,
              duration: 1800,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(box1Anim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(box2Anim, {
              toValue: 0,
              duration: 2500,
              useNativeDriver: true,
            }),
            Animated.timing(box3Anim, {
              toValue: 0,
              duration: 1800,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    animateBoxes();
  }, []);

  // Add these handlers to fix the error
  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Update the Pressable to use animation
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Animated.View style={[styles.imageContainer, {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }]}>
            <Image
              source={require('../../assets/images/pet1.jpg')}
              style={styles.heroImage}
            />

            {/* Top Left - Dog Icon */}
            <Animated.View style={[
              styles.floatingBox,
              {
                top: Platform.select({ web: -30, default: -20 }),
                left: Platform.select({ web: -30, default: -20 }),
                transform: [{
                  translateY: box1Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 15]
                  })
                }]
              }
            ]}>
              <MaterialCommunityIcons 
                name="dog" 
                size={Platform.select({ web: 35, default: 25 })} 
                color={Colors.PRIMARY} 
              />
            </Animated.View>

            {/* Top Right - Cat Icon */}
            <Animated.View style={[
              styles.floatingBox,
              {
                top: Platform.select({ web: -20, default: -10 }),
                right: Platform.select({ web: -30, default: -20 }),
                transform: [{
                  translateY: box2Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 10]
                  })
                }]
              }
            ]}>
              <MaterialCommunityIcons 
                name="cat" 
                size={Platform.select({ web: 35, default: 25 })} 
                color={Colors.PRIMARY} 
              />
            </Animated.View>

            {/* Bottom Right - Paw Icon */}
            <Animated.View style={[
              styles.floatingBox,
              {
                bottom: Platform.select({ web: -30, default: -20 }),
                right: Platform.select({ web: 20, default: 10 }),
                transform: [{
                  translateY: box3Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10]
                  })
                }]
              }
            ]}>
              <MaterialCommunityIcons 
                name="paw" 
                size={Platform.select({ web: 35, default: 25 })} 
                color={Colors.PRIMARY} 
              />
            </Animated.View>

            {/* Bottom Left - Heart Icon */}
            <Animated.View style={[
              styles.floatingBox,
              {
                bottom: Platform.select({ web: -20, default: -15 }),
                left: Platform.select({ web: 20, default: 10 }),
                transform: [{
                  translateY: box1Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 12]
                  })
                }]
              }
            ]}>
              <MaterialCommunityIcons 
                name="heart" 
                size={Platform.select({ web: 35, default: 25 })} 
                color={Colors.PRIMARY} 
              />
            </Animated.View>
          </Animated.View>
        </View>

        <View style={{ width: '100%', maxWidth: 420, paddingHorizontal: 20 }}>
          <Animated.Text style={[styles.headingLarge, { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }]}>
            Find Your Perfect Pet
          </Animated.Text>

          {/* Feature Cards */}
          {[
            {
              icon: 'paw',
              title: 'Wide Selection',
              desc: 'Browse through various pets waiting for a home'
            },
            {
              icon: 'heart-outline',
              title: 'Loving Homes',
              desc: 'All our pets go to carefully verified families'
            },
            {
              icon: 'shield-check',
              title: 'Verified Process',
              desc: 'Safe and secure adoption process'
            }
          ].map((feature, index) => (
            <Animated.View
              key={index}
              style={[styles.featureCard, {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }]
              }]}
            >
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons 
                  name={feature.icon} 
                  size={24} 
                  color={Colors.PRIMARY}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontFamily: 'outfit-bold',
                  fontSize: 16,
                  marginBottom: 4
                }}>
                  {feature.title}
                </Text>
                <Text style={{ 
                  fontFamily: 'outfit-regular',
                  fontSize: 14,
                  color: Colors.GRAY
                }}>
                  {feature.desc}
                </Text>
              </View>
            </Animated.View>
          ))}

          {/* CTA Button */}
          <Animated.View style={{
            transform: [{ scale: buttonScale }],
            marginTop: 20
          }}>
            <Pressable
              onPress={onPress}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              disabled={isLoading}
              style={({ pressed }) => ({
                backgroundColor: Colors.PRIMARY,
                padding: Platform.select({ web: 20, default: 16 }),
                borderRadius: 12,
                opacity: pressed ? 0.9 : 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: Colors.BLACK,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3
              })}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.WHITE} />
              ) : (
                <>
                  <Ionicons 
                    name="paw" 
                    size={24} 
                    color={Colors.WHITE} 
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{
                    color: Colors.WHITE,
                    fontSize: Platform.select({ web: 18, default: 16 }),
                    fontFamily: 'outfit-bold'
                  }}>
                    Start Adoption Journey
                  </Text>
                </>
              )}
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Improved Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={styles.loadingText}>Signing you in...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}














