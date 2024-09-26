import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function TermsAndPrivacyPolicyScreen(){
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Terms of Service</Text>
        <Text style={styles.section}>
          <Text style={styles.subHeading}>1. Acceptance of Terms</Text>
          {'\n'}
          By using this app, you agree to the terms and conditions outlined here. Continued use constitutes acceptance of any changes.
        </Text>
        <Text style={styles.section}>
          <Text style={styles.subHeading}>2. User Accounts</Text>
          {'\n'}
          Users must provide accurate information when creating an account and are responsible for maintaining the confidentiality of their account information.
        </Text>
        <Text style={styles.section}>
          <Text style={styles.subHeading}>3. User Responsibilities</Text>
          {'\n'}
          Users must not use the app for any illegal activities and are responsible for any content they generate.
        </Text>
        {/* Add more sections as needed */}

        <Text style={styles.heading}>Privacy Policy</Text>
        <Text style={styles.section}>
          <Text style={styles.subHeading}>1. Information Collection</Text>
          {'\n'}
          We collect personal information when you use our app, including account details and transaction information.
        </Text>
        <Text style={styles.section}>
          <Text style={styles.subHeading}>2. Information Use</Text>
          {'\n'}
          Your information is used to process transactions and enhance your experience. We may also use it for marketing purposes with your consent.
        </Text>
        <Text style={styles.section}>
          <Text style={styles.subHeading}>3. Information Sharing</Text>
          {'\n'}
          We may share your information with third parties for processing transactions or as required by law.
        </Text>
        {/* Add more sections as needed */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  content: {
    padding: 20,
    width: width * 0.9,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  section: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
