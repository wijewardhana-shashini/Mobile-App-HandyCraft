import React from "react";
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, FlatList, Dimensions } from "react-native";
import Colors from "../../constants/Colors";
import candles from "../../../assets/data/candles";
import { Product } from "../../types";
import ProductListCandle from "@/src/components/ProductListCandle";

export const defaultCategoryImage = 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=740';

export default function CandleScreen() {
  return (
    <FlatList 
      data={candles}
      renderItem={({item})=> <ProductListCandle candle={item}/>}
      numColumns={2}
      contentContainerStyle={styles.container}
      columnWrapperStyle={{gap:10}}
    />
  );
}

const windowWidth = Dimensions.get('window').width;

export const calculateImageHeight = (imageWidth: number, aspectRatio: number) => {
  return (imageWidth / aspectRatio);
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eee0ca",
    paddingVertical: 20,
  },
  itemContainer: {
    width: (windowWidth - 40) / 2, // Subtracting paddings and margins
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  image: {
    width: "100%",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "left",
    marginBottom: 5,
  },
  price: {
    color: "#ca7f68",
    fontWeight: "bold",
    textAlign: "left",
  },
  sellButton: {
    backgroundColor: '#ca7f68',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    width: 150,
    marginBottom: 10,
  },
  sellButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
