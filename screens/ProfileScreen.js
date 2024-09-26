import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db, auth } from "../firebaseConfig";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import Avatar from "../screens/assets/Avator.png";
import CustomAlert from "./Components/CustomMessage/customMessage";

const { width, height } = Dimensions.get("window");

export default function UserDetailsScreen({ navigation }) {
  const user = auth.currentUser;

  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    email: "",
    phoneNumber: "",
    isSeller: false,
    username: "",
    namewithinitials: "",
  });
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sellerOption, setSellerOption] = useState("Seller");

  useEffect(() => {
    if (user) {
      fetchUserDetails();
    } else {
      CustomAlert("Error", "User is not logged in.");
      console.error("Error: User is not logged in.");
    }
  }, [user]);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    console.debug("Fetching user details...");
    try {
      const q = query(
        collection(db, "userDetails"),
        where("uid", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        setUserDetails(userData);
        setSellerOption(userData.isSeller ? "Seller" : "Customer");
        console.debug("Fetched user details:", userData);
      } else {
        Alert.alert("Error", "User details not found.");
        console.warn("Warning: User details not found.");
      }
    } catch (error) {
      console.error("Error fetching user details: ", error);
      CustomAlert("Error", "Failed to fetch user details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserDetails = async () => {
    setIsLoading(true);

    // Check if the user type has changed
    const newUserType = sellerOption === "Seller";
    if (userDetails.isSeller !== newUserType) {
      CustomAlert(
        "Confirm",
        "Changing user type requires you to log out and log back in. Do you want to continue?",
        async () => {
          await handleUserUpdate(newUserType);
        }
      );
    } else {
      // If the user type has not changed, just update the details
      await handleUserUpdate(newUserType);
    }
  };

  const handleUserUpdate = async (newUserType) => {
    try {
      const q = query(
        collection(db, "userDetails"),
        where("uid", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(userDoc.ref, {
          ...userDetails,
          isSeller: newUserType,
        });
        Alert.alert("Success", "User details updated successfully.");
        setIsEditable(false);
        // Sign out if user type has changed
        if (userDetails.isSeller !== newUserType) {
          handleLogout();
        }
      } else {
        Alert.alert("Error", "User details not found.");
      }
    } catch (error) {
      console.error("Error updating user details: ", error);
      Alert.alert("Error", "Failed to update user details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable);
    console.debug(`Edit mode ${isEditable ? "disabled" : "enabled"}.`);
  };

  const handleLogout = () => {
    CustomAlert("Warning", "You will be logged out to apply the changes. Do you want to continue?", async () => {
      try {
        await auth.signOut();
        navigation.navigate("SigninScreen");
      } catch (error) {
        Alert.alert("Error", "Failed to log out. Please try again.");
        console.error("Error logging out: ", error);
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        <Image source={Avatar} style={styles.avatar} />
      </View>
      <View style={styles.bottomSection}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#ff6600" />
        ) : (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={[styles.input, isEditable && styles.editableInput]}
                placeholder="Full Name"
                value={userDetails.namewithinitials}
                onChangeText={(text) =>
                  setUserDetails({ ...userDetails, namewithinitials: text })
                }
                editable={isEditable}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address:</Text>
              <TextInput
                style={[styles.input, isEditable && styles.editableInput]}
                placeholder="Address"
                value={userDetails.address}
                onChangeText={(text) =>
                  setUserDetails({ ...userDetails, address: text })
                }
                editable={isEditable}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={[styles.input, isEditable && styles.editableInput]}
                placeholder="Email"
                value={userDetails.email}
                onChangeText={(text) =>
                  setUserDetails({ ...userDetails, email: text })
                }
                editable={isEditable}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number:</Text>
              <TextInput
                style={[styles.input, isEditable && styles.editableInput]}
                placeholder="Phone Number"
                value={userDetails.telno}
                onChangeText={(text) =>
                  setUserDetails({ ...userDetails, phoneNumber: text })
                }
                editable={isEditable}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>User Name:</Text>
              <TextInput
                style={[styles.input, isEditable && styles.editableInput]}
                placeholder="User Name"
                value={userDetails.username}
                onChangeText={(text) =>
                  setUserDetails({ ...userDetails, username: text })
                }
                editable={isEditable}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>User Type:</Text>
              {isEditable ? (
                <Picker
                  selectedValue={sellerOption}
                  style={[styles.input, { height: 50 }]}
                  onValueChange={(itemValue) => setSellerOption(itemValue)}
                >
                  <Picker.Item label="Customer" value="Customer" />
                  <Picker.Item label="Seller" value="Seller" />
                </Picker>
              ) : (
                <Text style={styles.input}>{sellerOption}</Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, isEditable && styles.saveButton]}
                onPress={isEditable ? updateUserDetails : toggleEdit}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isEditable ? "Save Details" : "Edit Details"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f4f8",
    marginTop: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: height * 0.02,
  },
  avatar: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    marginBottom: height * 0.02,
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
  },
  inputGroup: {
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: width * 0.04,
    backgroundColor: "#fff",
  },
  editableInput: {
    backgroundColor: "#e9e9e9",
  },
  buttonContainer: {
    marginTop: height * 0.03,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ff6600",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#4caf50",
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.04,
  },
});
