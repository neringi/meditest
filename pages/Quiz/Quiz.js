import { Alert, Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

import { 
    getQuizData, 
    addToAnswerLog, 
    getUserExperience, 
    updateUserExperience
} from '../../firebaseConfig.js'
import ProgressBar from 'react-native-progress/Bar';


const screenWidth = Dimensions.get('window').width;

const difficultyPoints = {
    '1': 10,
    '2': 20,
    '3': 30,
};

const calculateTotalExperienceForLevel = (level) => {
    return Math.floor(100*Math.pow(1.2, level -1))
}

export default function Quiz({ navigation, route, userid  }) {
    const { categoryId } = route.params;
    // console.log('QUIZ USERID', userid);
    // console.log('user taking quiz', userid)
    const [quizData, setQuizData] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answerSubmitted, setAnswerSubmitted] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [experienceToNextLevel, setExperienceToNextLevel] = useState(100);

    
    useEffect(() => {
        const fetchUserExperience = async () => {
            try {
              const userExperience = await getUserExperience(userid);
            //   console.log('fetching user exp', userExperience)
              const userLevel = userExperience.level || 1;
              const userExperiencePoints = userExperience.currentExperience || 0;

              setCurrentExperience(userExperiencePoints);
              setLevel(userLevel);
            
              const experienceForNextLevel = calculateTotalExperienceForLevel(userLevel);
              setExperienceToNextLevel(experienceForNextLevel);
            } catch (error) {
              console.error('Error fetching user experience:', error);
            }
          };
        fetchUserExperience();
    }, []);

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
    }, [])

    const handleOptionSelect = (option) => {
        console.log('==== Option:', option)
        setSelectedOptions(option)
    };

    const handleSubmitAnswer = async () => {
    
        const currentQuestion = quizData[currentQuestionIndex];
        // console.log("HANDLE SUBMIT")
        // console.log("Current Question:", currentQuestion);
        // console.log("Selected Options:", selectedOptions);

        if (!currentQuestion) {
            console.error("Current question is undefined");
            return;
        }
    
        if (Object.keys(selectedOptions).length === 0) {
            console.error("Selected options is undefined");
            return;
        }

        if (selectedOptions.id !== currentQuestion.correct) {
            console.log("====SAVING OPTION ", selectedOptions)
            await addToAnswerLog(userid, currentQuestion.id, selectedOptions.id, 0,currentQuestion.category_id);
            Alert.alert("Incorrect", currentQuestion.explanation,
                [{ text: "OK", onPress: () => handleNextQuestion() }]
            );
            return
        }
        
        setScore(prev => prev + 1);
        const baseExperiencePoints = difficultyPoints[currentQuestion.difficulty_id]; 
        const experiencePoints = hintUsed ? baseExperiencePoints / 2 : baseExperiencePoints;
        let currentLevelTotalExperience = calculateTotalExperienceForLevel(level);
        setExperienceToNextLevel(currentLevelTotalExperience);
        let newExperience = currentExperience + experiencePoints
        let newLevel = level
        if (newExperience >= currentLevelTotalExperience) {
            newLevel += 1
            currentLevelTotalExperience = calculateTotalExperienceForLevel(newLevel)
            newExperience = Math.abs(experienceToNextLevel - newExperience)
        }
        setCurrentExperience(newExperience);
        setExperienceToNextLevel(currentLevelTotalExperience);
        setLevel(newLevel);
        
        await addToAnswerLog(userid, currentQuestion.id, selectedOptions.id, 1, currentQuestion.category_id); 
        await updateUserExperience(userid, newLevel, newExperience)
        setAnswerSubmitted(true);
        handleNextQuestion();
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

    const navigateHome = () => {
        navigation.navigate('Home', { userid: userid });
    };

    const handleNextQuestion = async () => {
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
                    <TouchableOpacity style={styles.button} onPress={handleRetakeQuiz}>
                        <Text style={styles.buttonText}>Try Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={navigateHome}>
                        <Text style={styles.buttonText}>Go to Home</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const currentQuestion = quizData[currentQuestionIndex];
    const options = currentQuestion.options;

    return (
        <View style={styles.container}>

            <View style={styles.experienceContainer}>
                <Text style={styles.experienceText}>
                    EXP: {currentExperience}/{experienceToNextLevel}
                </Text>

                <ProgressBar
                    progress={currentExperience / experienceToNextLevel}
                    width={Dimensions.get('window').width - 40}
                    height={15}
                    color="#00aeef"
                    borderRadius={10}
                    style={styles.progressBar}
                />
            </View>

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

            
            <View style={styles.cardContainer}>
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
            </View>
            
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitAnswer}>
                <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>


            
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E0F7FA',
    },
    experienceContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 40, 
    },
    experienceText: {
        fontSize: 16,
        color: '#0077b6',
        marginBottom: 10,
    },
    progressContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'lightgray',
        marginHorizontal: 5,
    },
    activeProgressDot: {
        backgroundColor: '#0077b6',
    },
    hintContainer: {
        marginBottom: 10,
        alignSelf: 'flex-end', 
    },
    questionText: {
        fontSize: 20,
        color: '#fff',
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#00AEEF', 
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5, 
        textAlign: 'center',
    },
    cardContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5, 
    },
    optionButton: {
        backgroundColor: '#d6eaf8',
        padding: 15,
        marginVertical: 8,
        width: '100%',
        alignItems: 'center',
        borderRadius: 8,
    },
    selectedOptionButton: {
        backgroundColor: '#87cefa', 
    },
    optionText: {
        fontSize: 18,
        color: '#333',
    },
    resultText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0077b6',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#0077b6',
        padding: 15,
        borderRadius: 8,
        marginHorizontal: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#0077b6',
        padding: 15,
        borderRadius: 8,
        marginTop: 20, 
        width: '80%', 
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18, 
        fontWeight: 'bold',
    },
    progressBar: {
        marginVertical: 10,
    },
});