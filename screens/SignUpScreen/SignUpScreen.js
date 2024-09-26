import React, {useState} from 'react'
import { View,Text, StyleSheet, useWindowDimensions,ScrollView} from 'react-native'

import CustomInput from './Components/Custominput/CustomInput';
import CustomButton from './Components/Custombutton/CustomButton';
import SocialSignInButtons from './Components/SocialSignInButtons/SocialSignInButtons';


const SignUpScreen = () => {
    const [username,setUsername]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [passwordRepeat,setPasswordRepeat]=useState('');

    

    const onRegisterPressed = () => {
        console.warn("onRegisterPressed");
    }

    

    const onFrogotPasswordPressed = () =>{
        console.warn('onFrogotPasswordPressed')
    }

    
    const onSignInPressed = () => {
        console.warn('onSignInPressed');
    }

    const onTermsOfUsePressed = () => {
        console.warn('onTermsOfUsePressed');
    }

    const onPrivacyPressed = () => {
        console.warn('onPrivacyPressed');
    }

    return (
        <ScrollView>
        <View style={styles.root}>
         <Text style={styles.title}>Create an account</Text>

        <CustomInput placeholder="Username" value={username} setValue={setUsername}/>
        <CustomInput placeholder="Email" value={email} setValue={setEmail}/>
        <CustomInput placeholder="Password" value={password} setValue={setPassword} secureTextEntry/>
        <CustomInput placeholder="PasswordRepeat" value={passwordRepeat} setValue={setPasswordRepeat} secureTextEntry/>

        <CustomButton text={"Register"} onPress={onRegisterPressed}/>

        <Text style={styles.text}>By registering, you confirm that you  accept our{''}
        <Text style={styles.link} onPress={onTermsOfUsePressed}> Terms of Use</Text> and 
        <Text style={styles.link} onPress={onPrivacyPressed}> Privacy Policy</Text>
        </Text>

        <SocialSignInButtons/>

       

        

        <CustomButton text={"Have an account? Sign in"} onPress={onSignInPressed} type="TERTIARY"/>
        
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

export default SignUpScreen;
