import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
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

// const analytics = getAnalytics(app);
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
        currentExperience: userData.currentExperience,
        experienceToNextLevel: userData.experienceToNextLevel
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
    
    // Group and count data by createdDate
    const counts = answerlogList.reduce((acc, item) => {
      const date = new Date(item.createdDate.seconds * 1000); // Convert Firebase timestamp to Date
      const dateString = date.toISOString().split('T')[0]; // Extract date part

      if (!acc[dateString]) {
        acc[dateString] = { total: 0, correct: 0 };
      }
      acc[dateString].total += 1;
      if (item.isCorrect) {
        acc[dateString].correct += 1;
      }

      return acc;
    }, {});
     // Convert the counts object to an array of { date, total, correct } objects
     const result = Object.keys(counts).map(date => ({
      date,
      total: counts[date].total,
      correct: counts[date].correct,
    })).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
    
    return result;
  } catch (error) {
    console.error('Error fetching answer log data:', error);
    return [];
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

const addToAnswerLog = async (userid, questionId, selectedOption, isCorrect) => {
  try {
    const timestamp = new Date();
    const logEntry = {
      'userid': userid,
      'questionid': questionId,
      'selectedOption': selectedOption,
      'isCorrect': isCorrect,
      'createdDate': timestamp,
    };
    await addDoc(collection(db, 'answerlog'), logEntry);
    console.log('Answer logged successfully:', logEntry);
  } catch (error) {
    console.error('Error logging answer:', error);
  }
};


// Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app);
module.exports = {app, auth, db, getQuizData, updateUserExperience, addToAnswerLog, getUserExperience, getAnswerLogData, getAnswerLogCountData}