import firebase from "firebase";

export interface Property {
  name: string;
  img?: string;
  shop?: string;
  url?: string;
  locations: PropertyLocation[];
  docRef?: firebase.firestore.DocumentReference;
}

interface PropertyLocation {
  name: string;
  img?: string;
  price?: number;
  url?: string;
  docRef?: firebase.firestore.DocumentReference;
}
