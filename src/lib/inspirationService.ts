// lib/firestoreService.ts
import { db } from './firebase';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

// Define a TypeScript type for your Inspiration document
export interface Inspiration {
  id: string; // Firestore document ID
  title: string;
  link?: string;
  imageUrl?: string;
  notes?: string;
  addedBy: string;
}

const INSPIRATION_COLLECTION = 'inspiration';

// --- CRUD Functions for the 'inspiration' collection ---

// CREATE (POST) a new inspiration document
export const addInspiration = async (
  data: Omit<Inspiration, 'id' | 'createdAt'>,
) => {
  try {
    await addDoc(collection(db, INSPIRATION_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding inspiration: ', error);
    throw new Error('Could not add inspiration document.');
  }
};

// READ (GET) all inspiration documents
export const getInspirations = async (): Promise<Inspiration[]> => {
  try {
    const q = query(collection(db, INSPIRATION_COLLECTION));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Inspiration),
    );
  } catch (error) {
    console.error('Error fetching inspirations: ', error);
    throw new Error('Could not fetch inspiration documents.');
  }
};

// UPDATE (PUT) an existing inspiration document
export const updateInspiration = async (
  id: string,
  dataToUpdate: Partial<Omit<Inspiration, 'id'>>,
) => {
  try {
    const docRef = doc(db, INSPIRATION_COLLECTION, id);
    await updateDoc(docRef, dataToUpdate);
  } catch (error) {
    console.error('Error updating inspiration: ', error);
    throw new Error('Could not update inspiration document.');
  }
};

// DELETE an inspiration document
export const deleteInspiration = async (id: string) => {
  try {
    const docRef = doc(db, INSPIRATION_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting inspiration: ', error);
    throw new Error('Could not delete inspiration document.');
  }
};
