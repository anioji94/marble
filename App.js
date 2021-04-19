import React from 'react';
import { FlatList, KeyboardAvoidingView, Image, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MarbleInput from './components/MarbleInput'
import Marble from './components/Marble'
import Login from './components/login';
import Signup from './components/signup';
import Dashboard from './components/dashboard';
import About from './components/About'

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#3740FE',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      {/* <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ title: 'Signup' }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={
          {title: 'Login'},
          {headerLeft: null}
        }
      /> */}
      <Stack.Screen
       name="Dashboard"
       component={Dashboard}
       options={
         { title: 'Dashboard' },
         {headerLeft: null}
       }
      />
      <Stack.Screen 
      name='About'
      component={About}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
