import firebase from "firebase";

export default interface Update {
  [name: string]: any;
  podium?: UpdateItem;
  new: UpdateItem[];
  sale: SaleItem[];
  targetedSale: SaleItem[];
  date: Date;
  twitchPrime: SaleItem[];
  docRef?: firebase.firestore.DocumentReference;
}

export interface SaleItem extends UpdateItem {
  amount: number;
}

export interface UpdateItem {
  name: string;
  id: string;
  docRef: firebase.firestore.DocumentReference;
  data?: firebase.firestore.DocumentData;
}
