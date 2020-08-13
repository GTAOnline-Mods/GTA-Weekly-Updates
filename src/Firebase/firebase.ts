import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAuQm6JQ5NtDuPcxcOskE9TieIWgeNVTr8",
  authDomain: "gtaonline-cf0ea.firebaseapp.com",
  databaseURL: "https://gtaonline-cf0ea.firebaseio.com",
  projectId: "gtaonline-cf0ea",
  storageBucket: "gtaonline-cf0ea.appspot.com",
  messagingSenderId: "530543486780",
  appId: "1:530543486780:web:64b09838eafb8c9c68a039",
  measurementId: "G-BGBY46T4PR",
};

class Firebase {
  auth: app.auth.Auth;
  db: app.database.Database;
  functions: app.functions.Functions;

  constructor() {
    app.initializeApp(firebaseConfig);

    this.auth = app.auth();
    this.db = app.database();
    this.functions = app.functions();
  }

  doCreateUserWithEmailAndPassword = (email: string, password: string) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email: string, password: string) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email: string) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password: string) =>
    this.auth.currentUser?.updatePassword(password);
}

export default Firebase;
