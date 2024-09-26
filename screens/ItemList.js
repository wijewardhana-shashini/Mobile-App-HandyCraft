import React from 'react';
import { View, Text } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const ItemList = () => {
  return (
    <LinearGradient
     // colors={['#be93c5','#7bc6cc']}
     //colors={['#ef32d9','#89fffd']}
     //colors={['#3494e6','#ec6ead']}
    colors={['#4bc0c8','#c779d0','#feac5e']}
      style={{ flex: 1 }}
    >
      <View style={{ padding: 16 }}>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          fontStyle: 'italic',
          textAlign: 'center',
          color: '#ff00ff',
          backgroundColor: '#000000',
          marginBottom: 16,
        }}>
          Sell My Item
        </Text>
        <Card>
          <Card.Title title="Simple Handycrafted" subtitle="crafted by myself" />
          <Card.Content>
            {/* Content of the card */}
          </Card.Content>
          <Card.Actions>
            <Button>Add To Cart</Button>
            <Button>Report</Button>
          </Card.Actions>
        </Card>
        <Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}>
          Press me
        </Button>
      </View>
    </LinearGradient>
  );
}

export default ItemList;
