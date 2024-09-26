import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../header";
import CustomAlert from "../Components/CustomMessage/customMessage";

const { width } = Dimensions.get("window");

export default function MainPage() {
  const navigation = useNavigation();

  const handleLogout = () => {
    CustomAlert("Warning", "Are you sure you want to log out?", async () => {
      // Ensure you have imported the auth module
      auth
        .signOut()
        .then(() => {
          navigation.navigate("SigninScreen");
        })
        .catch((error) => {
          showAlert("Error", "Failed to log out. Please try again.");
          console.error("Error logging out: ", error);
        });
    });
  };

  return (
    <View style={styles.container}>
      <Header handleLogout={handleLogout} />

      <Text style={styles.title}>Seller Dashboard</Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => navigation.navigate("AddItemsModal")}
        >
          <Ionicons name="add-outline" size={24} color="#ff6600" />
          <Text style={styles.gridItemText}>Add Item</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => navigation.navigate("ViewItems")}
        >
          <Ionicons name="eye-outline" size={24} color="#ff6600" />
          <Text style={styles.gridItemText}>Your Items</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#000000",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  gridItem: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    width: (width - 60) / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  gridItemText: {
    color: "#000",
    fontSize: 16,
    marginTop: 10,
  },
});
