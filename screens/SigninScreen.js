import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Checkbox, IconButton, MD2Colors, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import CustomButton from './Components/Custombutton/CustomButton';
import CustomAlert from './Components/CustomMessage/customMessage';

const SigninScreen = () => {
  const navigation = useNavigation();

 
//==================for testing ============================================
  //const [username, setUsername] = useState('graphicscomputer@gmail.com');
  //const [password, setPassword] = useState('test@123');
//==========================================================================

 // State variables
  const [checked, setChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load credentials from AsyncStorage when the component mounts
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem('username');
        const savedPassword = await AsyncStorage.getItem('password');
        const rememberMe = await AsyncStorage.getItem('rememberMe') === 'true';

        if (savedUsername && savedPassword && rememberMe) {
          setUsername(savedUsername);
          setPassword(savedPassword);
          setChecked(true);
        }
      } catch (error) {
        console.error('Failed to load credentials:', error);
      }
    };

    loadCredentials();
  }, []);

  // Validate inputs
  const validateInputs = () => {
    let isValid = true;
    setUsernameError('');
    setPasswordError('');

    if (!username.trim()) {
      setUsernameError('Username is required.');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required.');
      isValid = false;
    }

    return isValid;
  };

  // Handle sign-in process
  const onSignInPressed = async () => {
    if (!validateInputs()) return;

    setIsLoading(true); // Start loading indicator

    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;

      console.log('Sign-In successful');

      // Store credentials if "Remember Me" is checked
      if (checked) {
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('password', password);
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.setItem('rememberMe', 'false');
      }

      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Error signing in:', error.code, error.message);

      // Handle different error cases
      switch (error.code) {
        case 'auth/invalid-email':
          CustomAlert('Sign-In Error', 'The email address is invalid. Please check the email format.');
          break;
        case 'auth/user-not-found':
          CustomAlert('Sign-In Error', 'No user found with this username.');
          break;
        case 'auth/wrong-password':
          CustomAlert('Sign-In Error', 'The password is incorrect.');
          break;
        case 'auth/network-request-failed':
          CustomAlert('Sign-In Error', 'Network error. Please try again later.');
          break;
        case 'permission-denied':
          CustomAlert('Sign-In Error', 'Permission denied. You might not have access to this resource.');
          break;
        default:
          CustomAlert('Sign-In Error', `Error code: ${error.code} - ${error.message}`);
          break;
      }
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ paddingTop: 20 }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../screens/assets/hand_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={{ padding: 20 }}>
          <TextInput
            label="Email"
            value={username}
            onChangeText={setUsername}
            style={{ marginBottom: 10 }}
            error={!!usernameError}
          />
          {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

          <TextInput
            label="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            error={!!passwordError}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>

        <View style={styles.root}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('ForgotPassword')}
              style={{ color: 'blue', paddingTop: 15, marginRight: 40 }}
            >
              <Text>Forgot Password?</Text>
            </TouchableOpacity>
            <View style={{ color: 'black' }}>
              <Checkbox.Item
                label="Remember me"
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => setChecked(!checked)}
              />
            </View>
          </View>

          <CustomButton text={"Sign In"} onPress={onSignInPressed} />
          <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")} style={{ color: 'blue', paddingTop: 15 }}>
            <Text>Don't have an account? Create one</Text>
          </TouchableOpacity>

          {/* Show loading indicator if isLoading is true */}
          {isLoading && <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#ff6600" />}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 30,
    backgroundColor: '#F2D2BD',
    marginBottom: 30,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default SigninScreen;
