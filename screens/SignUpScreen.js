import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { TextInput, IconButton, Checkbox } from "react-native-paper";
import { Link } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import CustomButton from "./Components/Custombutton/CustomButton"; // Update the path as per your project structure
import CustomAlert from "./Components/CustomMessage/customMessage"; // Import the CustomAlert component

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [namewithinitials, setNamewithinitials] = useState("");
  const [address, setAddress] = useState("");
  const [telno, setTelno] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [isSeller, setIsSeller] = useState(false);

  const handleRegister = async () => {
    console.log("Handling Registration...");

    // Field validations
    if (!username) {
      CustomAlert("Validation Error", "Username is required.");
      console.log("Validation Error: Username is required.");
      return;
    }

    if (!namewithinitials) {
      CustomAlert("Validation Error", "Name with initials is required.");
      console.log("Validation Error: Name with initials is required.");
      return;
    }

    if (!address) {
      CustomAlert("Validation Error", "Address is required.");
      console.log("Validation Error: Address is required.");
      return;
    }

    if (!telno) {
      CustomAlert("Validation Error", "Telephone number is required.");
      console.log("Validation Error: Telephone number is required.");
      return;
    }

    if (!email) {
      CustomAlert("Validation Error", "Email is required.");
      console.log("Validation Error: Email is required.");
      return;
    }

    if (!password) {
      CustomAlert("Validation Error", "Password is required.");
      console.log("Validation Error: Password is required.");
      return;
    }

    if (!passwordRepeat) {
      CustomAlert("Validation Error", "Confirm password is required.");
      console.log("Validation Error: Confirm password is required.");
      return;
    }

    if (password !== passwordRepeat) {
      CustomAlert("Validation Error", "Passwords do not match.");
      console.log("Validation Error: Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      CustomAlert(
        "Validation Error",
        "Password must be at least 6 characters long."
      );
      console.log(
        "Validation Error: Password must be at least 6 characters long."
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      CustomAlert("Validation Error", "Email address is invalid.");
      console.log("Validation Error: Email address is invalid.");
      return;
    }

    const telnoRegex = /^[0-9]{10,15}$/; // Example: Phone number must be between 10 to 15 digits
    if (!telnoRegex.test(telno)) {
      CustomAlert(
        "Validation Error",
        "Telephone number is invalid. It should be between 10 to 15 digits."
      );
      console.log("Validation Error: Telephone number is invalid.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "userDetails", user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        username: username,
        namewithinitials: namewithinitials,
        address: address,
        telno: telno,
        email: user.email,
        isSeller: isSeller,
        createdAt: new Date(),
      });

      CustomAlert("Success", "User registered successfully.");
      navigation.navigate("SigninScreen");
    } catch (error) {
      CustomAlert(
        "Registration Error",
        "Failed to register user. Please try again."
      );
      console.error("Error registering user: ", error);
    }
  };

  const onTermsOfUsePressed = () => {
    console.warn("Terms of Use Pressed");
  };

  const onPrivacyPressed = () => {
    console.warn("Privacy Policy Pressed");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ alignItems: "center", paddingTop: 10 }}>
        <Text style={styles.title}>Create an account</Text>
      </View>

      <View style={{ padding: 20 }}>
        <TextInput
          label="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={styles.input}
        />

        <TextInput
          label="Name With Initials"
          value={namewithinitials}
          onChangeText={(text) => setNamewithinitials(text)}
          style={styles.input}
        />

        <TextInput
          label="Tel. No"
          value={telno}
          onChangeText={(text) => setTelno(text)}
          style={styles.input}
          keyboardType="phone-pad"
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
          keyboardType="email-address"
        />

        <TextInput
          label="Address"
          value={address}
          onChangeText={(text) => setAddress(text)}
          style={styles.input}
        />

        <TextInput
          label="Password"
          secureTextEntry
          right={<TextInput.Icon name="eye" />}
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
        />

        <TextInput
          label="Confirm Password"
          secureTextEntry
          right={<TextInput.Icon name="eye" />}
          value={passwordRepeat}
          onChangeText={(text) => setPasswordRepeat(text)}
          style={styles.input}
        />

        <Checkbox.Item
          label="Are you looking to sell items?"
          status={isSeller ? "checked" : "unchecked"}
          onPress={() => setIsSeller(!isSeller)}
          style={styles.checkbox}
          labelStyle={styles.checkboxLabel}
        />
      </View>

      <CustomButton text="Register" onPress={handleRegister} />

      <View style={styles.bottomContainer}>
        <Text style={styles.text}>
          By registering, you confirm that you accept our{" "}
          <Text style={styles.link} onPress={onTermsOfUsePressed}>
            Terms of Use
          </Text>{" "}
          and{" "}
          <Text style={styles.link} onPress={onPrivacyPressed}>
            Privacy Policy
          </Text>
        </Text>

        <Link to={{ screen: "SigninScreen" }} style={styles.link}>
          Have an account? Sign in
        </Link>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B4513",
    marginVertical: 10,
    textAlign: "center",
  },
  input: {
    marginBottom: 10,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  text: {
    color: "gray",
    marginVertical: 10,
    textAlign: "center",
  },
  link: {
    color: "#F0F8FF",
    textAlign: "center",
    marginTop: 20,
  },
  bottomContainer: {
    paddingBottom: 20,
  },
});

export default SignUpScreen;
