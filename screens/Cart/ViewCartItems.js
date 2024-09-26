import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { Card, Button } from "react-native-paper";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  doc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import CustomAlert from "../Components/CustomMessage/customMessage";
import Header from "../header";

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Initialize navigation hook

  useEffect(() => {
    const unsubscribe = fetchCartItems();
    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const fetchCartItems = () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const cartUserRef = doc(db, "CartUser", user.uid);
    const itemsCollectionRef = collection(cartUserRef, "items");

    // Create a query to filter items with status "pending"
    const q = query(itemsCollectionRef, where("status", "==", "pending"));

    // Listen for real-time updates
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (querySnapshot.empty) {
          console.log("No pending items found in cart");
          setCartItems([]);
        } else {
          const fetchedItems = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCartItems(fetchedItems);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching cart items:", error);
        setLoading(false);
      }
    );

    return unsubscribe; // Return the unsubscribe function
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      const cartUserRef = doc(db, "CartUser", user.uid);
      const itemRef = doc(cartUserRef, "items", itemId);

      await deleteDoc(itemRef);
      Alert.alert("Item removed", "The item has been removed from your cart.");
    } catch (error) {
      console.error("Error removing item:", error);
      Alert.alert("Error", "Failed to remove item from cart.");
    }
  };

  const confirmRemoveItem = (itemId) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => handleRemoveItem(itemId) },
      ]
    );
  };

  const handlePay = (
    itemId,
    totalPrice,
    sellerId,
    itemUri,
    Quentity,
    UnitPrice
  ) => {
    CustomAlert("Warning", "Are you sure you want to pay for this item?", () =>
      navigation.navigate("paymentdetails", {
        itemId,
        totalPrice,
        SellerId: sellerId,
        ItemUri: itemUri,
        Quentity,
        UnitPrice,
      })
    );
  };

  const handleLogout = () => {
    CustomAlert("Warning", "Are you sure you want to log out?", async () => {
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
      <Text style={styles.cartText}>Your Picking</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : cartItems.length === 0 ? (
        <Text>No items in cart</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          {cartItems.map((item) => {
            const totalPrice = item.UnitPrice * item.quantity;
            return (
              <Card key={item.id} style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item.ImageUri }}
                      style={styles.image}
                    />
                  </View>
                  <View style={styles.detailsContainer}>
                    <Text style={styles.itemName}>{item.itemName}</Text>
                    <Text>Quantity: {item.quantity}</Text>
                    <Text>Unit Price: Rs.{item.UnitPrice}</Text>
                    <Text>Total Price: Rs.{totalPrice}</Text>
                    <Text>Status: {item.status}</Text>
                  </View>
                </Card.Content>
                <Card.Actions style={styles.cardActions}>
                  <Button
                    mode="contained"
                    style={styles.removeButton}
                    onPress={() => confirmRemoveItem(item.id)}
                  >
                    Remove
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() =>
                      handlePay(
                        item.id,
                        totalPrice,
                        item.Sellerid,
                        item.ImageUri,
                        item.quantity,
                        item.UnitPrice
                      )
                    } // Pass itemId, totalPrice, SellerId, and ImageUri here
                    style={styles.payButton}
                  >
                    Pay
                  </Button>
                </Card.Actions>
              </Card>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
    paddingHorizontal :5
  },
  cartText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#000000",
    alignItems: "flex-start",
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  detailsContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  removeButton: {
    backgroundColor: "red",
  },
  payButton: {
    backgroundColor: "green",
  },
});

export default CartScreen;
