import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

const windowWidth = Dimensions.get('window').width;

export default function Slider() {
  const [sliderList, setSliderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();

  useEffect(() => {
    GetSliderList();
  }, []);

  const GetSliderList = async () => {
    try {
      const q = query(collection(db, 'Slider'));
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => list.push(doc.data()));
      setSliderList(list);
    } catch (error) {
      console.error('Error fetching slider data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto scroll every 5 seconds (optional)
  useEffect(() => {
    if (sliderList.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % sliderList.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, sliderList]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  if (loading) {
    return (
      <View style={[styles.container, styles.loaderContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (sliderList.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>#Special for you</Text>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          No promotional content available.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>#Special for you</Text>

      <FlatList
        ref={flatListRef}
        data={sliderList}
        horizontal
        pagingEnabled
        snapToInterval={windowWidth * 0.9 + 15} // image width + marginRight
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewConfigRef.current}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
            accessible={true}
            accessibilityLabel="Promotional image"
          />
        )}
      />

      <View style={styles.pagination}>
        {sliderList.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginBottom: 15,
  },
  loaderContainer: {
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginBottom: 10,
    fontFamily: 'outfit-regular',
  },
  image: {
    width: windowWidth * 0.9,
    height: 300,
    marginRight: 15,
    borderRadius: 15,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007AFF',
    width: 16,
  },
});
