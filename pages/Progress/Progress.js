// components/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { getCategoryLogData, getAnswerLogCountData, getCategoryList } from '../../firebaseConfig'
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import dayjs from 'dayjs';

const screenWidth = Dimensions.get('window').width;

const ProgressPage = ({ userid }) => {
  const [data, setData] = useState([]);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [categoriesLog, setCategoriesLog] = useState([]);
  const [categoryCompletion, setCategoryCompletion] = useState({});
  const [categories, setCategories] = useState([]);

  console.log('progress userid', userid)


  useEffect(() => {
    if (userid) {
      const fetchAnswerLogData = async () => {
        try {
          const answerLogData = await getAnswerLogCountData(userid);
          setData(answerLogData);

          const streak = calculateDailyStreak(answerLogData);
          setDailyStreak(streak);

          const categoryLogData = await getCategoryLogData(userid);
          console.log('categoryLogData', categoryLogData);
          setCategoriesLog(categoryLogData);

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


          console.log('Category Map:', categoryMap);
          console.log('Category Completion:', completionMap);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchAnswerLogData();
      console.log(categoryCompletion)
    }
    }, [userid]);

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
        // yAxisLabel=""
        // yAxisSuffix=""
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
          xAxis: {
            max: 31,
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

      {/* <View style={styles.categoriesContainer}>
        {categoriesLog.map((category) => {
          const { categoryName, correctQuestionCount } = category;
          // Assuming a fixed number of total questions for simplicity; adjust as needed
          const totalQuestions = 10; // Example total questions, adjust accordingly
          const percentageCompleted = totalQuestions === 0 ? 0 : (correctQuestionCount / totalQuestions) * 100;
          return (
            <TouchableOpacity key={categoryName} style={styles.categoryButton}>
              <Text style={styles.categoryText}>{categoryName}</Text>
              <Text style={styles.percentageText}>{percentageCompleted.toFixed(2)}% Completed</Text>
            </TouchableOpacity>
          );
        })}
      </View> */}

<View style={styles.categoriesContainer}>
        {categories.map((category) => {
          const completionPercentage = categoryCompletion[category.category_id] || 0;
          return (
            <TouchableOpacity key={category.category_id} style={styles.categoryButton}>
              <Text style={styles.categoryText}>{category.category_name}</Text>
              <Text style={styles.percentageText}>{completionPercentage.toFixed(2)}% Completed</Text>
            </TouchableOpacity>
          );
        })}
      </View>
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

export default ProgressPage;
