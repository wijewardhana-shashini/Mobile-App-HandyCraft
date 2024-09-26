import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, List, Switch, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig'; // Adjust import based on your project

export default function SettingsPage(){
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = React.useState(false); // Example state for dark mode

  const handleLogOut = () => {
    auth.signOut()
      .then(() => {
        Alert.alert('Logged out', 'You have been logged out successfully.');
        navigation.navigate("SigninScreen"); // Navigate to login screen after logout
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to log out. Please try again.');
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <List.Item
          title="Profile"
          description="View and edit your profile"
          onPress={() => navigation.navigate('Profile')}
          left={() => <List.Icon icon="account" />}
        />
        <List.Item
          title="Change Password"
          description="Update your password"
          onPress={() => navigation.navigate('ForgotPassword')}
          left={() => <List.Icon icon="lock" />}
        />
      </View>

      <Divider />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <List.Item
          title="Dark Mode"
          right={() => (
            <Switch
              value={isDarkMode}
              onValueChange={() => setIsDarkMode(!isDarkMode)}
            />
          )}
          left={() => <List.Icon icon="theme-light-dark" />}
        />
      </View>

      <Divider />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <List.Item
          title="Terms of Service"
          onPress={() => navigation.navigate('TermsAndPrivacyPolicyScreen')}
          left={() => <List.Icon icon="file-document" />}
        />
      </View>

      <Divider />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});