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

export interface HumidityData {
  value: number;
  updatedAt: string;
}

export async function getSoilHumidity(): Promise<HumidityData | null> {
  const data = await readFromDatabase<HumidityData | number>('/sensores/umidade_solo');
  
  if (data === null) {
    return null;
  }
  
  if (typeof data === 'number') {
    return null;
  }
  
  if (!data.updatedAt || typeof data.value !== 'number') {
    return null;
  }
  
  return data;
}

export function listenToSoilHumidity(callback: (data: HumidityData | null) => void): () => void {
  return listenToDatabase<HumidityData | number>('/sensores/umidade_solo', (data) => {
    if (data === null) {
      callback(null);
      return;
    }
    
    if (typeof data === 'number') {
      callback(null);
      return;
    }
    
    if (!data.updatedAt || typeof data.value !== 'number') {
      callback(null);
      return;
    }
    
    callback(data);
  });
}

export interface IrrigationStatus {
  isActive: boolean;
  zone1EndTime?: number; // Unix timestamp in seconds
  zone2EndTime?: number; // Unix timestamp in seconds
  startTime?: number; // Unix timestamp in seconds
}

export async function getIrrigationStatus(): Promise<IrrigationStatus | null> {
  const data = await readFromDatabase<IrrigationStatus>('/irrigation/status');
  return data;
}

export function listenToIrrigationStatus(callback: (data: IrrigationStatus | null) => void): () => void {
  return listenToDatabase<IrrigationStatus>('/irrigation/status', (data) => {
    callback(data);
  });
}

