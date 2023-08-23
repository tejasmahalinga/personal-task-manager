import firebase_app from "../config";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  onSnapshot,
  query,
  getDocs,
  querySnapshot,
} from "firebase/firestore";

const db = getFirestore(firebase_app);

export default async function getAllData(col) {
  let result = null;
  let error = null;

  try {
    let q = query(collection(db, col));
    let itemsArr = [];

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      console.log(itemsArr);
      return new Promise((resolve, reject) => {
        resolve(itemsArr);
      });
    });
  } catch (e) {
    error = e;
    return error;
  }
}
