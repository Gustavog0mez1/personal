// firebase-config.js
// Configuração simplificada para teste
const firebaseConfig = {
    apiKey: "AIzaSyBpk1IgyayDkDQRiPIocfCQKqOzSzUOJis",
    authDomain: "personal-6de12.firebaseapp.com",
    databaseURL: "https://personal-6de12-default-rtdb.firebaseio.com",
    projectId: "personal-6de12",
    storageBucket: "personal-6de12.firebasestorage.app",
    messagingSenderId: "379061328340",
    appId: "1:379061328340:web:3cb80ffbbb98e844739e41",
    measurementId: "G-WGD0HTS80T"
  };

try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase inicializado com sucesso!");
} catch (error) {
    console.log("Erro ao inicializar Firebase:", error);
}

const auth = firebase.auth();
const database = firebase.database();
