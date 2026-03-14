
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export type LogType = 'PHARMACY' | 'LAB' | 'SYSTEM' | 'PATIENT' | 'ADMIN';

export const logActivity = async (data: {
  type: LogType;
  title: string;
  message: string;
  patientId?: string;
  patientName?: string;
  metadata?: any;
}) => {
  try {
    await addDoc(collection(db, 'system_logs'), {
      ...data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log system activity:', error);
  }
};
