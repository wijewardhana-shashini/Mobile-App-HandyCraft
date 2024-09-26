import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db, auth, storage } from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Define screen dimensions
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function AddItemsModal() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [itemCode, setItemCode] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [date, setDate] = useState(new Date());
  const [isUploading, setIsUploading] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    (async () => {
      // Request permissions for image picker and camera
      if (Constants.platform?.ios || Constants.platform?.android) {
        const { status: mediaStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log("Media library permissions status:", mediaStatus);
        if (mediaStatus !== "granted") {
          Alert.alert(
            "Permission Error",
            "Sorry, we need media library permissions to make this work!"
          );
        }

        const { status: cameraStatus } =
          await ImagePicker.requestCameraPermissionsAsync();
        console.log("Camera permissions status:", cameraStatus);
        if (cameraStatus !== "granted") {
          Alert.alert(
            "Permission Error",
            "Sorry, we need camera permissions to make this work!"
          );
        }
      }

      fetchCategories();
    })();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...");
      const categoriesCollection = collection(db, "ItemCode");
      const querySnapshot = await getDocs(categoriesCollection);

      if (querySnapshot.empty) {
        console.log("No categories found");
        setCategories([]);
      } else {
        const fetchedCategories = querySnapshot.docs.map((doc) => ({
          value: doc.id,
          label: doc.data().name,
        }));
        console.log("Fetched categories:", fetchedCategories);
        setCategories(fetchedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const generateItemCode = async () => {
    if (!category) {
      Alert.alert("Error", "Please select a category");
      return "";
    }

    try {
      console.log("Generating item code for category:", category);
      const itemCodeDocRef = doc(db, "ItemCode", category);
      const itemCodeDoc = await getDoc(itemCodeDocRef);

      if (!itemCodeDoc.exists()) {
        Alert.alert("Error", "Category not found");
        return "";
      }

      const { countVal } = itemCodeDoc.data();
      const newCountVal = (parseInt(countVal, 10) + 1)
        .toString()
        .padStart(5, "0");
      const newItemCode = `${category}-${newCountVal}`;
      setItemCode(newItemCode);

      await updateDoc(itemCodeDocRef, { countVal: newCountVal });

      console.log("Generated item code:", newItemCode);
      return newItemCode;
    } catch (error) {
      console.error("Error generating item code: ", error);
      Alert.alert("Error", "Failed to generate item code. Please try again.");
      return "";
    }
  };

  const handleAddItem = async () => {
    if (!name || !category || !description || !price) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    if (isUploading) {
      Alert.alert("Error", "Image is still uploading. Please wait.");
      return;
    }

    try {
      console.log("Adding item with details:", {
        name,
        category,
        description,
        price,
        quantity,
        imageURL,
        date,
      });

      setIsLoading(true); // Show loading indicator

      const generatedCode = await generateItemCode();

      if (!generatedCode) {
        Alert.alert("Error", "Item code is not set. Cannot add item.");
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "User not authenticated");
        return;
      }
      const uid = user.uid;

      await addDoc(collection(db, "items"), {
        code: generatedCode,
        name,
        Status: "Active",
        category,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        imageUri: imageURL,
        date: date.toISOString(),
        userId: uid,
      });

      Alert.alert("Success", "Item added successfully");
      setName("");
      setCategory("");
      setDescription("");
      setPrice("");
      setQuantity(0);
      setImageUri("");
      setImageURL("");
    } catch (error) {
      console.error("Error adding item: ", error);
      Alert.alert("Error", "Failed to add item. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  const handleImagePicker = async () => {
    try {
      console.log("Opening image picker...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log("Image picker result:", result);

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setIsImageModalVisible(true);
      }
    } catch (error) {
      console.error("Error opening image picker: ", error);
    }
  };

  const handleCameraCapture = async () => {
    try {
      console.log("Launching camera...");
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log("Camera capture result:", result);

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setIsImageModalVisible(true);
      }
    } catch (error) {
      console.error("Error capturing image: ", error);
    }
  };

  const uploadImage = async (uri) => {
    try {
      if (!uri) {
        console.log("No image URI provided.");
        return;
      }
      console.log("Uploading image from URI:", uri);
      setIsUploading(true); // Set uploading state to true
      setIsLoading(true); // Show loading indicator
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const imageRef = ref(storage, `Items/ItemsImage/${filename}`);

      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      console.log("Image uploaded successfully. Download URL:", downloadURL);
      setImageURL(downloadURL);
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("Error", "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false); // Reset uploading state
      setIsLoading(false); // Hide loading indicator
    }
  };

  const handleConfirmImage = async () => {
    if (imageUri) {
      await uploadImage(imageUri);

      Alert.alert("Success", "Image confirmed");
      setIsImageModalVisible(false);
    } else {
      Alert.alert("Error", "Failed to upload image. Please try again.");
    }
  };

  const handleRemoveImage = () => {
    console.log("Removing image...");
    setImageUri("");
    setImageURL("");
  };

  const handleCategoryChange = (value) => {
    console.log("Category selected:", value);
    setCategory(value);
  };

  // Function to check if all required fields are filled
  const allFieldsFilled = () => {
    return (
      name &&
      category &&
      description &&
      price &&
      !isNaN(price) &&
      parseFloat(price) > 0
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <Picker
            selectedValue={category}
            onValueChange={handleCategoryChange}
            style={styles.picker}
          >
            <Picker.Item label="Select a Category" value="" />
            {categories.map((cat) => (
              <Picker.Item
                key={cat.value}
                label={cat.label}
                value={cat.value}
              />
            ))}
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={price}
            keyboardType="numeric"
            onChangeText={(text) => setPrice(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={quantity.toString()}
            keyboardType="numeric"
            onChangeText={(text) => setQuantity(parseInt(text) || 0)}
          />
          {imageUri ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={handleRemoveImage}
              >
                <Ionicons name="close-circle" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imageContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleImagePicker}
              >
                <Text style={styles.buttonText}>Pick Image</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleCameraCapture}
              >
                <Text style={styles.buttonText}>By camera</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            style={[styles.button, !allFieldsFilled() && styles.disabledButton]}
            onPress={handleAddItem}
            disabled={!allFieldsFilled()}
          >
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={{ uri: imageUri }} style={styles.modalImage} />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleConfirmImage}
              >
                <Text style={styles.buttonText}>Confirm Image</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setIsImageModalVisible(false);
                  setImageUri(""); // Clear image preview when cancelling
                  setImageURL(""); // Clear image URL when cancelling
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Light gray background
    padding: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff", // Soft white background for the card
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: "95%", // Adjust width as needed
    alignSelf: "center",
  },
  input: {
    height: 45,
    borderColor: "#ff8533", // Subtle border color
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff", // White background for inputs
  },
  picker: {
    height: 50,
    borderColor: "#ff8533", // Subtle border color
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#ffffff", // White background for picker
  },
  button: {
    backgroundColor: "#007bff", // Fresh blue for buttons
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc", // Gray for disabled state
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  imageContainer: {
    marginBottom: 15,
    position: "relative",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%", // Adjust width to match card
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 5,
    borderColor: "#d1d1d1", // Subtle border around image
    borderWidth: 1,
  },
  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 50,
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff", // Soft white background for modal
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: screenWidth * 0.8,
  },
  modalImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 15,
    borderColor: "#d1d1d1", // Subtle border around modal image
    borderWidth: 1,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#007bff", // Fresh blue for modal buttons
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    alignItems: "center",
    justifyContent: "center",
  },
});
