import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import CustomInput from '../../../Components/Custominput/CustomInput';
import CustomButton from '../../../Components/Custombutton/CustomButton';

const NewPasswordScreen = () => {
  const [code, setCode] = useState('');
  const [newPassword,setNewPassword] = useState('');

  const onSubmitPressed = () => {
    console.warn("onSubmitPressed");
  };

  const onSignInPressed = () => {
    console.warn("onSignInPressed");
  };

  return (
    <ScrollView>
      <View style={styles.root}>
        <Text style={styles.title}>Reset Your password</Text>
        <CustomInput placeholder="Code" value={code} setValue={setCode} />
        <CustomInput placeholder="Enter Your new Password" value={newPassword} setValue={setNewPassword} />
        <CustomButton text={"Submit"} onPress={onSubmitPressed} />
        <CustomButton text="Back to Sign in" onPress={onSignInPressed} type='TERTIARY' />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F2D2BD',
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#B22222',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    margin: 10,
  },
});

export default NewPasswordScreen;
