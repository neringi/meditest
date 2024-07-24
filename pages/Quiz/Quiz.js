import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
// import { firebase } from '../../config';
import { useNavigation } from '@react-navigation/native';
// import { createTables, getQuestionsByCategory } from '../../db';
// import { syncQuestionsFromFirebase } from '../../syncService';
import { getQuizData } from '../../firebaseConfig.js'



export default function Quiz({ route  }) {
    const { categoryId } = route.params;

    const [quizData, setQuizData] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answerSubmitted, setAnswerSubmitted] = useState(false);
    const [explanation, setExplanation] = useState('');
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const data = await getQuizData(categoryId); 
                setQuizData(data);
            } catch (error) {
                console.error("Error fetching quiz data:", error);
            }
        };

        fetchQuizData(categoryId);
    }, [categoryId]);

    console.log('category at quiz:',categoryId)
    // console.log(getQuizData(categoryId))
    console.log('quizData:', quizData);


    // useEffect(() => {

    //     const fetchQuizData = async () => {
    //         try {
    //             const data = await getQuizData(categoryId); 
    //             setQuizData(data);
    //         } catch (error) {
    //             console.error("Error fetching quiz data:", error);
    //         }
    //     };
        
    //     async function loadQuestionsFromFirebase ()  {
    //       setSelectedOptions({});
    //       setShowResults(false);
    //       setCurrentQuestionIndex(0);
    //       setAnswerSubmitted(false);
    //       setScore(0);
    //       setExplanation('');
    //       const questions = await fetchQuizData(categoryId);
    //       console.log('setting questions')
    //       console.log(category)
    //       setQuestions(questions)
    //       console.log(questions)
          
    //     }
    
    //   }, []);
  
      
    return (
        <View style={styles.container}>
            <Text> Quiz lets gooo {categoryId} </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 50,
    },
});
