import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  Dimensions,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import {
  Text,
  Searchbar,
  Card,
  Button,
  Provider,
  Menu,
} from "react-native-paper";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import {
  CommonActions,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

import MainPage from "./Items/mainComponet"; // Ensure correct path
import UserDetailsScreen from "./ProfileScreen"; // Ensure correct path
import CartScreen from "./Cart/ViewCartItems"; // Ensure correct path
import OrdersViewScreen from "./Orders/OrdersView"; // Ensure correct path
import CustomAlert from "./Components/CustomMessage/customMessage";
import { handleAddToCart } from "./Cart/AddToCart"; // Ensure correct path

const Tab = createBottomTabNavigator();

const MyComponent = () => {
  const [isSeller, setIsSeller] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userUid, setUserUid] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setUserUid(user.uid); // Store the userUid here
          const userRef = doc(db, "userDetails", user.uid);
          const docSnapshot = await getDoc(userRef);

          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setUserData(userData);
            setIsSeller(userData.isSeller);
          } else {
            console.log("User data not found");
          }
          setIsLoading(false);
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Login" }],
            })
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
        CustomAlert(
          "Error",
          "Failed to fetch user data. Please try again later."
        );
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserData();
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        );
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <Provider>
      <View style={styles.container}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: "#f57f20", // Eye-comforting orangish color
            tabBarInactiveTintColor: "#6d6d6d", // Gray color for inactive tabs
            tabBarLabelStyle: {
              fontSize: 12,
            },
            tabBarStyle: {
              display: "flex",
              backgroundColor: "#ffffff", // Background color for tab bar
            },
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = "home";
              } else if (route.name === "Cart") {
                iconName = "cart-outline";
              } else if (route.name === "Profile") {
                iconName = "person-outline";
              } else if (route.name === "Add Items") {
                iconName = "add";
              } else if (route.name === "Orders") {
                iconName = "document";
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ tabBarLabel: "Home" }}
          />
          {isSeller && (
            <>
              <Tab.Screen
                name="Add Items"
                component={MainPage}
                options={{ tabBarLabel: "Add Items" }}
              />
              <Tab.Screen
                name="Orders"
                component={OrdersViewScreen}
                initialParams={{ isSeller, userUid }} // Pass params if needed
                options={{ tabBarLabel: "Orders" }}
              />
            </>
          )}
          {!isSeller && (
            <>
              <Tab.Screen
                name="Orders"
                component={OrdersViewScreen}
                initialParams={{ isSeller, userUid }} // Pass params if needed
                options={{ tabBarLabel: "Orders" }}
              />
            </>
          )}
          <Tab.Screen
            name="Cart"
            component={CartScreen}
            options={{ tabBarLabel: "Cart" }}
          />
          <Tab.Screen
            name="Profile"
            component={UserDetailsScreen}
            options={{ tabBarLabel: "Profile" }}
          />
        </Tab.Navigator>
      </View>
    </Provider>
  );
};

const HomeScreen = () => {
  //graphicscomputer@gmail.com
  //test@123
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    name: "",
    priceMin: 10,
    priceMax: 100000,
  });
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [sliderValues, setSliderValues] = useState([
    filters.priceMin,
    filters.priceMax,
  ]);

  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;

  const fetchCategories = async () => {
    try {
      const categoriesCollection = collection(db, "ItemCode");
      const querySnapshot = await getDocs(categoriesCollection);
      if (querySnapshot.empty) {
        setCategories([]);
      } else {
        const fetchedCategories = querySnapshot.docs.map((doc) => ({
          label: doc.data().name,
          value: doc.id,
        }));
        setCategories(fetchedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const fetchItems = async () => {
    try {
      const itemsCollection = collection(db, "items");
      const q = query(itemsCollection, where("Status", "==", "Active"));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setItems([]);
        setFilteredItems([]);
        setLoading(false);
        Alert.alert("No Items Found", "No active items found for this user.");
      } else {
        const fetchedItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(fetchedItems);
        setFilteredItems(fetchedItems);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching items: ", error);
      setLoading(false);
      Alert.alert("Error", "Failed to fetch items. Please try again later.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
      fetchItems();
    }, [])
  );

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const lowercasedQuery = searchQuery.toLowerCase();
      const newFilteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredItems(newFilteredItems);
    } else {
      let newFilteredItems = items;
      newFilteredItems = newFilteredItems.filter(
        (item) =>
          (filters.category ? item.category === filters.category : true) &&
          item.name.toLowerCase().includes(filters.name.toLowerCase()) &&
          item.price >= filters.priceMin &&
          item.price <= filters.priceMax
      );
      setFilteredItems(newFilteredItems);
    }
  }, [searchQuery, filters, items]);

  const openItemDetails = (item) => {
    setSelectedItem(item);
  };

  const closeItemDetails = () => {
    setSelectedItem(null);
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleAddToCartWrapper = () => {
    if (selectedItem) {
      if (
        selectedItem &&
        selectedItem.code !== null &&
        selectedItem.code !== undefined &&
        selectedItem.price !== null &&
        selectedItem.price !== undefined &&
        selectedItem.userId !== null &&
        selectedItem.userId !== undefined &&
        selectedItem.imageUri !== null &&
        selectedItem.imageUri !== undefined
      ) {
        CustomAlert(
          "Warning",
          "Are you sure you want to add this item to cart?",
          () => {
            handleAddToCart(
              selectedItem,
              quantity,
              setQuantity,
              closeItemDetails,
              selectedItem.code,
              selectedItem.price,
              selectedItem.userId,
              selectedItem.imageUri
            );
            CustomAlert(
              "Success",
              "Your Item is added to the cart. Please view the Cart tab"
            );
          }
        );
      } else {
        CustomAlert("Fail", "Fields are not filled");
      }
    } else {
      CustomAlert("Fail", "Something went wrong");
    }
  };

  const handleLogout = () => {
    CustomAlert("Warning", "Are you sure you want to logout?", () => {
      auth
        .signOut()
        .then(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "SigninScreen" }],
            })
          );
        })
        .catch((error) => {
          console.error("Error signing out: ", error);
        });
    });
  };

  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  const applyFilters = () => {
    let newFilteredItems = items;

    newFilteredItems = newFilteredItems.filter(
      (item) =>
        (filters.category ? item.category === filters.category : true) &&
        item.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        item.price >= filters.priceMin &&
        item.price <= filters.priceMax
    );

    setFilteredItems(newFilteredItems);
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      name: "",
      priceMin: 10,
      priceMax: 100000,
    });
    setSliderValues([10, 100000]);
    setFilteredItems(items);
    setFilterModalVisible(false);
  };

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Image
            source={require("../screens/assets/hand_logo.png")}
            style={styles.logo}
          />
          <View style={styles.titleTextContainer}>
            <Text style={styles.mainTitle}>Hand Craft Store</Text>
            <Text style={styles.subTitle}>Make Your Best Choice</Text>
          </View>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setMenuVisible(true)}
              >
                <Icon name="ellipsis-vertical" size={24} color="#ffffff" />
              </TouchableOpacity>
            }
          >
            <Menu.Item
              title="Logout"
              onPress={handleLogout}
              style={styles.menuitem}
            />
          </Menu>
        </View>

        <View style={styles.searchFilterContainer}>
          <Searchbar
            style={styles.searchBar}
            placeholder="Search..."
            onChangeText={(query) => setSearchQuery(query)}
            value={searchQuery}
          />
          <TouchableOpacity
            onPress={openFilterModal}
            style={styles.filterButton}
          >
            <Icon name="filter-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {loading ? (
            <Text>Loading...</Text>
          ) : filteredItems.length === 0 ? (
            <Text>No items found.</Text>
          ) : (
            filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => openItemDetails(item)}
                style={styles.itemCard}
              >
                <Card>
                  <Card.Cover source={{ uri: item.imageUri }} />
                  <Card.Content>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    <Text style={styles.itemPrice}>Rs. {item.price}</Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <Modal
          visible={selectedItem !== null}
          onRequestClose={closeItemDetails}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedItem && (
                <>
                  <Image
                    source={{ uri: selectedItem.imageUri }}
                    style={styles.modalItemImage}
                  />
                  <Text style={styles.modalItemDescription}>
                    {selectedItem.description}
                  </Text>
                  <Text style={styles.modalItemPrice}>
                    Rs .{selectedItem.price}
                  </Text>
                  <View style={styles.modalQuantityContainer}>
                    <Button onPress={decrementQuantity}>-</Button>
                    <Text style={styles.modalQuantity}>{quantity}</Text>
                    <Button onPress={incrementQuantity}>+</Button>
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button
                      icon={() => (
                        <Ionicons name="cart-outline" size={20} color="#fff" />
                      )}
                      mode="contained"
                      onPress={handleAddToCartWrapper}
                    >
                      Add to Cart
                    </Button>
                    <Button onPress={closeItemDetails}>Close</Button>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* Filter Modal */}
        <Modal
          visible={filterModalVisible}
          onRequestClose={() => setFilterModalVisible(false)}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.filterModalOverlay}>
            <View style={styles.filterModalContent}>
              {/* Category Picker */}
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Category</Text>
                <Picker
                  selectedValue={filters.category}
                  onValueChange={(value) =>
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      category: value,
                    }))
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="All Categories" value="" />
                  {categories.map((category) => (
                    <Picker.Item
                      key={category.value}
                      label={category.label}
                      value={category.value}
                    />
                  ))}
                </Picker>
              </View>

              {/* Price Range Slider */}
              <Text style={styles.pickerLabel}>Price Range</Text>
              <View
                style={[styles.sliderContainer, { width: screenWidth * 0.8 }]}
              >
                <MultiSlider
                  values={sliderValues}
                  min={10}
                  max={100000}
                  step={1}
                  onValuesChange={setSliderValues}
                  onValuesChangeFinish={(values) =>
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      priceMin: values[0],
                      priceMax: values[1],
                    }))
                  }
                  selectedStyle={{
                    backgroundColor: "#ff8c00",
                  }}
                  trackStyle={{
                    height: 5,
                    borderRadius: 5,
                  }}
                  markerStyle={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    backgroundColor: "#ff8c00",
                    borderWidth: 2,
                    borderColor: "#ffffff",
                  }}
                />
              </View>

              <Text style={styles.sliderValueLabel}>
                Rs. {sliderValues[0]} - Rs. {sliderValues[1]}
              </Text>

              {/* Filter Modal Buttons */}
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  onPress={clearFilters}
                  style={styles.clearFilterButton}
                >
                  <Text style={styles.clearFilterButtonText}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={applyFilters}
                  style={styles.applyFilterButton}
                >
                  <Text style={styles.applyFilterButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Provider>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: "#f57f20", // Eye-comforting orangish color
  },
  logo: {
    width: width * 0.1,
    height: width * 0.1,
    resizeMode: "contain",
  },
  menuitem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  titleTextContainer: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 2,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subTitle: {
    fontSize: 14,
    color: "#ffffff",
  },
  searchFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 8,
    backgroundColor: "#ffffff",
    marginTop: 3,
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  searchInput: {
    color: "#333",
  },
  filterButton: {
    padding: 8,
  },
  scrollViewContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  itemCard: {
    marginBottom: 16,
  },
  menuButton: {
    padding: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
  },
  itemCateg: {
    fontSize: 15,
    color: "blue", // Eye-comforting orangish color
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f57f20", // Eye-comforting orangish color
  },

  modalContent: {
    width: "90%",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  modalItemTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  modalItemImage: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  modalItemDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  modalItemPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f57f20",
    marginBottom: 16,
  },
  modalQuantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#666666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  filterModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  filterModalContent: {
    width: width * 0.9,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  sliderWrapper: {
    width: "100%", // Ensure the wrapper takes full width
    alignItems: "center", // Center the slider within the wrapper
  },
  sliderContainer: {
    // Ensure padding does not overflow the slider container
    alignItems: "center",
    justifyContent: "center",
  },
  sliderValueLabel: {
    marginTop: 10, // Space between the slider and value label
    fontSize: 16, // Adjust font size as needed
    color: "#000", // Adjust color as needed
  },
  sliderSelected: {
    backgroundColor: "#ff7f50",
  },
  sliderTrack: {
    backgroundColor: "#dcdcdc",
  },
  sliderMarker: {
    backgroundColor: "#ff7f50",
  },
  priceRangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  priceLabel: {
    fontSize: 16,
    color: "#333",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clearFilterButton: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    marginRight: 10,
  },
  clearFilterButtonText: {
    fontSize: 16,
    color: "#333",
  },
  applyFilterButton: {
    flex: 1,
    backgroundColor: "#ff7f50",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    marginLeft: 10,
  },
  applyFilterButtonText: {
    fontSize: 16,
    color: "white",
  },
});

export default MyComponent;
