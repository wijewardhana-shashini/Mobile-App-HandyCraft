import React from "react";
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import products from "../../../assets/data/products";
import { Product } from "../../types";
import ProductListItem from "@/src/components/ProductListItem";

export const defaultCategoryImage = 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=740';


export default function MenuScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.sellButton}>
        <Text style={styles.sellButtonText}>Sell My Items</Text>
      </TouchableOpacity>
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
  itemContainer: {
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
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
