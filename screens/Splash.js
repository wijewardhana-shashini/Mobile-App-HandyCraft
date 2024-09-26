import React, {useEffect,useState} from 'react';
import { Image, ImageBackground, StyleSheet, Text, View, TouchableOpacity, Animated, Easing, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const Splash = ({navigation}) => {

    const [isGo, setIsGo] =useState(true);
    //const Navigation= Navigation();

    useEffect(() =>{
        if(isGo == true){
            setTimeout(() =>{
                navigation.navigate("WelcomeScreen");
                setIsGo(false);
            },2000);
            }
        });
    

  return (
    <LinearGradient
    colors={['#8E5639','#CA733D','#D6A08B']}
    style={{ flex: 1 }}>
       
    <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <Image style ={{width:200, height:200}} source={require("./assets/hand_logo.png")} />
        <Text style ={{fontSize:40}}>Welcome</Text>
        <Text>Powered by </Text>
        <Text style={{fontSize:8}}> MVT HandCraft</Text>
    </View>
    </LinearGradient>
  )
}

export default Splash

const styles = StyleSheet.create({
  background: {
      flex: 1,
      justifyContent: "flex-end",
    
  },
  button: {
      width: "100%",
      height: 70,
      borderRadius: 35, // Make the buttons rounded
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 10, // Add spacing between the buttons
      elevation: 5, // Add elevation for a shadow effect on Android
  },
  loginButton: {
      backgroundColor: "#DAA06D",
  },
  registerButton: {
      backgroundColor: "#ca7f68",
  },
  buttonText: {
      fontSize: 24,
      color: "white",
  },
  logo: {
      width: 150,
      height: 150,
      position: "absolute",
      top: 10,
      right: 0,
     
  },
});

