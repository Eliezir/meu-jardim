import { ref, get, set, onValue, off, DatabaseReference, DataSnapshot } from 'firebase/database';
import { database } from './config';

export function getDatabaseRef(path: string): DatabaseReference {
  return ref(database, path);
}

export async function readFromDatabase<T = any>(path: string): Promise<T | null> {
  try {
    const dbRef = getDatabaseRef(path);
    const snapshot = await get(dbRef);
    
    if (snapshot.exists()) {
      return snapshot.val() as T;
    }
    return null;
  } catch (error) {
    console.error(`Error reading from ${path}:`, error);
    throw error;
  }
}

export async function writeToDatabase<T = any>(path: string, value: T): Promise<void> {
  try {
    const dbRef = getDatabaseRef(path);
    await set(dbRef, value);
  } catch (error) {
    console.error(`Error writing to ${path}:`, error);
    throw error;
  }
}

export function listenToDatabase<T = any>(
  path: string,
  callback: (data: T | null) => void
): () => void {
  const dbRef = getDatabaseRef(path);
  
  const unsubscribe = onValue(
    dbRef,
    (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as T);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error(`Error listening to ${path}:`, error);
      callback(null);
    }
  );

  return () => {
    off(dbRef);
  };
}

export async function getSoilHumidity(): Promise<number | null> {
  return readFromDatabase<number>('/sensores/umidade_solo');
}

export function listenToSoilHumidity(callback: (humidity: number | null) => void): () => void {
  return listenToDatabase<number>('/sensores/umidade_solo', callback);
}

