// // HomeScreen.js
import React, { useEffect, useState }  from 'react';
import { View, Text, TouchableOpacity, Button, StatusBar, StyleSheet } from 'react-native';
import { logout } from '../../auth_google.js';
import * as Progress from 'react-native-progress';
import { getUserExperience } from '../../firebaseConfig.js';
import { Dimensions } from 'react-native';

const calculateTotalExperienceForLevel = (level) => {
  return Math.floor(100 * Math.pow(1.2, level - 1));
};


export default function Home({ route, navigation, loggedIn, userid }) {

  // console.log('HOME USERID:', userid)

  const [experience, setExperience] = useState(0);
  const [level, setLevel] = useState(1);
  const [experienceToNextLevel, setExperienceToNextLevel] = useState(100);
  const [categoryId, setCategoryId] = useState('');
  

  useEffect(() => {
    console.log('use effect home')
    if (!userid) {
      console.log('UserID is not available.');
      return;
    } else {
      console.log("USERID:", userid);
    }

    const fetchUserData = async () => {
      try {
        const userExperience = await getUserExperience(userid);
        if (userExperience) {
          const userLevel = userExperience.level || 1;
          const userExperiencePoints = userExperience.currentExperience || 0;
  
          setExperience(userExperiencePoints);
          setLevel(userLevel);
          setExperienceToNextLevel(calculateTotalExperienceForLevel(userLevel));
        } else {
          console.error('No user experience data found.');
        }
      } 
      catch (err) {
        console.error('Error fetching user experience:', err);
      }
    };

    fetchUserData();
  }, [userid, experience, level, experienceToNextLevel]);


  useEffect(() => {
    // console.log('useEffect triggered with categoryId:', categoryId);
    if (categoryId) {
      // console.log('category:', categoryId);
      navigation.navigate('Quiz', { categoryId: categoryId });
    }
  }, [categoryId, navigation]);

  const handleLogout = () => {
    logout()
    .then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });  
    })
    .catch(error => {
      console.error("Logout failed: ", error);
    });
  };


  const navigateToQuiz = (categoryId) => {
    // console.log("quiz starting...")
    // console.log('setting categoryid', categoryId)
    setCategoryId(categoryId);
    // console.log(categoryId)
    navigation.navigate('Quiz', { categoryId: categoryId});
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#45AEE4" />
      <View style={styles.topBar}>
        <View style={styles.infoContainer}>
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Level: {level}</Text>
          </View>
          <View style={styles.experienceContainer}>
            <Text style={styles.experienceText}>
              EXP: {experience}/{experienceToNextLevel}
            </Text>
            <Progress.Bar
              progress={experience / experienceToNextLevel}
              width={Dimensions.get('window').width - 280}
              height={10}
              color="#00aeef"
              borderRadius={10}
              style={styles.progressBar}
            />
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

    <View style={styles.categoryContainer}>
      {/* SURGERY COMMON TERMS EASY*/}
      <TouchableOpacity
        style={styles.category}
        onPress={() => navigateToQuiz('SE')}
      >
        <Text style={styles.categoryTitle}>Easy Surgery Terms</Text>
      </TouchableOpacity>

      {/* SURGERY COMMON TERMS MEDIUM AND DIFFICULT*/}
      <TouchableOpacity
        style={styles.category}
        onPress={() => navigateToQuiz('S')}
      >
        <Text style={styles.categoryTitle}>Surgery Terms</Text>
      </TouchableOpacity>

      {/* EASY ABBREVIATIONS */}
      <TouchableOpacity
        style={styles.category}
        onPress={() => navigateToQuiz('EA')}
      >
        <Text style={styles.categoryTitle}>Easy Abbreviations</Text>
      </TouchableOpacity>

       {/* MEDIUM ABBREVIATIONS */}
       <TouchableOpacity
        style={styles.category}
        onPress={() => navigateToQuiz('MA')}
      >
        <Text style={styles.categoryTitle}> Abbreviations</Text>
      </TouchableOpacity>

      {/* DIFFICULT ABBREVIATIONS */}
      <TouchableOpacity
        style={styles.category}
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
    justifyContent: 'flex-start',
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
    paddingTop: 20, 
    paddingBottom: 20, 
    backgroundColor: '#E0F7FA',
    borderBottomWidth: 1,
    borderBottomColor: '#45AEE4',
  },
  infoContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },

  levelContainer: {
    backgroundColor: '#45AEE4', 
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  levelText: {
    fontSize: 14, 
    fontWeight: 'bold',
    color: '#FFFFFF', 
  },
  experienceContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 15,
  },
  progressBar: {
    marginTop: 5,
  },
  experienceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000', 
  },
  logoutButton: {
    right: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#d9534f', 
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