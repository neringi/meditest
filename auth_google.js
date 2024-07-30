import { auth, db } from './firebaseConfig.js' 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore"; 

// const provider = new GoogleAuthProvider();

// set scope
// provider.addScope('https://www.googleapis.com/auth/questions.readonly');


function isPasswordStrong(password) {
  const minLength = 6;
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);

  return password.length >= minLength && hasLowerCase && hasNumbers ;
}

async function register(username, email, password){
  console.log('running register function');
  if (!isPasswordStrong(password)) {
    console.error('Password is not strong enough');
    throw new Error('Password must be at least 6 characters long and include lowercase and numbers!');
  }

  let user;
  console.log('creating your user')
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    console.log('User credentials:', cred);
    // console.log('cred', cred)
    user = cred.user
  }  catch (err) {
    console.error('Failed to create a new user:', err.message);
    throw new Error('Failed to create a new user: ' + err.message);
  }


  try {
    if (!user) {
      throw new Error('Failed to create user')
    }
    const res = await setDoc(doc(db, "users", user.uid), {
       name: username,
       email: user.email,
       experience: 0,
       level: 0,
       created: Timestamp.now()
     })
    return user
  } catch (err) {
    console.error('failed to save user to firestore')
    throw err
  }
}


async function login(email, password) {
  try { 
    const user = await signInWithEmailAndPassword(auth, email, password)
    return user.user
  } catch (err) {
    console.log('login failed')
    throw err;
  }
}

function logout() {
  const auth = getAuth();
  signOut(auth).then(() => {
  // Sign-out successful.
    console.log('signed out')
    
  })
  .catch((error) => {
  // An error happened.
    const errorCode = error.code;
    const errorMessage = error.message;
  });
}
module.exports = { register, login, logout }