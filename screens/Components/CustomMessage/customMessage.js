import React from 'react';
import { Alert, Platform } from 'react-native';

const CustomAlert = (title, message, onConfirm) => {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}: ${message}`)) {
      onConfirm();
    }
  } else {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: onConfirm,
        },
      ],
      { cancelable: false }
    );
  }
};

export default CustomAlert;
