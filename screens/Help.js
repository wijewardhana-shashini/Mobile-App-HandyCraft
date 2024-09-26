import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Button,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomAlert from "./Components/CustomMessage/customMessage";
import Header from "./header";
import Icon from "react-native-vector-icons/FontAwesome"; // Ensure you have installed this package

const { width } = Dimensions.get("window");

export default function HelpPage() {
  const navigation = useNavigation();

  const handleLogout = () => {
    CustomAlert("Warning", "Are you sure you want to log out?", async () => {
      try {
        // Ensure auth is imported and properly configured
        await auth.signOut();
        navigation.navigate("SigninScreen");
      } catch (error) {
        CustomAlert("Error", "Failed to log out. Please try again.");
        console.error("Error logging out: ", error);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionContent}>
          Welcome to the Help Page! Here are some resources to help you navigate
          and make the most out of our application:
        </Text>

        <Text style={styles.sectionSubTitle}>Frequently Asked Questions</Text>

        <Text style={styles.faqItem}>
          <Text style={styles.faqQuestion}>1. How do I reset my password?</Text>
          {"\n"}
          <Text style={styles.faqAnswer}>
            To reset your password, go to the settings page and select "Change
            Password". Follow the on-screen instructions to complete the
            process.
          </Text>
        </Text>
        <Text style={styles.faqItem}>
          <Text style={styles.faqQuestion}>
            2. How can I update my profile information?
          </Text>
          {"\n"}
          <Text style={styles.faqAnswer}>
            You can update your profile information by navigating to the profile
            page and selecting "Edit Profile". Make the necessary changes and
            save.
          </Text>
        </Text>
        <Text style={styles.faqItem}>
          <Text style={styles.faqQuestion}>
            3. Where can I find the user guide?
          </Text>
          {"\n"}
          <Text style={styles.faqAnswer}>
            The user guide is available in the app menu under "Help & Support".
            It contains detailed instructions and tips for using the app.
          </Text>
        </Text>

        <Text style={styles.sectionSubTitle}>Contact Us</Text>
        <Text style={styles.sectionContent}>
          If you have further questions or need additional assistance, please
          reach out to our support team at{" "}
          <Text style={styles.email}>support@example.com</Text> or visit our
          help center on our website.
        </Text>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate("UserDetailsScreen")}
        >
          <Text style={styles.linkText}>Go to Profile</Text>
          <Icon name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate("SettingsPage")}
        >
          <Text style={styles.linkText}>Go to Settings</Text>
          <Icon name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate("UpdatePasswordPage")}
        >
          <Text style={styles.linkText}>Update Password</Text>
          <Icon name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>

        <Button title="Logout" onPress={handleLogout} color="#FF6347" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "serif", // Use a different font family if needed
  },
  sectionContent: {
    fontSize: 16,
    marginVertical: 10,
    color: "#333",
  },
  sectionSubTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#000",
  },
  faqItem: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#e6e6e6",
  },
  faqQuestion: {
    fontWeight: "bold",
    color: "#007bff",
  },
  faqAnswer: {
    marginTop: 5,
    color: "#333",
  },
  email: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    width: "100%",
    justifyContent: "space-between",
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
  },
});
