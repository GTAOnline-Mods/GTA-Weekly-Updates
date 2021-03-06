import firebase from "firebase/app";

export interface Vehicle {
  [name: string]: any;
  img?: string;
  manufacturer: string;
  name: string;
  price?: number;
  tradePrice?: number;
  shop?: string;
  url?: string;
  docRef?: firebase.firestore.DocumentReference;
}
