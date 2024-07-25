// TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/Home/Home';
import Progress from '../pages/Progress/Progress';
import Profile from '../pages/Profile/Profile';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button, StyleSheet, Text, View } from 'react-native';

const Tab = createBottomTabNavigator();

// const TabNavigator = () => {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Home" component={HomePage} />
//       <Tab.Screen name="Progress" component={ProgressPage} />
//       <Tab.Screen name="Profile" component={ProfilePage} />
//     </Tab.Navigator>
//   );
// };

// export default TabNavigator;


const TabNavigator = () => {
    return (

      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'blue', 
          tabBarStyle:[{
            "display": "flex"
          }]
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Progress"
          component={Progress}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="trending-up" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>

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

  export default TabNavigator;