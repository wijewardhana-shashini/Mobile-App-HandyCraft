import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

const CandleDetails = () => {
    const { id } = useLocalSearchParams();

    return (
        <View>
            <Text style={styles.text}>Product details for id: {id}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
  text: {
    color: 'white', // Change this to the color you desire
    fontSize: 16, // Optional: Adjust font size if needed
    fontWeight: 'bold', // Optional: Adjust font weight if needed
  },
});

export default CandleDetails;
