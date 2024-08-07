// components/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { getAnswerLogData, getAnswerLogCountData } from '../../firebaseConfig'
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import dayjs from 'dayjs';

const screenWidth = Dimensions.get('window').width;

const ProgressPage = ({ userid }) => {
  const [data, setData] = useState([]);
  const [dailyStreak, setDailyStreak] = useState(0);

  console.log('progress userid', userid)
  useEffect(() => {
    if (userid) {
     
      const fetchAnswerLogData = async () => {
        const answerLogData = await getAnswerLogCountData(userid);
        // setAnswerLog(data);
        setData(answerLogData);
        console.log('answerlog', answerLogData);

        const streak = calculateDailyStreak(answerLogData);
        setDailyStreak(streak);

      };
      
      fetchAnswerLogData();
    }
  }, [userid]);


  // const calculateDailyStreak = (answerLogData) => {
  //   setDailyStreak(1);
  // };

  const calculateDailyStreak = (answerLogData) => {
    if (answerLogData.length === 0) return 0;
  
    // Sort the log data by date in descending order
    const sortedDataForStreak = [...answerLogData].sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));

  
    let streak = 1;
    let lastDate = dayjs(sortedDataForStreak[0].date);
  
    for (let i = 1; i < sortedDataForStreak.length; i++) {
      const currentDate = dayjs(sortedDataForStreak[i].date);
  
      // Check if the current date is the day before the last date
      if (currentDate.isSame(lastDate.subtract(1, 'day'), 'day')) {
        streak++;
      } else {
        break;
      }
  
      lastDate = currentDate;
    }
  
    return streak;
  };

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  

  const labels = data.map(item => item.date);
  const correctData = data.map(item => item.correct);
  const totalData = data.map(item => item.total);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Progress Page</Text>

      <View style={styles.streakContainer}>
        <Icon name="fire" size={24} color="#FF4500" />
        <Text style={styles.streakText}>Daily Streak: {dailyStreak}</Text>
      </View>

      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: correctData,
              color: (opacity = 1) => `rgba(144, 238, 144, ${opacity})`, 
              strokeWidth: 2 
            },
            {
              data: totalData,
              color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, 
              strokeWidth: 2 
            },
          ],
          legend: ["Correct Answers", "Total Answers"] 
        }}
        width={screenWidth} 
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#00AEEF',
          backgroundGradientTo: '#00AEEF',
          decimalPlaces: 0, 
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#00AEEF',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

      
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40, 
    color: '#0077b6', // Picton Blue
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  streakText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#FF4500', // Orange-red color for the flame text
  },
});

export default ProgressPage;
