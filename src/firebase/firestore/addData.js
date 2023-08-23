import firebase_app from "../config";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const db = getFirestore(firebase_app);
export default async function addData(collectionName, data) {
  let result = null;
  let error = null;

  try {
    result = await addDoc(collection(db, collectionName), {
      name: data.name,
      description: data.description,
      status: data.status,
    });
    return result;
  } catch (e) {
    error = e;
    return error;
  }
}
