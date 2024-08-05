// components/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { getAnswerLogData, getAnswerLogCountData } from '../../firebaseConfig'
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const ProgressPage = ({ userid }) => {
  const [answerLog, setAnswerLog] = useState([]);
  const [data, setData] = useState([]);

  console.log('progress userid', userid)
  useEffect(() => {
    if (userid) {
     
      const fetchAnswerLogData = async () => {
        const answerLogData = await getAnswerLogCountData(userid);
        // setAnswerLog(data);
        setData(answerLogData);
        console.log('answerlog', answerLogData)
      };
      
      fetchAnswerLogData();
    }
  }, [userid]);

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
      <Text style={styles.title}>This is the Progress Page</Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: correctData,
              color: (opacity = 1) => `rgba(144, 238, 144, ${opacity})`, // optional
              strokeWidth: 2 // optional
            },
            {
              data: totalData,
              color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, // optional
              strokeWidth: 2 // optional
            },
          ],
          legend: ["Correct Answers", "Total Answers"] // optional
        }}
        width={screenWidth} // from react-native
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#00AEEF',
          backgroundGradientTo: '#00AEEF',
          decimalPlaces: 0, // optional, defaults to 2dp
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
});

export default ProgressPage;
