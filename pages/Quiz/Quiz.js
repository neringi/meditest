import { Alert, Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
// import { firebase } from '../../config';
import { useNavigation } from '@react-navigation/native';
// import { createTables, getQuestionsByCategory } from '../../db';
// import { syncQuestionsFromFirebase } from '../../syncService';
import { getQuizData } from '../../firebaseConfig.js'



export default function Quiz({ navigation, route, userid  }) {
    const { categoryId, user } = route.params;

    const [quizData, setQuizData] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answerSubmitted, setAnswerSubmitted] = useState(false);
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

        fetchQuizData();
    }, [categoryId]);

    // console.log('category at quiz:',categoryId)
    // console.log(getQuizData(categoryId))
    // console.log('quizData:', quizData);

    const handleOptionSelect = (option) => {
        setSelectedOptions(prev => ({ ...prev, [currentQuestionIndex]: option }));
    };

    const handleSubmitAnswer = () => {
        const currentQuestion = quizData[currentQuestionIndex];
        const selectedOption = selectedOptions[currentQuestionIndex];

        if (selectedOption === currentQuestion.correct) {
            setScore(prev => prev + 1);
            handleNextQuestion();
        } else {
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
    };

    const navigateHome = () => {
        navigation.navigate('Home', { userid: userid });
    };

    const handleNextQuestion = () => {
        setAnswerSubmitted(false);

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
            <View style={styles.hintContainer}>
                <Button title="Hint" onPress={handleShowHint} />
            </View>

            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            {Object.keys(options).map(optionKey => (
                <TouchableOpacity
                    key={optionKey}
                    style={[
                        styles.optionButton,
                        selectedOptions[currentQuestionIndex] === optionKey && styles.selectedOptionButton
                    ]}
                    onPress={() => handleOptionSelect(optionKey)}
                >
                    <Text style={styles.optionText}>{options[optionKey]}</Text>
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