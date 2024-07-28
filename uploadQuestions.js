const admin = require('firebase-admin');
const fs = require('fs');

// Path to your service account key JSON file
const serviceAccount = require('../serviceAccount.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Path to your questions.json file
const jsonFilePath = '../questions.json';

// Read JSON file
fs.readFile(jsonFilePath, 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }
  const questions = JSON.parse(data);
  
  const batch = db.batch();

  questions.forEach((question) => {
    const questionRef = db.collection('questions').doc(question.id);
    batch.set(questionRef, question);
  });

  await batch.commit();
  console.log('Data successfully uploaded to Firestore!');
});
