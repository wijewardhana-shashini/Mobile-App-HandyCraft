import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,  
} from "react-native";
import { Card, Button ,Divider} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import {
  collection,
  doc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { auth, db } from "../../firebaseConfig";
import CustomAlert from "../Components/CustomMessage/customMessage";
import Header from "../header";

const OrdersScreen = () => {
  const route = useRoute();
  const { isSeller, userUid } = route.params || {};
  const screenWidth = Dimensions.get("window").width;

  const [receivedOrders, setReceivedOrders] = useState([]);
  const [placedOrders, setPlacedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const [orderStatus, setOrderStatus] = useState({});
  const [contactDetails, setContactDetails] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserDetails(userUid);
    fetchOrders();
    const unsubscribe = fetchOrders();
    return () => unsubscribe();
  }, [isSeller, userUid]);

  useEffect(() => {
    const updateContactDetails = async () => {
      const details = {};
      const orders = isSeller ? receivedOrders : placedOrders;

      for (const order of orders) {
        const customerDetails = await getUserDetails(order.CustomeruserId);//from database 
        const sellerDetails = await getUserDetails(order.SellerUserId);//from order database
        details[order.id] = {
          customer: customerDetails,
          seller: sellerDetails,
        };
      }
      setContactDetails(details);
      console.log(details);
    };

    if (!loading) {
      updateContactDetails();
    }
  }, [receivedOrders, placedOrders, loading, isSeller]);

  const fetchOrders = () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const ordersCollectionRef = collection(db, "Orders");
    let customerQuery = query(
      ordersCollectionRef,
      where("CustomeruserId", "==", userUid)
    );
    let sellerQuery = isSeller
      ? query(ordersCollectionRef, where("SellerUserId", "==", userUid))
      : null;

    const unsubscribeCustomerOrders = onSnapshot(
      customerQuery,
      (querySnapshot) => {
        if (querySnapshot.empty) {
          console.log("No customer orders found");
          setPlacedOrders([]);
        } else {
          const fetchedOrders = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("Fetched customer orders:", fetchedOrders); // Debugging line
          setPlacedOrders(fetchedOrders);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching customer orders:", error);
        setLoading(false);
      }
    );

    const unsubscribeSellerOrders = isSeller
      ? onSnapshot(
          sellerQuery,
          (querySnapshot) => {
            if (querySnapshot.empty) {
              console.log("No received orders found");
              setReceivedOrders([]);
            } else {
              const fetchedOrders = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              console.log("Fetched seller orders:", fetchedOrders); // Debugging line
              setReceivedOrders(fetchedOrders);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching received orders:", error);
            setLoading(false);
          }
        )
      : () => {};

    return () => {
      unsubscribeCustomerOrders();
      if (unsubscribeSellerOrders) {
        unsubscribeSellerOrders();
      }
    };
  };

  const fetchUserDetails = async (userUid) => {
    try {
      const UserDetailsCollectionRef = collection(db, "userDetails");
      const fetchUserDetailsQuery = query(
        UserDetailsCollectionRef,
        where("uid", "==", userUid)
      );
      const querySnapshot = await getDocs(fetchUserDetailsQuery);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        console.log("Fetched user details:", userData); // Debugging line
        setUserDetails(userData);
      } else {
        console.log("No user details found");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const getUserDetails = async (uid) => {
    try {
      const UserDetailsCollectionRef = collection(db, "userDetails");
      const fetchUserDetailsQuery = query(
        UserDetailsCollectionRef,
        where("uid", "==", uid)
      );
      const querySnapshot = await getDocs(fetchUserDetailsQuery);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        console.log(`Fetched contact details for UID ${uid}:`, userData); // Debugging line
        return userData || {};
      } else {
        return {};
      }
    } catch (error) {
      console.error("Error fetching contact details:", error);
      return {};
    }
  };

  const handleRemoveOrder = async (orderId) => {
    try {
      const orderRef = doc(db, "Orders", orderId);
      await deleteDoc(orderRef);
      CustomAlert("Order removed", "The order has been removed.");
    } catch (error) {
      console.error("Error removing order:", error);
      Alert.alert("Error", "Failed to remove order.");
    }
  };

  const confirmRemoveOrder = (orderId) => {
    CustomAlert("Remove Order", "Are you sure you want to remove this order?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => handleRemoveOrder(orderId),
      },
    ]);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "Orders", orderId);
      await updateDoc(orderRef, { ItemStatus: newStatus });
      setOrderStatus((prevStatus) => ({
        ...prevStatus,
        [orderId]: newStatus,
      }));
      CustomAlert("Success","Status updated successfully")
    } catch (error) {
      CustomAlert("Error","updating order status unsuccessful.")
      console.error("Error updating order status:", error);
    }
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
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <ScrollView style={styles.scrollview}>
          {isSeller && receivedOrders.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Received Orders</Text>
              {receivedOrders.map((order) => (
                <Card key={order.id} style={styles.card}>
                  <Card.Content style={styles.cardContent}>
                    <View style={styles.imageContainer(screenWidth)}>
                      <Image
                        source={{ uri: order.ItemUri }}
                        style={styles.image}
                      />
                    </View>
                    <View style={styles.detailsContainer}>
                      <Text style={styles.itemName}>{order.trackingId}</Text>
                      <Text style={styles.text}>
                        Quantity: {order.ItemQuentity}
                      </Text>
                      <Text style={styles.text}>
                        Unit Price: Rs.{order.ItemUnitPrice}
                      </Text>
                      <Text style={styles.text}>
                        Total Price: Rs.{order.total}
                      </Text>
                      <Text style={styles.text}>
                        Status: {order.ItemStatus}
                      </Text>
                      <Text style={styles.text}>
                        Customer Contact:{" "}
                        {contactDetails[order.id]?.customer?.telno || "N/A"}
                      </Text>
                    </View>
                  </Card.Content>
                  <Card.Actions style={styles.cardActions}>
                    <Button
                      mode="contained"
                      style={styles.removeButton}
                      onPress={() => confirmRemoveOrder(order.id)}
                    >
                      <Icon name="trash-can" size={20} color="#fff" /> Remove
                    </Button>
                    <Picker
                      selectedValue={orderStatus[order.id] || order.ItemStatus}
                      style={styles.picker}
                      onValueChange={(itemValue) =>
                        handleStatusChange(order.id, itemValue)
                      }
                    >
                      <Picker.Item label="Approved" value="Approved" />
                      <Picker.Item label="Delivered" value="Delivered" />
                      <Picker.Item label="Received" value="Received" />
                    </Picker>
                  </Card.Actions>
                </Card>
              ))}
            </>
          )}
          {placedOrders.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Placed Orders</Text>
              {placedOrders.map((order) => (
                <Card key={order.id} style={styles.card}>
                  <Card.Content style={styles.cardContent}>
                    <View style={styles.imageContainer(screenWidth)}>
                      <Image
                        source={{ uri: order.ItemUri }}
                        style={styles.image}
                      />
                    </View>
                    <View style={styles.detailsContainer}>
                      <Text style={styles.itemName}>{order.trackingId}</Text>
                      <Text style={styles.text}>
                        Quantity: {order.ItemQuentity}
                      </Text>
                      <Text style={styles.text}>
                        Unit Price: Rs.{order.ItemUnitPrice}
                      </Text>
                      <Text style={styles.text}>
                        Total Price: Rs.{order.total}
                      </Text>
                      <Text style={styles.text}>
                        Status: {order.ItemStatus}
                      </Text>
                      <Text style={styles.text}>
                        Seller Contact:{" "}
                        {contactDetails[order.id]?.seller?.telno || "N/A"}
                      </Text>
                    </View>
                  </Card.Content>
                  <Card.Actions style={styles.cardActions}>
                    <Button
                      mode="contained"
                      style={styles.removeButton}
                      onPress={() => confirmRemoveOrder(order.id)}
                    >
                      <Icon name="trash-can" size={20} color="#fff" /> Remove
                    </Button>
                    <Picker
                      selectedValue={orderStatus[order.id] || order.ItemStatus}
                      style={styles.picker}
                      onValueChange={(itemValue) =>
                        handleStatusChange(order.id, itemValue)
                      }
                    >
                      <Picker.Item label="Received" value="Received" />
                    </Picker>
                  </Card.Actions>
                </Card>
              ))}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#f0f4f8",
  },
  scrollview: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'left',
  },
  card: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
  },
  imageContainer: (screenWidth) => ({
    width: screenWidth * 0.3,
    height: 100,
    marginRight: 10,
  }),
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  detailsContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    marginBottom: 5,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
  },
  picker: {
    width: 150,
    height: 40,
  },
});

export default OrdersScreen;