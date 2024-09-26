import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const CustomInput = ({value,setValue,placeholder,secureTextEntry,multiline }) => {
    return (
        
        <View style={styles.container}>
            <TextInput 
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            style={styles.input}
            secureTextEntry={secureTextEntry}
            multiline ={multiline}
             />
        </View> 
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        height: '7%',
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginVertical: 5, // Add margin to create space around the component
    },
    input: {
        
    },
    
});

export default CustomInput;