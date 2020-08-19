import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import Update from "../models/update";
import { Vehicle } from "../models/vehicle";

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
  db: app.firestore.Firestore;
  functions: app.functions.Functions;

  constructor() {
    app.initializeApp(firebaseConfig);

    this.auth = app.auth();
    this.db = app.firestore();
    this.functions = app.functions();
  }

  createUserWithEmailAndPassword = (email: string, password: string) =>
    this.auth.createUserWithEmailAndPassword(email, password).catch((error) => {
      throw error;
    });

  signInWithEmailAndPassword = async (email: string, password: string) => {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  signOut = () =>
    this.auth.signOut().catch((error) => {
      console.error(error);
    });

  resetPassword = (email: string) =>
    this.auth.sendPasswordResetEmail(email).catch((error) => {
      console.error(error);
    });

  updatePassword = (password: string) =>
    this.auth.currentUser?.updatePassword(password).catch((error) => {
      console.error(error);
    });

  getUserDoc = async (userId: string) => {
    const snapshot = await this.db.collection("users").doc(userId).get();
    if (snapshot?.exists) {
      return snapshot;
    }
    return null;
  };

  getUpdates = async () => {
    const snapshot = await this.db.collection("updates").get();

    const getItem = async (item: app.firestore.DocumentReference) => {
      const s = await item.get();
      return {
        name: s.data()!.manufacturer
          ? `${s.data()!.manufacturer} ${s.data()!.name}`
          : s.data()!.name,
        docRef: item,
        id: item.id,
        data: s.data()!,
      };
    };

    const getItems = async (items?: app.firestore.DocumentData[]) =>
      items
        ? Promise.all(
            items
              .filter((item) => item != null)
              .map((item) => getItem(item.item || item))
          )
        : [];

    const getSales = async (sale?: app.firestore.DocumentData[]) =>
      sale
        ? Promise.all(
            sale.map(async (item) => ({
              ...(await getItem(item.item)),
              amount: item.amount,
            }))
          )
        : [];

    const u: Update[] = [];

    for (const doc of snapshot!.docs) {
      const update = {
        podium: doc.data()!.podium && (await getItem(doc.data()!.podium)),
        new: await getItems(doc.data()!.new),
        sale: await getSales(doc.data()!.sale),
        twitchPrime: await getSales(doc.data()!.twitchPrime),
        date: new Date(doc.data()!.date.seconds * 1000),
        docRef: doc.ref,
      };
      u.push(update);
    }

    return u;
  };

  getVehicles = async () => {
    const snapshot = await this.db.collection("vehicles").get();

    const v: Vehicle[] = [];

    for (const doc of snapshot!.docs) {
      v.push({
        ...(doc.data() as Vehicle),
        docRef: doc.ref,
      });
    }

    return v;
  };
}

export default Firebase;
