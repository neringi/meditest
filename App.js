import { StatusBar } from 'expo-status-bar';
import { TextInput, Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import { register, login, logout } from './auth_google.js';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, auth } from './firebaseConfig.js';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigator from './navigation/StackNavigator';

const Stack = createStackNavigator();



export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userid, setUserId] = useState('');

  useEffect(() => {
    const importData = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const userFound = keys.find((item) =>
          item.includes("firebase:authUser:")
        );
        // console.log("USER FOUND", userFound)
        if (userFound) {
          const result = await AsyncStorage.getItem(userFound);
          const user = JSON.parse(result);
          if (user.uid) {
            console.log("LOGGED IN")
            setLoggedIn(true);
            setUserId(user.uid);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    importData();
    console.log(userid)
  }, [loggedIn, userid]);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        console.log('User is authenticated:', user.uid);
        setLoggedIn(true);
        setUserId(user.uid);
      } else {
        console.log('User is not authenticated');
        setLoggedIn(false);
        setUserId('');
      }
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [loggedIn, userid]);

    return (
      <NavigationContainer>
        <StackNavigator loggedIn={loggedIn} setLoggedIn={setLoggedIn} userid={userid} />
      </NavigationContainer>
    );

  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
