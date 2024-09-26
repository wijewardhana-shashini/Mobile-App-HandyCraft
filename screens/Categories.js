import React from "react";
import { StyleSheet, ScrollView, TouchableOpacity, Text } from "react-native";
import ProductListItem from "../src/ProductListItem";
import products from "../assets/data/products";
import { defaultCategoryImage } from "../src/Colors";

export default function MenuScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <TouchableOpacity style={styles.sellButton}>
        <Text style={styles.sellButtonText}>Sell My Items</Text>
      </TouchableOpacity> */}
      <Text style={styles.heading}>Categories</Text>
      {products.map((product) => (
        <ProductListItem key={product.id} product={product} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#eee0ca",
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sellButton: {
    backgroundColor: '#ca7f68',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: 150,
    marginTop: 20,
  },
  sellButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
