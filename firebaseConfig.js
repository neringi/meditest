import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, getDocs, getFirestore, collection, query, where, addDoc, runTransaction } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyCWK-KEUDln6Ks3rDB1lNIwqsxkAoDXZNI",
    authDomain: "meditest-32bcc.firebaseapp.com",
    projectId: "meditest-32bcc",
    storageBucket: "meditest-32bcc.appspot.com",
    messagingSenderId: "379523953419",
    appId: "1:379523953419:web:3881c3f34906b284ae280e",
    measurementId: "G-QQFC53G1LY"
  };

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

auth.onAuthStateChanged(user => {
  if (user) {
    console.log('User is authenticated:', user.uid);
  } else {
    console.log('User is not authenticated');
  }
});

const shuffleArray = (shuffled) => {
  for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
};

export const getQuizData = async (categoryId) => {
  const qs = collection(db, "questions")
  const qSnap = await getDocs(qs);
  const qList = qSnap.docs.map(doc => doc.data());
  const filtered = qList.filter(question => question.category_id === categoryId)
  shuffleArray(filtered)
  const max = filtered.slice(0, filtered.length >= 10 ? 10 : filtered.length)
  for (let q of max) {
    let answers = Object.entries(q.options).map(([k, v]) => ({id: k, answer: v}))
    shuffleArray(answers)
    q.options = answers
  }
  return max
}

export const getUserExperience = async (userid) => {
  try {
    const userDocRef = doc(db, 'users', userid);
    const userSnap = await getDoc(userDocRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        level: userData.level,
        currentExperience: userData.currentExperience
       
      };
    } else {
      console.error("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

export const getAnswerLogData = async (userid) => {
  try {
    const q = query(collection(db, 'answerlog'), where('userid', '==', userid));
    const querySnapshot = await getDocs(q);
    
    const answerlogList = querySnapshot.docs.map(doc => doc.data());
    
    return answerlogList;
  } catch (error) {
    console.error('Error fetching answer log data:', error);
    return [];
  }
};

export const getAnswerLogCountData = async (userid) => {
  try{
    const q = query(collection(db, 'answerlog'), where('userid', '==', userid));
    const querySnapshot = await getDocs(q);
    
    const answerlogList = querySnapshot.docs.map(doc => doc.data());
    
    const counts = answerlogList.reduce((acc, item) => {
      const date = new Date(item.createdDate.seconds * 1000); 
      const dateString = date.toISOString().split('T')[0]; 

      if (!acc[dateString]) {
        acc[dateString] = { total: 0, correct: 0 };
      }
      acc[dateString].total += 1;
      if (item.isCorrect) {
        acc[dateString].correct += 1;
      }

      return acc;
    }, {});
     
     const result = Object.keys(counts).map(date => ({
      date,
      total: counts[date].total,
      correct: counts[date].correct,
    })).sort((a, b) => new Date(a.date) - new Date(b.date)); 
    
    return result;
  } catch (error) {
    console.error('Error fetching answer log data:', error);
    return [];
  }
};

export const getCategoryList = async () => {
  try {
    const q = collection(db, 'questions'); 
    const querySnapshot = await getDocs(q);

    const categoryData = {};

    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      const categoryId = data.category_id;
      if (categoryId) {
        if (!categoryData[categoryId]) {
          categoryData[categoryId] = {
            name: data.category,
            totalQuestions: 0
          };
        }
        categoryData[categoryId].totalQuestions += 1;
      }
    });

    const categoryList = Object.keys(categoryData).map(categoryId => ({
      category_id: categoryId,
      category_name: categoryData[categoryId].name,
      totalQuestions: categoryData[categoryId].totalQuestions
    }));

    return categoryList;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getCategoryLogData = async (userid) => {
  try{
    const q = query(collection(db, 'answerlog'), where('userid', '==', userid));
    const querySnapshot = await getDocs(q);
    
    const answerlogList = querySnapshot.docs.map(doc => doc.data());
    const categoryCounts = answerlogList.reduce((acc, item) => {
      const categoryId = item.categoryid;
      const questionId = item.questionid;

      if (!acc[categoryId]) {
        acc[categoryId] = { correctQuestionIds: new Set(), totalQuestions: new Set() };
      }

      if (item.isCorrect) {
        acc[categoryId].correctQuestionIds.add(questionId);
      }

      acc[categoryId].totalQuestions.add(questionId);

      return acc;
    }, {});

    const result = Object.keys(categoryCounts).map(categoryId => ({
      category_id: categoryId,
      correctQuestionCount: categoryCounts[categoryId].correctQuestionIds.size, 
      totalQuestions: categoryCounts[categoryId].totalQuestions.size 
    }));

    return result;
  } catch(error) {
    console.error('Error fetching category log data:', error);
    return [];
  }
}

export const getLeaderboardData = async () => {
  try {
    const weeklyDocRef = doc(db, 'leaderboard', 'weekly');
    const dailyDocRef = doc(db, 'leaderboard', 'daily');
    
    const [weeklySnapshot, dailySnapshot] = await Promise.all([
      getDoc(weeklyDocRef),
      getDoc(dailyDocRef)
    ]);

    const weeklyData = weeklySnapshot.exists() ? weeklySnapshot.data() : {};
    const dailyData = dailySnapshot.exists() ? dailySnapshot.data() : {};

    // console.log("weekly weeklyData: ", weeklyData);
     const weeklyLeaderboard = Object.entries(weeklyData)
      .map(([userId, data]) => ({
        userId,
        name: data.name,
        score: data.score, 
        type: 'weekly'
      }))
      .sort((a, b) => b.score - a.score); 

    const dailyLeaderboard = Object.entries(dailyData)
      .map(([userId, data]) => ({
        userId,
        name: data.name,
        score: data.score, 
        type: 'daily'
      }))
      .sort((a, b) => b.score - a.score); 

    console.log("weeklyLeaderboard", weeklyLeaderboard);
    console.log("dailyLeaderboard", dailyLeaderboard);

    return { weeklyLeaderboard, dailyLeaderboard };
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return { weeklyLeaderboard: [], dailyLeaderboard: [] };
  }
};


export const updateUserExperience = async (userId, level, experiencePoints) => {
  try {
    const userRef = doc(db, 'users', userId);
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists()) {
        throw new Error("User does not exist!");
      }
      transaction.update(userRef, { 
        currentExperience: experiencePoints,
        level: level,
      });
    });
    console.log('User experience updated successfully.');
  } catch (error) {
    console.error("Error updating user experience:", error);
  }
};

export const updateUserConsent = async (userId, consent_flag) => {
  try{
    const userRef = doc(db, 'users', userId);
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists()) {
        throw new Error("User does not exist!");
      }
      transaction.update(userRef, { 
        consent_flag: consent_flag
      });
    });
    console.log('User data consent updated successfully.');
  } catch (error) {
    console.error("Error updating user data consent:", error);
  }
};


export const addToAnswerLog = async (userid, questionId, selectedOption, isCorrect, categoryid) => {
  try {
    const timestamp = new Date();
    const logEntry = {
      'userid': userid,
      'questionid': questionId,
      'selectedOption': selectedOption,
      'isCorrect': isCorrect,
      'createdDate': timestamp,
      'categoryid': categoryid
    };
    await addDoc(collection(db, 'answerlog'), logEntry);
    console.log('Answer logged successfully:', logEntry);
  } catch (error) {
    console.error('Error logging answer:', error);
  }
};

module.exports = {app, auth, db, getQuizData, updateUserExperience, addToAnswerLog, getUserExperience, getCategoryLogData, getAnswerLogCountData, getCategoryList, getLeaderboardData, updateUserConsent }