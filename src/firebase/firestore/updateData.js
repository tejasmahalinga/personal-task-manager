import firebase_app from "../config";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const db = getFirestore(firebase_app);
export default async function updateData(colllection, id, data) {
  let result = null;
  let error = null;

  try {
    result = await updateDoc(doc(db, colllection, id), data, {
      merge: true,
    });
  } catch (e) {
    error = e;
  }

  return { result, error };
}
