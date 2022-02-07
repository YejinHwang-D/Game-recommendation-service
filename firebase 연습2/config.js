const firebase = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyC167s4_cS5Q8P0qLiym8-CyoCRztFJ82o",
    authDomain: "practice-firebase-441a2.firebaseapp.com",
    databaseURL: "https://practice-firebase-441a2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "practice-firebase-441a2",
    storageBucket: "practice-firebase-441a2.appspot.com",
    messagingSenderId: "103032202119",
    appId: "1:103032202119:web:091c703ba80969592ba922",
    measurementId: "G-ZGDVXL9MQ1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const User=db.collection("Users");
const TestData = db.collection("TestData"); //API 데이터 잘 들어가는지 확인하는 용

module.exports = User;
module.exports = TestData;


//db.collection('Test').doc('이것도?').set({제목: "안녕"})
