import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import { Button, Card, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Ensure you have configured Firebase

const ImageUpload = ({ storage }) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  const handleImagePicker = async () => {
    try {
      console.log('Opening image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('Image picker result:', result);
      if (!result.canceled) {
        console.log('Image selected:', result.assets[0].uri);
        setFiles([...files, { uri: result.assets[0].uri, name: result.assets[0].uri.split('/').pop() }]);
        setIsUploading(true);
        await uploadImage(result.assets[0].uri); // Upload the image
      } else {
        console.log('Image picker cancelled');
      }
    } catch (error) {
      console.error('Error opening image picker: ', error);
    }
  };

  const uploadImage = async (uri) => {
    try {
      if (!uri) {
        console.error('No URI to upload');
        return;
      }
      console.log('Uploading image...');
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const imageRef = ref(storage, `Items/ItemsImage/${filename}`);

      const uploadTask = await uploadBytes(imageRef, blob);
      console.log('Upload task:', uploadTask);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      setImageURL(downloadURL); // Set the image URL
      console.log('Image uploaded successfully:', downloadURL);
      setIsUploading(false); // Image upload complete
    } catch (error) {
      console.error('Error uploading image: ', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
      setIsUploading(false); // Ensure to reset the uploading status
    }
  };

  const removeFile = (file) => () => {
    setFiles(files.filter((f) => f.uri !== file.uri));
  };

  return (
    <View style={styles.container}>
      <Card style={styles.dropzone}>
        <Card.Content>
          <Text style={styles.text}>Drag and Drop file or</Text>
          <Button 
            icon={() => <Icon name="file-upload" size={20} color="#ffffff" />}
            mode="contained"
            onPress={handleImagePicker}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Browse'}
          </Button>
        </Card.Content>
      </Card>
      <View style={styles.fileList}>
        {files.map((file) => (
          <Card key={file.uri} style={styles.fileItem}>
            <Card.Content style={styles.fileInfo}>
              <Image source={{ uri: file.uri }} style={styles.filePreview} />
              <Paragraph style={styles.fileName}>{file.name}</Paragraph>
              <Button onPress={removeFile(file)} mode="contained" color="#dc3545">
                X
              </Button>
            </Card.Content>
          </Card>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  dropzone: {
    width: '100%',
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderColor: '#007bff',
    borderWidth: 2,
    borderRadius: 5,
  },
  text: {
    marginBottom: 10,
    textAlign: 'center',
  },
  fileList: {
    width: '100%',
  },
  fileItem: {
    marginBottom: 10,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filePreview: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  fileName: {
    flex: 1,
    marginRight: 10,
  },
});

export default ImageUpload;
