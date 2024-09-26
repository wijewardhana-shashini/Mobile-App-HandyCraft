import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const AppRouter = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen
          component={Dashboard}
          options={{ headerShown: false }}
          name="Dashboard"
        />
        <Stack.Screen
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
          name="ForgotPasswordScreen"
        />

        <Stack.Screen component={Register} name="Register" />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppRouter;
