// // LoginPage.js
// import React, { useState } from 'react';
// import { View, Text, Button, TextInput } from 'react-native';
// import { register, login, logout } from './auth_google.js';

// export default function LoginPage({ navigation }) {
//   const [userid, setUserid] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
//     try{
//         const user = await login(email,password)
//         console.log('User logged in:', user)
        
//         if (user !== undefined) {
//           setLoggedIn(true)
//           setUserid(user.uid)
//           navigation.navigate('Home', { userid });
//         }
//       } catch(err){
//         console.error(err);
//       }
    
//   };

//   return (
//     <View>
//       <TextInput placeholder="User ID" value={userid} onChangeText={setUserid} />
//       <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
//       <Button title="Login" onPress={handleLogin} />
//     </View>
//   );
// }
