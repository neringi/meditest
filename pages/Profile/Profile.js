// components/ProfilePage.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfilePage = ({ navigation }) => {

  const navigateToLeaderboard = () => {
    navigation.navigate('Leaderboard');
  };

  return (
    <View style={styles.container}>
      <Text>This is the Profile Page</Text>
    

       <TouchableOpacity onPress={navigateToLeaderboard} style={styles.navigateButton}>
        <Icon name="trophy-outline" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.navigateButtonText}>Leaderboard</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigateButton: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#00AEEF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  navigateButtonText: {
    color: '#fff',
    marginLeft: 8, 
    fontSize: 16,
  },
  icon: {
    marginRight: 8, 
  },
});

export default ProfilePage;
