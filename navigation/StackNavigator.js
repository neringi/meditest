// navigation/StackNavigator.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginPage from "../pages/Login/Login";
import SignupPage from "../pages/Signup/Signup";
import HomePage from "../pages/Home/Home";
import QuizPage from "../pages/Quiz/Quiz";

const Stack = createStackNavigator();

const StackNavigator = ({ loggedIn, setLoggedIn, categoryId, userid }) => {
    console.log("stacknav", loggedIn, userid)
  return (
    <Stack.Navigator>
      {loggedIn ? (
        <>
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {(props) => (
              <HomePage
                {...props}
                loggedIn={loggedIn}
                categoryId={categoryId}
                userid={userid}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Quiz" options={{ headerShown: false }}>
            {(props) => (
              <QuizPage
                {...props}
                loggedIn={loggedIn}
                categoryId={categoryId}
                userid={userid}
              />
            )}
          </Stack.Screen>
        </>
      ) : (
        <>
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => (
              <LoginPage
                {...props}
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Signup" options={{ headerShown: false }}>
            {(props) => (
              <SignupPage
                {...props}
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
              />
            )}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
