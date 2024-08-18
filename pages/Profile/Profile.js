import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Switch, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import { getUserExperience, getCategoryLogData, getCategoryList, updateUserConsent } from '../../firebaseConfig'; 
import { logout } from '../../auth_google.js';


const screenWidth = Dimensions.get('window').width;

const calculateTotalExperienceForLevel = (level) => {
  return Math.floor(100 * Math.pow(1.2, level - 1));
};

const ProfilePage = ({ navigation, userid }) => {
  const [experience, setExperience] = useState(0);
  const [level, setLevel] = useState(1);
  const [experienceToNextLevel, setExperienceToNextLevel] = useState(100);
  const [dataConsent, setDataConsent] = useState(false); 
  const [showConsentText, setShowConsentText] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryCompletion, setCategoryCompletion] = useState({});


  console.log('PROFILE USERID ',userid );
  
  useEffect(() => {
    if (userid) {
      const fetchUserData = async () => {
        try {
          const userExperience = await getUserExperience(userid);
          if (userExperience) {
            const userLevel = userExperience.level || 1;
            const userExperiencePoints = userExperience.currentExperience || 0;
  
            setExperience(userExperiencePoints);
            setLevel(userLevel);
            setExperienceToNextLevel(calculateTotalExperienceForLevel(userLevel));
          }

          // Fetch category data
          const categoryLogData = await getCategoryLogData(userid);
          const allCategories = await getCategoryList();
          setCategories(allCategories);

          // Map categories to a dictionary for easy lookup
          const categoryMap = allCategories.reduce((acc, category) => {
            acc[category.category_id] = {
              name: category.category_name,
              totalQuestions: category.totalQuestions,
            };
            return acc;
          }, {});

          // Calculate the completion percentage for each category
          const completionMap = allCategories.reduce((acc, category) => {
            const categoryInfo = categoryLogData.find(cat => cat.category_id === category.category_id);
            const totalQuestions = category.totalQuestions;
            const completedQuestions = categoryInfo ? categoryInfo.correctQuestionCount : 0;
            const percentageCompleted = totalQuestions === 0 ? 0 : (completedQuestions / totalQuestions) * 100;
            acc[category.category_id] = percentageCompleted;
            return acc;
          }, {});

          setCategoryCompletion(completionMap);
        } catch (error) {
          console.error('Error fetching user or category data:', error);
        }
      };

      fetchUserData();
    }
  }, [userid]);

  const navigateToLeaderboard = () => {
    navigation.navigate('Leaderboard');
  };

  const handleLogout = () => {
    logout()
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        }); // Navigate to login screen with reset
      })
      .catch(error => {
        console.error("Logout failed: ", error);
      });
  };

  const handleDataConsentToggle = async () => {
    const newConsentValue = !dataConsent;
    setDataConsent(newConsentValue);
  
    try {
      // Update the user's document in Firebase
      await updateUserConsent(userid, newConsentValue ? 1 : 0);
    } catch (error) {
      console.error('Error updating data consent:', error);
    }
  };
  

  const toggleConsentText = () => {
    setShowConsentText(prevState => !prevState);
  };

  const getColorForPercentage = (percentage) => {
    percentage = Math.max(0, Math.min(100, percentage));
  
    // Define color gradients
    const startColor = [255, 160, 160]; // Pale red
    const endColor = [144, 238, 144];   // Light green
  
    // Interpolate between startColor and endColor based on percentage
    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * (percentage / 100));
    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * (percentage / 100));
    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * (percentage / 100));
  
    return `rgb(${r}, ${g}, ${b})`;
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        <View style={styles.topRightContainer}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')} style={styles.leaderboardButton}>
        <Icon name="trophy-outline" size={20} color="#fff" />
        <Text style={styles.leaderboardButtonText}>Leaderboard</Text>
      </TouchableOpacity>

      <View style={styles.consentBox}>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>DATA CONSENT</Text>
          <TouchableOpacity onPress={toggleConsentText} style={styles.infoButton}>
            <Icon name="information-circle-outline" size={20} color="#000" />
          </TouchableOpacity>
          <Switch
            value={dataConsent}
            onValueChange={handleDataConsentToggle}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={dataConsent ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            style={styles.switch}
          />
          <Text style={styles.switchStatus}>{dataConsent ? 'ON' : 'OFF'}</Text>
        </View>
        {showConsentText && (
          <Text style={styles.consentText}>
            I consent to my gameplay data to be anonymously collected and used to review and improve the app. I understand I can withdraw my consent at any time by returning to Profile page and toggling Data consent button to be Off
          </Text>
        )}
      </View>

      <View style={styles.categoriesContainer}>
        {categories.map((category) => {
          const completionPercentage = categoryCompletion[category.category_id] || 0;
          const color = getColorForPercentage(completionPercentage);
          return (
            <TouchableOpacity
              key={category.category_id}
              style={[styles.categoryButton, { backgroundColor: color }]}
            >
              <Text style={styles.categoryText}>{category.category_name}</Text>
              <Text style={styles.percentageText}>{completionPercentage.toFixed(2)}% Completed</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  experienceContainer: {
    marginLeft: 15,
    alignItems: 'flex-start',
  },
  progressBar: {
    marginTop: 5,
  },
  experienceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  topRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
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
  leaderboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00AEEF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  leaderboardButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  consentBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    padding: 15,
    marginTop: 20,
    alignSelf: 'center',
    width: '90%',
    maxWidth: 600,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    marginRight: 10,
  },
  switchStatus: {
    fontSize: 16,
    color: '#000',
  },
  infoButton: {
    marginHorizontal: 10,
  },
  switch: {
    marginHorizontal: 10,
  },
  consentText: {
    fontSize: 14,
    color: '#000',
    marginTop: 10,
  },
  categoriesContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  categoryButton: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  percentageText: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfilePage;