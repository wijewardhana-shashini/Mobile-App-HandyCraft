import React, {useEffect,useState} from 'react';
import { Image, ImageBackground, StyleSheet, Text, View, TouchableOpacity,ScrollView } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import {Button,Card,BottomNavigation,Modal, Portal, PaperProvider, RadioButton} from 'react-native-paper';
import Icon from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { Text, BottomNavigation } from 'react-native-paper';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const OrderItem = ({navigation}) => {

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
         safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
             navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Order Item',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Description',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="document-text-outline" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

function HomeScreen({navigation}) {
    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => {
      setQuantity(quantity + 1);
    };
  
    const decreaseQuantity = () => {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    };

    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [checked, setChecked] = React.useState('normal');
    const containerStyle = {backgroundColor: 'white', padding: 20};

  return (
    <ScrollView>
    <View>

    <View style={{justifyContent: 'center', alignItems: 'center',}}>
        <Image style ={{height:300}} source={require("./assets/R.jpg")} />
        <Text style ={{fontSize:30,padding:10}}>HandCraft</Text>
        <Text style ={{fontSize:10}}>By MVT HandCraft </Text>
        <Text style ={{fontSize:30, color:'red', padding:10}}>$ <Text style ={{fontSize:50, color:'red'}}>40.0 </Text><Text style ={{fontSize:10, color:'red'}}>per Item</Text></Text>
    <View style={{justifyContent: 'space-between', flexDirection:'row'}}>
       
      <TouchableOpacity onPress={increaseQuantity}>
        <Card style={{backgroundColor:'green',marginRight:10, width:30, height:30, alignItems:'center'}}><Text style={{fontSize:20}}>+</Text></Card>
      </TouchableOpacity>
        <Text style={{fontSize:20}}>Quantity: {quantity}</Text>
      <TouchableOpacity onPress={decreaseQuantity}>
        <Card style={{backgroundColor:'green',marginLeft:10, width:30, height:30, alignItems:'center'}}><Text style={{fontSize:20}}>-</Text></Card>
      </TouchableOpacity>
      </View>
      <View style={{justifyContent: 'space-between', flexDirection:'row'}}>
        
      <Button icon="cart-outline" mode="contained" onPress={() => console.log('Pressed')} style={{marginTop:50, marginRight:10, width:150, marginLeft:40}}>
            Add To Cart
      </Button>
      <PaperProvider >
        <View>
      <Portal >
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle} style={{width:300, marginLeft:-150,marginTop:-330}}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image source={require("./assets/RB.jpeg")} style={{width:250, height:50}} />
          <Text style={{fontWeight: "bold"}}>Master</Text>
        <RadioButton value="first" onPress={() => navigation.navigate('paymentdetails')} />
      </View>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontWeight: "bold"}}>Visa</Text>
      <RadioButton value="second" />
      </View>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontWeight: "bold"}}>Paypal</Text>
      <RadioButton value="second" onPress={() => {
                                  navigation.navigate('paymentdetails');
                                  {hideModal};
                              }}/>
      </View>
        </Modal>
                            </Portal>
      </View>
      <Button icon="briefcase-outline" mode="contained" onPress={showModal} style={{marginTop:50, width:150}} >
            Confirm Order
      </Button>

      
    </PaperProvider>
   
      </View>
    </View>
    </View>
    </ScrollView>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.container}>
      
        <Text style={{paddingBottom:20, fontSize:30}}> Item Description</Text>
        <Card style={{width:300}}>
            <Text style={{textAlign:'center'}}>
            Including an image of a person adds credibility to a quote; it also makes an online company more personal and approachable encouraging customers to call to get answers to their queries.
            The above quote carries extra impact because it describes the product as popular. The popularity claim is further supported with a cutting from the press and the phrase press favorite.
            Most buyers are attracted to buying something that's popular. When it comes to your ecommerce website, highlight the products that are customer favorites.
            </Text>
      </Card>
    </View>
  );
}
 

export default OrderItem

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
