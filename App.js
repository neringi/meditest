import { StatusBar } from 'expo-status-bar';
import { TextInput, Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { register, login, logout } from './auth_google.js';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './firebaseConfig.js'
import { doc, getDoc } from "firebase/firestore";
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';

// const Stack = createStackNavigator();



// export default function App() {
//   return (
//     <NavigationContrainer>
//       <Stack.Navigator initialRouteName="Login">
//         <Stack.Screen name="Login" component={Login} />
//         <Stack.Screen name="Home" component={Home} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
// console.log('db', db)

export default function App({ }) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [userid, setUserid] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');


  const getData = async () => {
    try{
      console.log("userid: ",userid)
      const docRef = doc(db, "users", userid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    } catch(err){
      console.error(err);
    }
  }


  const handleLogin = async () => {
    // console.log('Email:', email);
    // console.log('Password:', password);
    try{
      const user = await login(email,password)
      console.log('User logged in:', user)
      
      if (user !== undefined) {
        setLoggedIn(true)
        setUserid(user.uid)
        // navigation.navigate('HomeScreen', { userid });
      }
    } catch(err){
      console.error(err);
    }
  };

  const handleLogout = () => {

    logout()
    setLoggedIn(false)
  };

  const handleSignUp = async () => {
    console.log('creating a user')
    console.log('username', username)
    console.log('email', signupEmail)
    console.log('password', signupPassword)
    await register(username, signupEmail, signupPassword)
    setLoggedIn(false)
  };

  const importData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const userFound = keys.find(item => item.includes("firebase:authUser:"));
      if (userFound) {
        const result = await AsyncStorage.getItem(userFound);
        const user = JSON.parse(result)
        if (user.uid){
          setLoggedIn(true)
          setUserid(user.uid)
        }
      }
      console.log("_______KEYS")
      console.log(keys)
      const result = await AsyncStorage.multiGet(keys);
      console.log("_______")
      console.log(result)
      // return result.map(req => JSON.parsex(req)).forEach(console.log);
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    
    importData()
 },[])

 if (loggedIn){
  return (
    <View style={styles.container}>
      <TouchableOpacity
          style={styles.homeButton}
          // onPress={() => navigation.navigate('LoginPage')}
        >
          <Text style={styles.homeButtonText}>
             Hi you're logged in, {userid}!
          </Text>
          

        </TouchableOpacity>
        <Button
        title="get data"
        onPress={getData}
        />
        

        <Button
        title="Sign out"
        onPress={handleLogout}
        />
      <StatusBar style="auto" />
    </View>
  );
}
else{
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
      <StatusBar style="auto" />

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
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
