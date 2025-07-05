import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';

const categoryList = [
  { id: '1', name: 'Fish', imageUrl: 'https://cdn-icons-png.flaticon.com/128/874/874960.png' },
  { id: '2', name: 'Cats', imageUrl: 'https://cdn-icons-png.flaticon.com/128/1998/1998592.png' },
  { id: '3', name: 'Birds', imageUrl: 'https://cdn-icons-png.flaticon.com/128/3069/3069186.png' },
  { id: '4', name: 'Dogs', imageUrl: 'https://cdn-icons-png.flaticon.com/128/1998/1998627.png' },
];

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const CategoryItem = React.memo(({ item, isSelected, onPress }) => {
  const scale = useRef(new Animated.Value(isSelected ? 1.05 : 1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isSelected ? 1.1 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [isSelected, scale]);

  return (
    <AnimatedTouchable
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={`Select ${item.name} category`}
      accessible={true}
      style={{
        transform: [{ scale }],
        borderWidth: isSelected ? 2 : 0,
        borderColor: isSelected ? '#007AFF' : 'transparent',
        backgroundColor: isSelected ? '#E3F0FF' : '#fff',
        borderRadius: 16,
        marginHorizontal: 6,
        padding: 8,
      }}
    >
      <View style={{ alignItems: 'center' }}>
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        />
        <Text style={{
          fontWeight: isSelected ? 'bold' : 'normal',
          color: isSelected ? '#007AFF' : '#333',
          marginTop: 4,
        }}>
          {item.name}
        </Text>
      </View>
    </AnimatedTouchable>
  );
});

export default function Category({ selectedCategory, setSelectedCategory }) {
  // For future dynamic loading of categories, replace categoryList with state and fetch logic
  // const [categories, setCategories] = useState([]);
  // useEffect(() => { fetch categories here and setCategories })

  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = item.name === selectedCategory;
      return (
        <CategoryItem
          item={item}
          isSelected={isSelected}
          onPress={() => setSelectedCategory(item.name)}
        />
      );
    },
    [selectedCategory, setSelectedCategory]
  );

  return (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>Categories</Text>

      <FlatList
        data={categoryList}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={110} // card width + marginRight (100 + 10)
        decelerationRate="fast"
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    marginVertical: 10,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'outfit-regular',
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
    backgroundColor: '#f3f3f3',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  categoryName: {
    marginTop: 8,
    color: '#555',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
