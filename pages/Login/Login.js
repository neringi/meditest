// // LoginPage.js
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Button, TextInput } from 'react-native';
import { login } from '../../auth_google.js';
import { useNavigation } from '@react-navigation/native';

export default function LoginPage({ navigation, loggedIn, setLoggedIn }) {
  const [userid, setUserid] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  console.log(loggedIn)

  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  const navigateToHome = (user = user) => {
    console.log("logging in: ", user)
    navigation.navigate('Home', { userid: user.uid });
  }

  const resetPassword = () => {
    console.log('resetting password...')
  }

  const handleLogin = async () => {
    try{
        const user = await login(email,password)
        console.log('User logged in:', user)
        
        if (user !== undefined) {
          setLoggedIn(true)
          setUserid(user.uid)
          navigateToHome(user)
          
        }
      } catch(err){
        console.error(err);
      }
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupButton} onPress={navigateToSignup}>
        <Text style={styles.signupButtonText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupButton} onPress={resetPassword}>
        <Text style={styles.signupButtonText}>Forgotten Password? Reset COMING SOON</Text>
      </TouchableOpacity>
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
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  signupButton: {
    marginTop: 20,
  },
  signupButtonText: {
    color: 'blue',
    fontSize: 16,
  },
});
