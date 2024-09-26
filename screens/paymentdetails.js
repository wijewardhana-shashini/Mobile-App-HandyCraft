import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, ScrollView, Alert } from "react-native";
import {
  TextInput,
  Button,
  Switch,
  Text,
  Dialog,
  Portal,
  RadioButton,
} from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig"; // Ensure correct path
import CustomAlert from "./Components/CustomMessage/customMessage";

export default function PaymentDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { itemId, totalPrice, Sellerid, ItemUri ,Quentity ,UnitPrice} = route.params; // Get itemId and totalPrice from route parameters

  const [text, setText] = useState(""); // To hold card number
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Visa"); // Default payment method
  const [sellerUserId, setSellerUserId] = useState(""); // State to hold seller's user ID

  useEffect(() => {
    const fetchItem = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user logged in");
        return;
      }

      const cartUserRef = doc(db, "CartUser", user.uid);
      const itemRef = doc(cartUserRef, "items", itemId);

      try {
        const docSnap = await getDoc(itemRef);
        if (docSnap.exists()) {
          const itemData = docSnap.data();
          setItem(itemData);

          // Fetch seller's user ID from items collection
          const itemCollectionRef = doc(db, "Items", itemData.ItemCode); // Assuming ItemCode is unique
          const itemDoc = await getDoc(itemCollectionRef);
          if (itemDoc.exists()) {
            const itemDetails = itemDoc.data();
            setSellerUserId(itemDetails.userId); // Update the sellerUserId state
          }
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };

    fetchItem();
  }, [itemId]);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const hideDialog = () => setVisible(false);
  const showDialog = () => setVisible(true);

  
  const handleConfirmPayment = async () => {
    const user = auth.currentUser;
  
    if (!user) {
      CustomAlert(
        "Error",
        "User Cant find.Please Login again",
      );
      return;
    }
  
    const cartUserRef = doc(db, "CartUser", user.uid);
    const itemRef = doc(cartUserRef, "items", itemId);
  
    // Generate a unique tracking ID
    const trackingId = `TRACK-${new Date().getTime()}`;
  
    try {
      // Update the item status
      await updateDoc(itemRef, {
        status: "paid",
        timestamp: new Date().toISOString(), // Current timestamp
      });
  
      // Check for valid item data
      if (!item || !item.ItemCode || !item.Sellerid) {
        CustomAlert(
          "Error",
          "Invalid item data!.Please Try again",
        );
        console.error("Invalid item data");
        return;
      }
  
      // Store order details in the Orders collection
      console.log("sellerid" + sellerUserId);
      const orderRef = doc(db, "Orders", trackingId);
      CustomAlert(
        "Warning",
        "Are you sure you want to Pay this item to cart?",
        async () =>
          await setDoc(orderRef, {
            trackingId: trackingId,
            itemCode: item.ItemCode,
            cartRef: cartUserRef.id,
            CustomeruserId: user.uid,
            SellerUserId: item.Sellerid, // Use the state variable here
            total: totalPrice,
            ItemUri: item.ImageUri || '', // Default value if undefined
            ItemStatus: "Processing",
            ItemQuentity :Quentity,
            ItemUnitPrice : UnitPrice,
            timestamp: new Date().toISOString(), // Current timestamp
          })
      );
  
      // Show success alert
      Alert.alert("Success", "Your payment has been successfully created.");
  
      navigation.goBack();
    } catch (error) {
      console.error("Error updating document:", error);
    }
  
    setVisible(false);
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.paymentMethodContainer}>
        <Image source={require("./assets/RB.jpeg")} style={styles.image} />
        <Text>Select Payment Method:</Text>
        <RadioButton.Group
          value={paymentMethod}
          onValueChange={(newMethod) => setPaymentMethod(newMethod)}
        >
          <View style={styles.radioButtonRow}>
            <View style={styles.radioButton}>
              <RadioButton value="Visa" />
              <Text>Visa</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="MasterCard" />
              <Text>MasterCard</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="PayPal" />
              <Text>PayPal</Text>
            </View>
          </View>
        </RadioButton.Group>
      </View>

      <TextInput
        mode="outlined"
        label="Card Number"
        placeholder="Card Number"
        style={styles.textInput}
        onChangeText={(text) => setText(text)}
        right={<TextInput.Affix text="/100" />}
      />

      <TextInput
        mode="outlined"
        label="Cardholder Name"
        placeholder="Cardholder Name"
        style={styles.textInput}
        right={<TextInput.Affix text="/100" />}
      />

      <TextInput
        mode="outlined"
        label="Valid Date"
        placeholder="MM/YY"
        style={styles.textInput}
        right={<TextInput.Affix text="/100" />}
      />

      <TextInput
        mode="outlined"
        label="CVV"
        placeholder="CVV"
        style={styles.textInput}
        right={<TextInput.Affix text="/100" />}
      />

      {item && (
        <View style={styles.itemCodeContainer}>
          <TextInput
            mode="outlined"
            label="Item Code"
            value={item.ItemCode}
            style={styles.textInput}
            editable={false}
          />
          <TextInput
            mode="outlined"
            label="Amount"
            value={totalPrice.toString()} // Ensure the total price is converted to string
            style={styles.textInput}
            editable={false}
          />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Back
        </Button>

        <Button mode="contained" onPress={showDialog} style={styles.button}>
          Confirm
        </Button>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>
          Do you want to save the card details?
        </Text>
        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
      </View>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title>Confirm Payment</Dialog.Title>
          <Dialog.Content>
            <Text>Do you want to confirm the order?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} color="red">
              No
            </Button>
            <Button onPress={handleConfirmPayment}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor :'#f0f4f8'
  },
  paymentMethodContainer: {
    marginBottom: 20,
  },
  radioButtonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 350,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  textInput: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  button: {
    width: "48%",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  switchText: {
    color: "red",
  },
  itemCodeContainer: {
    marginVertical: 20,
  },
});
