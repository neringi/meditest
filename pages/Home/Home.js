// // HomeScreen.js
// import React from 'react';
// import { View, Text, TouchableOpacity, Button, StatusBar, StyleSheet } from 'react-native';

// export default function HomeScreen({ route, navigation }) {
//   const { userid } = route.params;

//   // const getData = async () => {
//   //   try{
//   //     console.log("userid: ",userid)
//   //     const docRef = doc(db, "users", userid);
//   //     const docSnap = await getDoc(docRef);

//   //     if (docSnap.exists()) {
//   //       console.log("Document data:", docSnap.data());
//   //     } else {
//   //       // docSnap.data() will be undefined in this case
//   //       console.log("No such document!");
//   //     }
//   //   } catch(err){
//   //     console.error(err);
//   //   }
//   // }
//   // const handleLogout = () => {
//   //   logout()
//   //   setLoggedIn(false)
//   //   navigation.navigate('Login');
//   // };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.homeButton}>
//         <Text style={styles.homeButtonText}>Hi you're logged in, {userid}!</Text>
//       </TouchableOpacity>
//       {/* <Button title="get data" onPress={getData} /> */}
//       <Button title="Sign out" onPress={handleLogout} />
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   homeButton: {
//     backgroundColor: '#DDDDDD',
//     padding: 10,
//     marginBottom: 20,
//   },
//   homeButtonText: {
//     fontSize: 18,
//   },
// });
