import React, {useState} from 'react'
import { View,Text, StyleSheet, useWindowDimensions,ScrollView} from 'react-native'

import CustomInput from '../../../Components/Custominput/CustomInput';
import CustomButton from '../../../Components/Custombutton/CustomButton';
import SocialSignInButtons from '../../../Components/SocialSignInButtons/SocialSignInButtons';


const ConfirmEmailScreen = () => {
    const [code,setCode]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [passwordRepeat,setPasswordRepeat]=useState('');

    

    const onConfirmPressed = () => {
        console.warn("onConfirmPressed");
    }

     const onSignInPressed = () => {
        console.warn("onSignInPressed");
    }

     const onResendPressed = () => {
        console.warn("onResendPressed");
    }

    

    return (
        <ScrollView>
        <View style={styles.root}>
         <Text style={styles.title}>Confirm your Email</Text>

        <CustomInput placeholder="Enter your confirmation Code" value={code} setValue={setCode} />
        
        
        <CustomButton text={"Confirm"} onPress={onConfirmPressed}/>

        <CustomButton text="Resend Code" onPress={onResendPressed} type='SECONDARY'/>

        <CustomButton text="Back to Sign in" onPress={onSignInPressed} type='TERTIARY'/>
        
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
  
   text:{
    color: 'gray',
    marginVertical: 10,
   },
   link:{
    color: '#B22222',
   },
    title: {
        fontSize:24,
        fontWeight:'bold',
        color:'#8B4513',
        margin: 10,
    },

});

export default ConfirmEmailScreen;
