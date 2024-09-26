import React from "react";
import { StyleSheet, Text, View, Image,Button } from "react-native";
import { defaultCategoryImage } from "./Colors";
import { Product } from "../assets/data/products";
import { CommonActions,Link } from '@react-navigation/native';
import { IconButton, MD3Colors } from 'react-native-paper';

const ProductListItem = ({ product,navigation }) => {
  return (
    <View style={styles.itemContainer}>
      
      <Image 
        source={{ uri: product.image || defaultCategoryImage}} 
        style={styles.image} 
      />
       <Text style={styles.title}>{product.name}</Text>
       <IconButton
          style={{justifyContent:'center'}}
          icon="camera"
          iconColor={MD3Colors.error50}
          size={20}
          //onPress={() => navigation.navigate('OrderItem')}
  />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  image: {
    width: "100%",
    aspectRatio: 1, // Maintain aspect ratio
    resizeMode: "cover",
    marginBottom: 10,
    borderRadius: 10, // Optional: Add border radius for a rounded appearance
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 5,
  },
});

export default ProductListItem;
