import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable } from "react-native";
import Colors from "../src/Colors";
import { Candle } from "../src/types";
import { useNavigation } from '@react-navigation/native';
import { Link } from "expo-router";

export const defaultCategoryImage = 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=740';

type ProductListCandleProps = {
  candle: Candle;
};

function ProductListCandle({ candle }: ProductListCandleProps) {
  const navigation = useNavigation();

  return (
    <Link href={`/${candle.id}`} asChild>
      <Pressable style={styles.itemContainer}>
        <Image 
          source={{ uri: candle.image || defaultCategoryImage}} 
          style={styles.image} 
        />
        <Text style={styles.title}>{candle.name}</Text>
        <Text style={styles.price}>Price: ${candle.price}</Text>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 5,
    maxWidth: '50%',
  },
  image: {
    width: "100%",
    aspectRatio: 1, // Maintain aspect ratio
    resizeMode: "cover",
    marginBottom: 10,
    borderRadius: 10, // Optional: Add border radius for a rounded appearance
  },
  title: {
    fontSize: 15, // Decreased font size
    fontWeight: "700",
    textAlign: "left", // Left-aligned text
    marginBottom: 5,
    color: Colors.primary, // Change font color here
  },
  price: {
    fontSize: 12, // Decreased font size
    fontWeight: "700",
    textAlign: "left", // Left-aligned text
    marginBottom: 5,
    color: Colors.secondary, // Change font color here
  },
  addToCartButton: {
    backgroundColor: '#c39797', // Assuming primary color is defined
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addToCartButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ProductListCandle;
