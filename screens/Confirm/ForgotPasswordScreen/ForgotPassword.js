import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import CustomInput from "../../Components/Custominput/CustomInput";
import { Provider, Dialog, Portal, Button, Paragraph } from "react-native-paper";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handlePasswordReset = async () => {
    if (!email) {
      setDialogMessage("Please enter your email.");
      setVisible(true);
      return;
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
      setDialogMessage("A password reset link has been sent to your email.");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setDialogMessage("The email address is not registered.");
      } else if (error.code === "auth/invalid-email") {
        setDialogMessage("The email address is invalid.");
      } else {
        setDialogMessage("An unexpected error occurred. Please try again.");
      }
    }
    setVisible(true);
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Image
          source={require("../../../screens/assets/hand_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Forgot Password</Text>
        <CustomInput
          setValue={setEmail}
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </TouchableOpacity>
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Password Reset</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{dialogMessage}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F2A65A", // Soft orangish color
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    backgroundColor: '#F2D2BD',
    
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#D87C3A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ForgotPassword;
