import { StatusBar } from 'expo-status-bar';
import { TextInput, Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import { register, login, logout } from './auth_google.js';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, auth } from './firebaseConfig.js'
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigator from './navigation/StackNavigator';
import Home from './pages/Home/Home';
import LoginPage from './pages/Login/Login';
import SignupPage from './pages/Signup/Signup';


// import * as RootNavigation from './RootNavigation.js';

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
        console.log("USER FOUND", userFound)
        if (userFound) {
          const result = await AsyncStorage.getItem(userFound);
          const user = JSON.parse(result);
          if (user.uid) {
            console.log("LOGGED IN")
            setLoggedIn(true);
            setUserId(user.uid);
          }
        }
        // console.log("_______KEYS");
        // console.log(keys);
        // const result = await AsyncStorage.multiGet(keys);
        // console.log("_______");
        // console.log(result);
        // return result.map(req => JSON.parsex(req)).forEach(console.log);
      } catch (error) {
        console.error(error);
      }
    };
    importData();
    console.log(userid)
  }, []);


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
  }, []);

    return (
      <NavigationContainer>
        <StackNavigator loggedIn={loggedIn} setLoggedIn={setLoggedIn} userid={userid} />
      </NavigationContainer>
    );

  }


  // const handleLogin = async () => {
  //       // console.log('Email:', email);
  //       // console.log('Password:', password);
  //       try{
  //         // const user = await login(email,password)
  //         console.log('User logged in:')
          
          // if (user !== undefined) {
          //   setLoggedIn(true)
          //   setUserId(user.uid)
          //   // navigation.navigate('HomeScreen', { userid });
          // }
  //       } catch(err){
  //         console.error(err);
  //       }
  // };

  // const handleLogout = () => {
  //   console.log('logging out')
  //   // logout()
  //   // setLoggedIn(false)
  // };

  

// // console.log('db', db)

// export default function App({ }) {
//   const [loggedIn, setLoggedIn] = useState(false)
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [username, setUsername] = useState('');
//   const [userid, setUserId] = useState('');

//   const navigation = useNavigation();
//   // const [signupEmail, setSignupEmail] = useState('');
//   // const [signupPassword, setSignupPassword] = useState('');


//   const getData = async () => {
//     try{
//       console.log("userid: ",userid)
//       const docRef = doc(db, "users", userid);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         console.log("Document data:", docSnap.data());
//       } else {
//         // docSnap.data() will be undefined in this case
//         console.log("No such document!");
//       }
//     } catch(err){
//       console.error(err);
//     }
//   }


//   const handleLogin = async () => {
//     // console.log('Email:', email);
//     // console.log('Password:', password);
//     try{
//       const user = await login(email,password)
//       console.log('User logged in:', user)
      
//       if (user !== undefined) {
//         setLoggedIn(true)
//         setUserId(user.uid)
//         // navigation.navigate('HomeScreen', { userid });
//       }
//     } catch(err){
//       console.error(err);
//     }
//   };

//   const handleLogout = () => {

//     logout()
//     setLoggedIn(false)
//   };

//   const handleSignUp = async () => {
//     console.log('creating a user')
//     console.log('username', username)
//     console.log('email', signupEmail)
//     console.log('password', signupPassword)
//     await register(username, signupEmail, signupPassword)
//     setLoggedIn(false)
//   };

//   const importData = async () => {
//     try {
//       const keys = await AsyncStorage.getAllKeys();
//       const userFound = keys.find(item => item.includes("firebase:authUser:"));
//       if (userFound) {
//         const result = await AsyncStorage.getItem(userFound);
//         const user = JSON.parse(result)
//         if (user.uid){
//           setLoggedIn(true)
//           setUserId(user.uid)
//         }
//       }
//       console.log("_______KEYS")
//       console.log(keys)
//       const result = await AsyncStorage.multiGet(keys);
//       console.log("_______")
//       console.log(result)
//       // return result.map(req => JSON.parsex(req)).forEach(console.log);
//     } catch (error) {
//       console.error(error)
//     }
//   }
//   useEffect(() => {
    
//     importData()
//  },[])

//  if (loggedIn){
//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//           style={styles.homeButton}
//           // onPress={() => navigation.navigate('LoginPage')}
//         >
//           <Text style={styles.homeButtonText}>
//              Hi you're logged in, {userid}!
//           </Text>
          

//         </TouchableOpacity>
//         <Button
//         title="get data"
//         onPress={getData}
//         />
        

//         <Button
//         title="Sign out"
//         onPress={handleLogout}
//         />
//       <StatusBar style="auto" />
//     </View>
//   );
// }
// else{
//   return (
      
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Sign in</Text>
//       </TouchableOpacity>
//       <StatusBar style="auto" />

//       <TouchableOpacity onPress={() => navigation.navigate('Signup', { userName: username })}>
//         <Text style={styles.linkText}>Haven't got an account? <Text style={styles.link}>Sign up</Text></Text>
//       </TouchableOpacity>
//       <StatusBar style="auto" />
      
//     </View>
//   );
// }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
