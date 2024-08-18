// navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/Home/Home';
import Progress from '../pages/Progress/Progress';
import Profile from '../pages/Profile/Profile';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const HomeWrapper = (props) => {
  return <Home {...props} userid={props.route.params.userid}/>;
};

const HomeTabNavigator = ({ props, userid }) => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: 'blue',
      tabBarStyle: [{ display: 'flex' }]
    }}
  >
     <Tab.Screen
      name="Home"
      // component={Progress}
      initialParams={props}
      children={(props) => <Home {...props} userid={userid} />}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Progress"
      // component={Progress}
      // initialParams={{ userid }}
      children={(props) => <Progress {...props} userid={userid} />}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="trending-up" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      // component={Profile}
      children={(props) => <Profile {...props} userid={userid} />}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);


export { HomeTabNavigator };
