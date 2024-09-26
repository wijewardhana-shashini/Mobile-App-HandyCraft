import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Card, Button } from "react-native-paper";
import { auth, db, storage } from "../../firebaseConfig";
import { collection, doc, getDocs, query, where, updateDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomAlert from "../Components/CustomMessage/customMessage";

const ViewItems = () => {
  const screenWidth = Dimensions.get("window").width;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    code: '',
    description: '',
    price: '',
    quantity: ''
  });
  const [imageUri, setImageUri] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      const userId = user.uid;
      const itemsCollection = collection(db, "items");
      const q = query(itemsCollection, where("userId", '==', userId), where("Status", '==', "Active"));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No active items found");
        setItems([]);
      } else {
        const fetchedItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(fetchedItems);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
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
        setCategories(fetchedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInactivate = async (itemId) => {
    try {
      // Update the item's status to 'Inactivated'
      const itemRef = doc(db, "items", itemId);
      await updateDoc(itemRef, { Status: "Inactivated" });
  
      // Remove the item from the state
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      CustomAlert( "Success",
        "Item was removed successfully.");

      console.log('Item status updated to Inactivated');
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };
  
  const handleUpdate = async () => {
    const { name, category, code, description, price, quantity } = formData;
    if (!name || !category || !code || !price || !quantity) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const itemRef = doc(db, "items", selectedItem.id);
      await updateDoc(itemRef, { 
        name, 
        category, 
        code, 
        description, 
        imageUri: imageUri || selectedItem.imageUri,
        price: Number(price), 
        quantity: Number(quantity) 
      });
      setItems(prevItems => prevItems.map(item => 
        item.id === selectedItem.id ? { ...item, ...formData, imageUri: imageUri || item.imageUri } : item
      ));
      Alert.alert( "Success",
        "Item was updaed successfully.");
      console.log('Item updated successfully');
      setShowModal(false);
    } catch (error) {
      CustomAlert( "Error",
        "Error updating item.");
      console.error('Error updating item:', error);
    }
  };

  const openUpdateModal = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      code: item.code,
      description: item.description,
      price: item.price.toString(),
      quantity: item.quantity.toString()
    });
    setImageUri(item.imageUri);
    setShowModal(true);
  };

 const handleImagePicker = async () => {
  // Request permission to access media library
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== 'granted') {
    Alert.alert('Permission Required', 'We need permission to access your photos.');
    return;
  }

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      console.log('Image picker canceled');
      return;
    }

    const { uri } = result.assets[0];
    if (!uri) {
      Alert.alert('Error', 'No image selected. Please try again.');
      return;
    }

    Alert.alert(
      'Confirm Image Change',
      'Are you sure you want to change the image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: async () => {
          setImageUri(uri);
          setIsUploading(true);
          await uploadImage(uri);
        }},
      ]
    );
  } catch (error) {
    console.error('Error opening image picker: ', error);
    Alert.alert('Error', 'Failed to open image picker. Please try again.');
  }
};

  const uploadImage = async (uri) => {
    try {
      if (!uri) {
        console.error('No URI to upload');
        return;
      }
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const imageRef = ref(storage, `Items/ItemsImage/${filename}`);

      const uploadTask = await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      setImageUri(downloadURL);
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading image: ', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
      setIsUploading(false);
    }
  };

  const confirmInactivateItem = (itemId) => {
    Alert.alert(
      'Inactivate Item',
      'Are you sure you want to inactivate this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => handleInactivate(itemId) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          items.map((item) => (
            <Card key={item.id} style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.imageContainer(screenWidth)}>
                  <Image source={{ uri: item.imageUri }} style={styles.image} />
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text>Category: {item.category}</Text>
                  <Text>Code: {item.code}</Text>
                  <Text>Description: {item.description}</Text>
                  <Text>Price: Rs {item.price}</Text>
                  <Text>Quantity: {item.quantity}</Text>
                  <View style={styles.buttonContainer}>
                    <Button
                      mode="contained"
                      style={styles.updateButton}
                      onPress={() => openUpdateModal(item)}
                    >
                      Update
                    </Button>
                    <Button
                      mode="contained"
                      style={styles.inactivateButton}
                      onPress={() => confirmInactivateItem(item.id)}
                    >
                      Delete
                    </Button>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <Modal visible={showModal} animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Update Item</Text>
          <ScrollView style={styles.modalScrollView}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            <Picker
              selectedValue={formData.category}
              style={styles.input}
              onValueChange={(itemValue) => setFormData({ ...formData, category: itemValue })}
            >
              {categories.map((category) => (
                <Picker.Item key={category.value} label={category.label} value={category.value} />
              ))}
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Code"
              value={formData.code}
              onChangeText={(text) => setFormData({ ...formData, code: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="numeric"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              keyboardType="numeric"
              value={formData.quantity}
              onChangeText={(text) => setFormData({ ...formData, quantity: text })}
            />
            <View style={styles.imagePicker}>
              <TouchableOpacity onPress={handleImagePicker}>
                <Ionicons name="image" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.imagePickerText}>Change Image</Text>
            </View>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.modalImage} />
            ) : null}
            <Button mode="contained" onPress={handleUpdate} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Update Item'}
            </Button>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#f0f4f8",
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginBottom: 10,
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
    flex: 1
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align items to the start (left)
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: '#307ecc',
    marginRight: 10, // Add space between buttons
  },
  inactivateButton: {
    backgroundColor: '#ff4d4d',
  },
  modalContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    paddingBottom :5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalScrollView: {
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  imagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerText: {
    marginLeft: 10,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButton: {
    marginTop: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: "flex-start",
    marginTop: 10,
  },
});

export default ViewItems;
