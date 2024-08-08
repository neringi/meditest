// // HomeScreen.js
import React, { useEffect, useState }  from 'react';
import { View, Text, TouchableOpacity, Button, StatusBar, StyleSheet } from 'react-native';
import { logout } from '../../auth_google.js';
import { doc, getDoc } from "firebase/firestore";
import { db, updateUserExperience } from '../../firebaseConfig.js';
import * as Progress from 'react-native-progress';
import { setUserId } from 'firebase/analytics';





export default function Home({ route, navigation, loggedIn }) {
  console.log("HOME", loggedIn)
  console.log("route", route)
  
  const { userid } = route.params;

  console.log('useriduserid at home page',userid)
  // const [experience, setExperience] = useState(0);
  // const [level, setLevel] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  

  // useEffect(() => {
  //   console.log("userid in useEffect:", userid);
  //   const getUserData = async () => {
  //     try{
  //       console.log("userid: ",userid)
  //       const docRef = doc(db, "users", userid);
  //       const docSnap = await getDoc(docRef);

  //       if (docSnap.exists()) {
  //         const data = docSnap.data();
  //         // console.log("Document data:", data);
  //         const experience = data.experience;
  //         const level = data.level;
  //         console.log("Experience:", experience);
  //         console.log("Level:", level);
  //       } else {
  //         // docSnap.data() will be undefined in this case
  //         console.log("No such document!");
  //       }
  //     } catch(err){
  //       console.error(err);
  //     }
  //   };
  // getUserData();
  // }, [userid]);



  useEffect(() => {
    console.log('useEffect triggered with categoryId:', categoryId);
    if (categoryId) {
      console.log('category:', categoryId);
      navigation.navigate('Quiz', { categoryId: categoryId });
    }
  }, [categoryId, navigation]);

  const handleLogout = () => {
    logout()
    .then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });  // Navigate to login screen with reset
    })
    .catch(error => {
      console.error("Logout failed: ", error);
    });
  };


  const navigateToQuiz = (categoryId) => {
    console.log("quiz starting...")
    console.log('setting categoryid', categoryId)
    setCategoryId(categoryId);
    console.log(categoryId)
    navigation.navigate('Quiz', { categoryId: categoryId});
  }

  // const expToNextLevel = 100; 
  // const progress = experience / expToNextLevel;

  
  return (
    // <View style={styles.container}>
    //   <TouchableOpacity style={styles.homeButton}>
    //     <Text style={styles.homeButtonText}>Hi you're logged in, {userid}!</Text>
    //   </TouchableOpacity>
    //   {/* <Button title="get data" onPress={getUserData} /> */}
    //   <Button title="Sign out" onPress={handleLogout} />
    //   <StatusBar style="auto" />
    // </View>
  <View style={styles.container}>


  
    <View style={styles.topBar}>
          <Text style={styles.levelText}>Level: 1</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
    </View>


    <View style={styles.categoryContainer}>
      {/* SURGERY COMMON TERMS EASY*/}
      <TouchableOpacity
        style={styles.category}
        // onPress={() => navigation.navigate('Quiz', {category_id: 'SE'})}
        onPress={() => navigateToQuiz('SE')}
      >
        <Text style={styles.categoryTitle}>Easy Surgery Terms</Text>
      </TouchableOpacity>

      {/* SURGERY COMMON TERMS MEDIUM AND DIFFICULT*/}
      <TouchableOpacity
        style={styles.category}
        // onPress={() => navigation.navigate('Quiz', {category: 'S'})}
        onPress={() => navigateToQuiz('S')}
      >
        <Text style={styles.categoryTitle}>Surgery Terms</Text>
      </TouchableOpacity>

      {/* EASY ABBREVIATIONS */}
      <TouchableOpacity
        style={styles.category}
        // onPress={() => navigation.navigate('Quiz', {category: 'A'})}
        onPress={() => navigateToQuiz('EA')}
      >
        <Text style={styles.categoryTitle}>Easy Abbreviations</Text>
      </TouchableOpacity>

       {/* MEDIUM ABBREVIATIONS */}
       <TouchableOpacity
        style={styles.category}
        // onPress={() => navigation.navigate('Quiz', {category: 'A'})}
        onPress={() => navigateToQuiz('MA')}
      >
        <Text style={styles.categoryTitle}> Abbreviations</Text>
      </TouchableOpacity>

      {/* DIFFICULT ABBREVIATIONS */}
      <TouchableOpacity
        style={styles.category}
        // onPress={() => navigation.navigate('Quiz', {category: 'A'})}
        onPress={() => navigateToQuiz('DA')}
      >
        <Text style={styles.categoryTitle}> Difficult Abbreviations</Text>
      </TouchableOpacity>

    </View>
</View>


);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#E0F7FA',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10, 
    paddingBottom: 10, 
  },
  logoutButton: {
    top: 10,
    right: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#d9534f',  // Bootstrap "danger" color
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  contentText: {
    marginTop: 100,
    fontSize: 18,
    color: '#333',
  },
  homeButton: {
    backgroundColor: 'blue',
    padding: 10,
    marginTop: 10,
  },
  
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  category: {
    width: 150,
    height: 150,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
  },
});