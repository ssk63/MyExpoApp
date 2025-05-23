import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import CustomDrawerContent from './components/CustomDrawerContent';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Drawer = createDrawerNavigator();

export default function AppNavigation() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Login" component={LoginScreen} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="Register" component={RegisterScreen} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ drawerItemStyle: { display: 'none' } }} />
    </Drawer.Navigator>
  );
} 