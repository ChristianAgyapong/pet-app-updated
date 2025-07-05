import { View, Text, SafeAreaView, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import Colors from '../../constants/Colors';
import { useState, useEffect } from 'react';

export default function FavoritesScreen() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Here you would normally fetch favorites from your backend
        // For now, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFavorites([]);
      } catch (err) {
        setError('Failed to load favorites');
        console.error('Error loading favorites:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

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
        {/* Favorites list will go here when implemented */}
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
  }
});