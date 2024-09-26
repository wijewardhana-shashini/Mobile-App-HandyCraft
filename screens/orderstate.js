import React, {useEffect,useState} from 'react';
//import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import {  ProgressBar, MD3Colors, Card, Text } from 'react-native-paper';
//import {nbsp, breakline} from './htmlCodes';


const Orderstate = ({navigation}) => {
  return (
    <View style={{flex:1, justifyContent: 'center', marginTop:-250}}>
     
      <Text style={{color:'black', textAlign:'center', marginTop:20}} variant="headlineSmall">Order State</Text>
      
        
        <ProgressBar style={{height:20, marginLeft:50, marginRight:50, marginTop:100}} progress={0.33} color={MD3Colors.error50} />
        
        <View style={{flexDirection: 'row', justifyContent: 'space-between',marginLeft:50, marginRight:50, marginBottom:-90}}>
            <Text style={{color:'black'}} >Pending</Text>
            <Text style={{color:'black'}}>Approved</Text>
            <Text style={{color:'black'}}>Deliver</Text>
            <Text style={{color:'black'}}>Received</Text>
        </View>
        
            <Text style={{color:'black', paddingLeft:50, marginTop:-30}}>Item Name</Text>
            <Text style={{color:'black', paddingLeft:50}}>Quantity</Text>
        
        
            

    </View>
  )
}

export default Orderstate

const styles = StyleSheet.create({
  background: {
      flex: 1,
      justifyContent: "flex-end",
  },
});

