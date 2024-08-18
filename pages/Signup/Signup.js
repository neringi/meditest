import React, { useState } from 'react';
import { StatusBar, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { register } from '../../auth_google.js';

export default function SignupPage({ navigation, loggedIn, setLoggedIn, userid }) {
  const [username, setUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  

  const navigateToHome = (userid = userid) => {
    // console.log("logging in: ", user)
    navigation.navigate('Home', { userid: userid });
  }

  
  const handleSignUp = async () => {

    // console.log('loggedin?',loggedIn)
    // console.log('creating a user')
    await register(username, signupEmail, signupPassword)
    setLoggedIn(true)
    navigateToHome(userid)
    // Alert.alert('Sign Up Successful', `Welcome, ${username}!`);
    
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up for New Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={signupEmail}
        onChangeText={setSignupEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={signupPassword}
        onChangeText={setSignupPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  signupButton: {
    backgroundColor: 'blue',
    padding: 10,
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
  },
});