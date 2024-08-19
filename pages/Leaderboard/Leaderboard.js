// components/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { getLeaderboardData} from '../../firebaseConfig'

export default function Leaderboard ({ navigation, userid }) {
  const [weeklyData, setWeeklyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);

    // console.log('leaderboard userid', userid)

    useEffect(() => {
      let ignore = false
        const fetchLeaderboardData = async () => {
            const { weeklyLeaderboard, dailyLeaderboard } = await getLeaderboardData();
            if (!ignore){
              setWeeklyData(weeklyLeaderboard);
              setDailyData(dailyLeaderboard);
            }
          };
    
        fetchLeaderboardData();
        return () => {ignore = true}
      }, [userid, weeklyData, dailyData]);

    // console.log('weekly leaderboard: ', weeklyData);
    // console.log('daily leaderboard: ', dailyData);


    const getTopTen = (data) => data.slice(0, 10);
    
    const renderItem = ({ item, index }) => (
        <View style={styles.item}>
          <View style={styles.rankIcon}>
            {index === 0 && <Icon name="trophy" size={24} color="gold" />}
            {index === 1 && <Icon name="trophy" size={24} color="silver" />}
            {index === 2 && <Icon name="trophy" size={24} color="#cd7f32" />}
            {index > 2 && <Text style={styles.rankNumber}>{index + 1}</Text>}
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        </View>
      );
    
      return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Icon name="trophy" size={24} color="gold" style={styles.titleIcon} />
                <Icon name="trophy" size={24} color="gold" style={styles.titleIcon} />
                <Icon name="trophy" size={24} color="gold" style={styles.titleIcon} />
                <Text style={styles.title}> Leaderboard </Text>
                <Icon name="trophy" size={24} color="gold" style={styles.titleIcon} />
                <Icon name="trophy" size={24} color="gold" style={styles.titleIcon} />
                <Icon name="trophy" size={24} color="gold" style={styles.titleIcon} />
            </View>
          <FlatList
            data={getTopTen(dailyData)}
            renderItem={renderItem}
            keyExtractor={(item, index) => `daily-${index}`}
            ListHeaderComponent={<Text style={styles.subtitle}>Today's Top 10 Correct Answers</Text>}
            ListEmptyComponent={<Text style={styles.emptyText}>No daily leaderboard data available</Text>}
          />
          <FlatList
            data={getTopTen(weeklyData)}
            renderItem={renderItem}
            keyExtractor={(item, index) => `weekly-${index}`}
            ListHeaderComponent={<Text style={styles.subtitle}>Weekly Top 10 Correct Answers</Text>}
            ListEmptyComponent={<Text style={styles.emptyText}>No weekly leaderboard data available</Text>}
          />
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E0F7FA',
      },
      titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', 
        marginVertical: 30, 
      },
      title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginHorizontal: 20, 
        color: '#4a90e2',
        textShadowColor: '#d0d0d0',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
      },
      subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#4a90e2',
      },
      item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 5,
      },
      rankIcon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
      },
      rankNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
      },
      infoContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      name: {
        fontSize: 16,
        flex: 1,
      },
      score: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
      },
      emptyText: {
        textAlign: 'center',
        color: '#999',
        marginVertical: 20,
      },
    });