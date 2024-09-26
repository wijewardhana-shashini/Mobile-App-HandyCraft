// Import necessary modules
import React from 'react';
import { View, Text } from 'react-native';
import CustomButton from '../Custombutton/CustomButton';
// Define your functional component
const SocialSignInButtons = () => {
    const onSignInFacebook = () => {
        console.warn('onSignInFacebook');
    }

    const onSignInGoogle = () => {
        console.warn('onSignInGoogle');
    }

    const onSignInApple = () => {
        console.warn('onSignInApple');
    }

  return (
    <>
      <CustomButton text={"Sign In with Facebook"} onPress={onSignInFacebook} bgColor="#E7EAF4" fgColor="#4765A9"/>
        <CustomButton text={"Sign In with Google"} onPress={onSignInGoogle} bgColor="#E0FFFF" />
        <CustomButton text={"Sign In with Apple"} onPress={onSignInApple} bgColor="#e3e3e3" fgColor="#363636"/>
    </>
  );
}

// Export the component for use in other parts of your application
export default SocialSignInButtons;
