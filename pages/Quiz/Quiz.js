import { Alert, Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
// import { firebase } from '../../config';
import { useNavigation } from '@react-navigation/native';
// import { createTables, getQuestionsByCategory } from '../../db';
// import { syncQuestionsFromFirebase } from '../../syncService';
import { getQuizData, updateUserExperience, addToAnswerLog } from '../../firebaseConfig.js'




export default function Quiz({ navigation, route, userid  }) {
    const { categoryId } = route.params;
    console.log('user taking quiz', userid)
    const [quizData, setQuizData] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answerSubmitted, setAnswerSubmitted] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [level, setLevel] = useState(1);


    
    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const data = await getQuizData(categoryId);                 
                setQuizData(data);
            } catch (error) {
                console.error("Error fetching quiz data:", error);
            }
        };

        fetchQuizData();
    }, [categoryId]);

    const handleOptionSelect = (option) => {
        console.log('Option:', option)
        setSelectedOptions(option)
    };

    const handleSubmitAnswer = async () => {
        
        const currentQuestion = quizData[currentQuestionIndex];
        console.log("HANDLE SUBMIT")
        console.log("Current Question:", currentQuestion);
        console.log("Selected Options:", selectedOptions);

        if (!currentQuestion) {
            console.error("Current question is undefined");
            return;
        }
    
        if (!selectedOptions) {
            console.error("Selected options is undefined");
            return;
        }

        if (selectedOptions.id === currentQuestion.correct) {
            setScore(prev => prev + 1);
            
            // Debug log for difficulty_id
            console.log('Difficulty ID:', currentQuestion.difficulty_id);


            const difficultyPoints = {
                '1': 10,
                '2': 20,
                '3': 30,
              };

            const baseExperiencePoints = difficultyPoints[currentQuestion.difficulty_id] || 0;

            console.log(baseExperiencePoints)
            const experiencePoints = hintUsed ? baseExperiencePoints / 2 : baseExperiencePoints;
            console.log(`Correct answer! Adding ${experiencePoints} experience points.`);
            
            console.log('answerlog', userid, currentQuestion.id, selectedOptions.id, 1)
            await addToAnswerLog(userid, currentQuestion.id, selectedOptions.id, 1); 
            setAnswerSubmitted(true);

            updateUserExperience(userid, experiencePoints, handleLevelUp);

            handleNextQuestion();
        } else {
            await addToAnswerLog(userid, currentQuestion.id, selectedOptions.id, 0);
            Alert.alert("Incorrect", currentQuestion.explanation,
                [{ text: "OK", onPress: () => handleNextQuestion() }]
            );
        }
        setAnswerSubmitted(true);
    };

    const handleRetakeQuiz = () => {
        setSelectedOptions({});
        setScore(0);
        setShowResults(false);
        setCurrentQuestionIndex(0);
    };

    const handleShowHint = () => {
        const currentQuestion = quizData[currentQuestionIndex];
        Alert.alert("Hint", currentQuestion.hint);
        setHintUsed(true);
    };

    const handleLevelUp = () => {
        Alert.alert("Congratulations!", "You leveled up!");
      };

    const navigateHome = () => {
        navigation.navigate('Home', { userid: userid });
    };

    const handleNextQuestion = () => {
        setSelectedOptions({})
        setAnswerSubmitted(false);
        setHintUsed(false);

        if (currentQuestionIndex < quizData.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setShowResults(true);
        }
    };

    if (quizData.length === 0) {
        return <Text>Loading...</Text>;
    }

    if (showResults) {
        return (
            <View style={styles.container}>
                <Text style={styles.resultText}>Quiz Complete!</Text>
                <Text style={styles.resultText}>Your score: {score} / {quizData.length}</Text>
                <View style={styles.buttonContainer}>
                    <View style={styles.buttonWrapper}>
                        <Button title="Try Again" onPress={handleRetakeQuiz} />
                    </View>
                    <View style={styles.buttonWrapper}>
                        <Button title="Go to Home" onPress={navigateHome} />
                    </View>
                </View>
            </View>
        );
    }

    const currentQuestion = quizData[currentQuestionIndex];
    const options = currentQuestion.options;
    return (
        <View style={styles.container}>
            <View style={styles.progressContainer}>
                {quizData.map((question, index) => (
                    <View
                        key={index}
                        style={[
                            styles.progressDot,
                            currentQuestionIndex === index && styles.activeProgressDot
                        ]}
                    />
                ))}
            </View>

            <View style={styles.hintContainer}>
                <Button title="Hint" onPress={handleShowHint} />
            </View>

            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            {options.map(({ id, answer}) => (
                <TouchableOpacity
                    key={id}
                    style={[
                        styles.optionButton,
                        selectedOptions.id === id && styles.selectedOptionButton
                    ]}
                    onPress={() => handleOptionSelect({id, answer})}
                >
                    <Text style={styles.optionText}>{answer}</Text>
                </TouchableOpacity>
            ))}
            <Button title="Submit Answer" onPress={handleSubmitAnswer} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    progressDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'lightgray',
        marginHorizontal: 5,
    },
    activeProgressDot: {
        backgroundColor: '#00aeef',
    },
    hintContainer: {
        marginBottom: 10,
        alignSelf: 'flex-end', 
    },
    questionText: {
        fontSize: 20,
        marginBottom: 20,
    },
    optionButton: {
        backgroundColor: '#ddd',
        padding: 10,
        marginVertical: 5,
        width: '100%',
        alignItems: 'center',
    },
    selectedOptionButton: {
        backgroundColor: '#87cefa', 
    },
    optionText: {
        fontSize: 16,
    },
    resultText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%', 
    },
    buttonWrapper: {
        flex: 1, 
        marginHorizontal: 10, 
    },
});