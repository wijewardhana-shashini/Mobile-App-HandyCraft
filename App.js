import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from "react-native-paper";
import Register from "./screens/Register";
import Dashboard from "./screens/Dashboard";
import Splash from "./screens/Splash";
import SignUpScreen from "./screens/SignUpScreen";
import SigninScreen from "./screens/SigninScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import orderstate from "./screens/orderstate";
import CandleList from "./screens/CandleList";
import OrderItem from "./screens/OrderItem";


import ForgotPassword from "./screens/Confirm/ForgotPasswordScreen/ForgotPassword";
import paymentdetails from "./screens/paymentdetails";//payment details 
import AddItemsModal from "./screens/Items/AddItemsModal";
import ViewItems from "./screens/Items/ViewModal";// view items that added by seller 
import UserDetailsScreen from "./screens/ProfileScreen";// user details screen
import HelpPage from "./screens/Help";// help screen -->side menu
import SettingsPage from "./screens/SettingPage";//setting page  --> side menu
import TermsAndPrivacyPolicyScreen from "./screens/TermsAndPrivacyPolicyScreen";//Privacy page  --> side menu

import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    //<AppRouter/>

    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            component={Splash}
            options={{ headerShown: false }}
            name="Splash"
          />
          <Stack.Screen component={SigninScreen} name="SigninScreen" />
          <Stack.Screen
            component={WelcomeScreen}
            name="WelcomeScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen component={SignUpScreen} name="SignUpScreen" />
          <Stack.Screen
            component={Dashboard}
            name="Dashboard"
            options={{ headerShown: false }}
          />
          <Stack.Screen component={CandleList} name="CandleList" />
          <Stack.Screen component={orderstate} name="orderstate" />
          <Stack.Screen component={OrderItem} name="OrderItem" />
          <Stack.Screen
            component={paymentdetails}
            name="paymentdetails"
            options={{ headerShown: false }}
          />
          <Stack.Screen component={Register} name="Register" />       
          <Stack.Screen
            component={UserDetailsScreen}
            name="UserDetailsScreen"
          />
          <Stack.Screen component={ForgotPassword} name="ForgotPassword" />

          <Stack.Screen component={ViewItems} name="ViewItems" />
          <Stack.Screen component={AddItemsModal} name="AddItemsModal" />
          <Stack.Screen component={HelpPage} name="HelpPage" />
          <Stack.Screen component={SettingsPage} name="SettingsPage" />
          <Stack.Screen component={TermsAndPrivacyPolicyScreen} name= "Terms And Privacy Policy"/>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

/// this is sample change for git
//this is conflict issue
//git add .
///git commit -am "message"
//git push origin master
//second test

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
