// // HomeScreen.js
import React, { useEffect, useState }  from 'react';
import { View, Text, TouchableOpacity, Button, StatusBar, StyleSheet } from 'react-native';
import { logout } from '../../auth_google.js';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../firebaseConfig.js';
import * as Progress from 'react-native-progress';





export default function Home({ route, navigation, loggedIn, setLoggedIn }) {
  const { userid } = route.params;
  const [experience, setExperience] = useState(0);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    const getUserData = async () => {
      try{
        console.log("userid: ",userid)
        const docRef = doc(db, "users", userid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // console.log("Document data:", data);
          const experience = data.experience;
          const level = data.level;
          // console.log("Experience:", experience);
          // console.log("Level:", level);
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      } catch(err){
        console.error(err);
      }
    };
  getUserData();
  }, [userid]);

  const handleLogout = () => {
    logout()
    setLoggedIn(false)
    navigation.navigate('Login');
  };


  const navigateToQuiz = (categoryId) => {
    console.log("quiz starting...")
    navigation.navigate('Quiz', { categoryId: categoryId});
  }

  const expToNextLevel = 100; 
  const progress = experience / expToNextLevel;

  
  return (
    // <View style={styles.container}>
    //   <TouchableOpacity style={styles.homeButton}>
    //     <Text style={styles.homeButtonText}>Hi you're logged in, {userid}!</Text>
    //   </TouchableOpacity>
    //   {/* <Button title="get data" onPress={getUserData} /> */}
    //   <Button title="Sign out" onPress={handleLogout} />
    //   <StatusBar style="auto" />
    // </View>
  <View>
    <View style={styles.container}>
      <View style={styles.topBar}>
          <Text style={styles.levelText}>{level}</Text>
          
          {/* Parent view for progress bar and text */}
          <View style={styles.progressBarContainer}>
            <Progress.Bar 
              progress={progress} 
              width={200} 
              color="blue" 
              borderWidth={2} 
              borderColor="#00aeef" 
              unfilledColor="#ADE9FF" 
            />
            <Text style={styles.progressText}>{(progress * 100).toFixed(0)}%</Text>
          </View>
          
          <Text style={styles.nextLevelText}>{level + 1}</Text>
      </View>
        <Text style={styles.expText}>{expToNextLevel - experience} exp until level {level + 1}</Text>
        {/* <TouchableOpacity style={styles.homeButton}>
          <Text style={styles.homeButtonText}>Hi, you're logged in, {userid}!</Text>
          <Button title="Sign out" onPress={handleLogout} />
          <StatusBar style="auto" />
        </TouchableOpacity> */}
    </View>

  <View style={styles.container}>
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

      {/* ABBREVIATIONS */}
      <TouchableOpacity
        style={styles.category}
        // onPress={() => navigation.navigate('Quiz', {category: 'A'})}
        onPress={() => navigateToQuiz('A')}
      >
        <Text style={styles.categoryTitle}>Abbreviations</Text>
      </TouchableOpacity>

    </View>
  </View>
</View>

);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  levelText: {
    fontSize: 18,
    width: 40,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  expText: {
    fontSize: 14,
    marginVertical: 15,
    textAlign: 'center',
  },
  progressBarContainer: {
    position: 'relative',
    width: 200,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    position: 'absolute',
    fontSize: 12,
    color: 'black',
  },
  homeButton: {
    backgroundColor: 'blue',
    padding: 10,
    marginTop: 10,
  },
  homeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
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