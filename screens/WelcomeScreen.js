import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View, TouchableOpacity, Animated, Easing, Button } from 'react-native';

class WelcomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scaleValue: new Animated.Value(0), // Initial scale value for animation
        };
    }

    componentDidMount() {
        // Start animation when the component mounts
        this.startAnimation();
    }

    startAnimation() {
        Animated.timing(this.state.scaleValue, {
            toValue: 1, // Scale value to animate to
            duration: 1000, // Duration of the animation in milliseconds
            easing: Easing.ease, // Easing function for the animation
            useNativeDriver: true, // Use native driver for better performance
        }).start(); // Start the animation
    }

    render() {
        const { scaleValue } = this.state;
        return (
            <ImageBackground 
                style={styles.background}
                source={require('./assets/background.jpg')}>
                <Image style={styles.logo} source={require("./assets/hand_logo.png")} />

                {/* Login Button */}
                <TouchableOpacity
                    style={[styles.button, styles.loginButton]}
                    onPress={() => {this.props.navigation.navigate("SigninScreen")}}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                {/* Register Button */}
                <TouchableOpacity
                    style={[styles.button, styles.registerButton]}
                    onPress={() => {this.props.navigation.navigate("SignUpScreen")}}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        paddingBottom:80
    },
    button: {
        
        height: 70,
        borderRadius: 35, // Make the buttons rounded
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10, // Add spacing between the buttons
        elevation: 5, // Add elevation for a shadow effect on Android
        marginLeft:20,
        marginRight:20
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

export default WelcomeScreen;