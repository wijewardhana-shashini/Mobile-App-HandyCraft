import React from "react";
import { View, Text, StyleSheet, Pressable } from 'react-native';

const CustomButton = ({ onPress, text, type = "PRIMARY",bgColor,fgColor }) => {
    return (
        <Pressable 
        onPress={onPress} 
        style={[
            styles.container, 
            styles[`container_${type}`],
            bgColor ? {backgroundColor:bgColor} : {}
            ]}>
            <Text 
            style={[
                styles.text, 
                styles[`text_${type}`],
                fgColor ? {color:fgColor} : {}
                ]}>{text}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 5,
    },
    container_PRIMARY: {
        backgroundColor: '#C04000',
    },

    container_SECONDARY:{
        borderColor:'#C04000',
        borderWidth:2,
    },
    container_TERTIARY: {
        backgroundColor: 'lightgrey', // Example background color for tertiary type
    },
    text: {
        fontWeight: 'bold',
        color: 'white',
    },
    text_TERTIARY: {
        color: 'grey',
    },
    text_SECONDARY: {
        color:'#C04000',

    },
});

export default CustomButton;
