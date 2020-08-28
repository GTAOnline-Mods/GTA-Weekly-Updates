import firebase from "firebase";

export default interface Update {
  [name: string]: any;
  podium?: UpdateItem;
  bonusActivities: BonusActivity[];
  new: UpdateItem[];
  sale: SaleItem[];
  targetedSale: SaleItem[];
  date: Date;
  twitchPrime: SaleItem[];
  docRef?: firebase.firestore.DocumentReference;
  redditThread?: string;
  premiumRace?: Race;
  timeTrial?: TimeTrial;
  rcTimeTrial?: TimeTrial;
}

export interface BonusActivity {
  name: string;
  url?: string;
  pay?: number;
  minPay?: number;
  maxPay?: number;
  moneyAmount: number;
  rpAmount: number;
  activity: firebase.firestore.DocumentReference;
}

export interface Race {
  name: string;
  url?: string;
}

export interface TimeTrial extends Race {
  name: string;
  parTime: string;
}

export interface SaleItem extends UpdateItem {
  amount: number;
}

export interface UpdateItem {
  [name: string]: any;
  name: string;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  tradePrice?: number;
  img?: string;
  shop?: string;
  url?: string;
  item: firebase.firestore.DocumentReference;
}
