import firebase from "firebase/app";

export interface Property {
  name: string;
  img?: string;
  shop?: string;
  url?: string;
  locations: PropertyLocation[];
  docRef?: firebase.firestore.DocumentReference;
}

export interface PropertyLocation {
  name: string;
  img?: string;
  price: number;
  url?: string;
  docRef?: firebase.firestore.DocumentReference;
}
