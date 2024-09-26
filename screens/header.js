import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import { Menu, Divider } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const Header = ({ handleLogout }) => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error("User not authenticated");
        }

        const userDetailsCollectionRef = collection(db, "userDetails");
        const q = query(userDetailsCollectionRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUserDetails(userData);
        } else {
          console.log("User data not found");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  return (
    <View style={styles.container}>
      <Image source={require('../screens/assets/hand_logo.png')} style={styles.logo} />
      <View style={styles.userDetailsContainer}>
        {userDetails ? (
          <>
            <Text style={styles.greetingText}>Hi {userDetails.username}</Text>
            <Text style={styles.welcomeText}>Welcome to handCraft store</Text>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
      <Menu
        visible={menuVisible}
        onDismiss={toggleMenu}
        anchor={
          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            <Icon name="ellipsis-vertical" size={24} color="#000000" />
          </TouchableOpacity>
        }
      >
        <Menu.Item
          onPress={() => navigation.navigate("UserDetailsScreen")}
          title="Profile"
          style={styles.menuItem}
        />
        <Menu.Item
          onPress={() => navigation.navigate("SettingsPage")}
          title="Settings"
          style={styles.menuItem}
        />
        <Menu.Item
          onPress={() => navigation.navigate("HelpPage")}
          title="Help"
          style={styles.menuItem}
        />
        <Divider style={styles.divider} />
        <Menu.Item
          onPress={handleLogout}
          title="Logout"
          style={styles.menuItem}
        />
      </Menu>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: "#f0f4f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: '100%',
    marginTop: 20, // Fixed top margin
  },
  logo: {
    width: width * 0.1,
    height: width * 0.1,
    resizeMode: 'contain',
  },
  userDetailsContainer: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 15,
    maxWidth: width * 0.6,
  },
  greetingText: {
    fontSize: width * 0.045,
    color: "#000000",
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: width * 0.04,
    color: "#333333",
  },
  menuButton: {
    padding: 10,
  },
  menuItem: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginVertical: 5,
    borderRadius: 5,
  },
  divider: {
    backgroundColor: '#ddd',
  },
});

export default Header;
