import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import { Mission } from "../models/mission";
import { Property, PropertyLocation } from "../models/property";
import Update from "../models/update";
import { Vehicle } from "../models/vehicle";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
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
  db: app.firestore.Firestore;
  functions: app.functions.Functions;

  constructor() {
    app.initializeApp(firebaseConfig);

    this.auth = app.auth();
    this.db = app.firestore();
    this.functions = app.functions();
  }

  createUserWithEmailAndPassword = (email: string, password: string) =>
    this.auth
      .createUserWithEmailAndPassword(email, password)
      .catch(console.error);

  signInWithEmailAndPassword = async (email: string, password: string) => {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  signOut = () => this.auth.signOut().catch(console.error);

  resetPassword = (email: string) =>
    this.auth.sendPasswordResetEmail(email).catch(console.error);

  updatePassword = (password: string) =>
    this.auth.currentUser?.updatePassword(password).catch(console.error);

  getUserDoc = async (userId: string) => {
    const snapshot = await this.db.collection("users").doc(userId).get();

    if (snapshot?.exists) {
      return snapshot;
    }
    return null;
  };

  getUpdates = async (limit: number = 15) => {
    const snapshot = await this.db
      .collection("updates")
      .orderBy("date", "desc")
      .limit(limit)
      .get();

    return snapshot!.docs.map((doc) => ({
      ...(doc.data() as Update),
      bonusActivities: doc.data()!.bonusActivities || [],
      date: new Date(doc.data()!.date.seconds * 1000),
      docRef: doc.ref,
    }));
  };

  getUpdate = async (id: string) => {
    const doc = await this.db.collection("updates").doc(id).get();

    return (
      doc.exists && {
        ...(doc.data() as Update),
        bonusActivities: doc.data()!.bonusActivities || [],
        date: new Date(doc.data()!.date.seconds * 1000),
        docRef: doc.ref,
      }
    );
  };

  getVehicles = async () => {
    const snapshot = await this.db
      .collection("vehicles")
      .orderBy("manufacturer")
      .get();

    return snapshot!.docs.map((doc) => ({
      ...(doc.data() as Vehicle),
      docRef: doc.ref,
    }));
  };

  getVehicle = async (id: string) => {
    const doc = await this.db.collection("vehicles").doc(id).get();

    return (
      doc.exists && {
        ...(doc.data() as Vehicle),
        docRef: doc.ref,
      }
    );
  };

  getProperties = async () => {
    const snapshot = await this.db
      .collection("properties")
      .orderBy("name")
      .get();

    const properties = [];

    for (let property of snapshot.docs) {
      const locations = await property.ref.collection("locations").get();
      const locationItems = locations.docs.map((l) => ({
        ...(l.data() as PropertyLocation),
        docRef: l.ref,
      }));

      properties.push({
        ...(property.data() as Property),
        locations: locationItems,
        docRef: property.ref,
      });
    }

    return properties;
  };

  getProperty = async (id: string) => {
    const property = await this.db.collection("properties").doc(id).get();

    if (!property.exists) return false;

    const locations = await property.ref.collection("locations").get();
    const locationItems = locations.docs.map((l) => ({
      ...(l.data() as PropertyLocation),
      docRef: l.ref,
    }));

    return {
      ...(property.data() as Property),
      locations: locationItems,
      docRef: property.ref,
    };
  };

  getMissions = async () => {
    const snapshot = await this.db.collection("missions").orderBy("name").get();

    return snapshot!.docs.map((doc) => ({
      ...(doc.data() as Mission),
      docRef: doc.ref,
    }));
  };
}

export default Firebase;
