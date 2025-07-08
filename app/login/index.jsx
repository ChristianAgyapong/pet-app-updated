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
  StyleSheet,
  StatusBar,
  Alert
} from 'react-native'
import React, { useCallback, useEffect, useState, useRef } from "react";
import Colors from '../../constants/Colors'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import { useSSO, useAuth } from '@clerk/clerk-expo'
import * as AuthSession from 'expo-auth-session'
import { useRouter } from 'expo-router'
import { Modal } from 'react-native';

const { width, height } = Dimensions.get('window')

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
    maxWidth: 480,
    height: Platform.select({ web: 420, default: 320 }),
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
    width: Platform.select({ web: 300, default: 220 }),
    height: Platform.select({ web: 300, default: 220 }),
    borderRadius: Platform.select({ web: 150, default: 110 }),
    marginBottom: 0,
  },
  floatingBox: {
    position: 'absolute',
    width: Platform.select({ web: 60, default: 45 }),
    height: Platform.select({ web: 60, default: 45 }),
    backgroundColor: Colors.WHITE,
    borderRadius: Platform.select({ web: 16, default: 12 }),
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
  ctaButton: {
    backgroundColor: Colors.PRIMARY,
    padding: Platform.select({ web: 20, default: 16 }),
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20
  },
  ctaButtonText: {
    color: Colors.WHITE,
    fontSize: Platform.select({ web: 18, default: 16 }),
    fontFamily: 'outfit-bold'
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    minWidth: 200,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.BLACK,
    fontFamily: 'outfit-bold',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF4444'
  },
  errorText: {
    color: '#CC0000',
    fontSize: 14,
    fontFamily: 'outfit-regular',
  },
  retryButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center'
  },
  retryButtonText: {
    color: Colors.WHITE,
    fontSize: 14,
    fontFamily: 'outfit-bold'
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  }
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

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const box1Anim = useRef(new Animated.Value(0)).current;
  const box2Anim = useRef(new Animated.Value(0)).current;
  const box3Anim = useRef(new Animated.Value(0)).current;
  const box4Anim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Set status bar style
  useEffect(() => {
    if (Platform.OS !== 'web') {
      StatusBar.setBarStyle('dark-content', true);
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.PRIMARY_LIGHT, true);
      }
    }
  }, []);

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
        try {
          await signOut();
        } catch (error) {
          console.log('Error signing out:', error);
        }
      }
    };
    
    clearSessions();
    
    return () => {
      if (Platform.OS !== 'web') {
        WebBrowser.coolDownAsync().catch(console.error);
      }
    };
  }, [signOut]);

  // Enhanced authentication with better error handling
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
        router.push('/(tabs)/home');
      }
    } catch (err) {
      console.error('Auth error:', err);
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (err.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.message?.includes('cancelled')) {
        errorMessage = 'Sign-in was cancelled. Please try again.';
      } else if (err.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [startSSOFlow, signOut, router]);

  // Enhanced animations
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
    ]).start();

    // Pulse animation for main image
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Enhanced floating box animations
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
            Animated.timing(box4Anim, {
              toValue: 1,
              duration: 2200,
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
            Animated.timing(box4Anim, {
              toValue: 0,
              duration: 2200,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    animateBoxes();
  }, []);

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

  const handleRetry = () => {
    setError(null);
    onPress();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={Colors.PRIMARY_LIGHT} 
        translucent={false}
      />
      
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Hero Section */}
        <View style={styles.heroContainer}>
          <View style={styles.gradientOverlay} />
          
          <Animated.View style={[styles.imageContainer, {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: pulseAnim }
            ]
          }]}>
            <Image
              source={require('../../assets/images/pet1.jpg')}
              style={styles.heroImage}
            />

            {/* Enhanced floating boxes with better positioning */}
            <Animated.View style={[
              styles.floatingBox,
              {
                top: Platform.select({ web: -30, default: -20 }),
                left: Platform.select({ web: -30, default: -20 }),
                transform: [
                  {
                    translateY: box1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 15]
                    })
                  },
                  {
                    rotate: box1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '5deg']
                    })
                  }
                ]
              }
            ]}>
              <MaterialCommunityIcons 
                name="dog" 
                size={Platform.select({ web: 35, default: 25 })} 
                color={Colors.PRIMARY} 
              />
            </Animated.View>

            <Animated.View style={[
              styles.floatingBox,
              {
                top: Platform.select({ web: -20, default: -10 }),
                right: Platform.select({ web: -30, default: -20 }),
                transform: [
                  {
                    translateY: box2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 10]
                    })
                  },
                  {
                    rotate: box2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '-5deg']
                    })
                  }
                ]
              }
            ]}>
              <MaterialCommunityIcons 
                name="cat" 
                size={Platform.select({ web: 35, default: 25 })} 
                color={Colors.PRIMARY} 
              />
            </Animated.View>

            <Animated.View style={[
              styles.floatingBox,
              {
                bottom: Platform.select({ web: -30, default: -20 }),
                right: Platform.select({ web: 20, default: 10 }),
                transform: [
                  {
                    translateY: box3Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -10]
                    })
                  },
                  {
                    rotate: box3Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '3deg']
                    })
                  }
                ]
              }
            ]}>
              <MaterialCommunityIcons 
                name="paw" 
                size={Platform.select({ web: 35, default: 25 })} 
                color={Colors.PRIMARY} 
              />
            </Animated.View>

            <Animated.View style={[
              styles.floatingBox,
              {
                bottom: Platform.select({ web: -20, default: -15 }),
                left: Platform.select({ web: 20, default: 10 }),
                transform: [
                  {
                    translateY: box4Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 12]
                    })
                  },
                  {
                    rotate: box4Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '-3deg']
                    })
                  }
                ]
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

          <Animated.Text style={[styles.subtitle, { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }]}>
            Connect with loving companions waiting for their forever homes
          </Animated.Text>

          {/* Enhanced Feature Cards */}
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
                transform: [{ 
                  translateX: slideAnim.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0, 100]
                  })
                }]
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
                  marginBottom: 4,
                  color: Colors.BLACK
                }}>
                  {feature.title}
                </Text>
                <Text style={{ 
                  fontFamily: 'outfit-regular',
                  fontSize: 14,
                  color: Colors.GRAY,
                  lineHeight: 20
                }}>
                  {feature.desc}
                </Text>
              </View>
            </Animated.View>
          ))}

          {/* Error Display */}
          {error && (
            <Animated.View 
              style={[styles.errorContainer, { opacity: fadeAnim }]}
            >
              <Text style={styles.errorText}>{error}</Text>
              <Pressable style={styles.retryButton} onPress={handleRetry}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </Pressable>
            </Animated.View>
          )}

          {/* Enhanced CTA Button */}
          <Animated.View style={{
            transform: [{ scale: buttonScale }],
            marginTop: 20
          }}>
            <Pressable
              onPress={onPress}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.ctaButton,
                {
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }]
                }
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.WHITE} size="small" />
              ) : (
                <>
                  <Ionicons 
                    name="logo-google" 
                    size={24} 
                    color={Colors.WHITE} 
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.ctaButtonText}>
                    Continue with Google
                  </Text>
                </>
              )}
            </Pressable>
          </Animated.View>

          {/* Additional info */}
          <Animated.Text style={[{
            textAlign: 'center',
            marginTop: 20,
            fontSize: 12,
            color: Colors.GRAY,
            fontFamily: 'outfit-regular',
            opacity: fadeAnim
          }]}>
            By continuing Christian Agyapong, you agree to our Terms of Service and Privacy Policy
          </Animated.Text>
        </View>
      </ScrollView>

      {/* Enhanced Loading Overlay */}
      {isLoading && (
        <Animated.View 
          style={[styles.loadingOverlay, { opacity: fadeAnim }]}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
            <Text style={styles.loadingText}>Signing you in...</Text>
            <Text style={[styles.loadingText, { 
              fontSize: 14, 
              color: Colors.GRAY,
              fontFamily: 'outfit-regular'
            }]}>
              Please wait a moment
            </Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}