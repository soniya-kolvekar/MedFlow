import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export interface PrescriptionItem {
  name: string;
  dosage: string;
  status: string;
  qty: string;
  color: string;
  code: string;
}

export interface Patient {
  name: string;
  info: string;
  id: string;
  dept: string;
  cond: string;
  status: string;
  avatar: string;
  color?: string;
  createdAt?: string;
  items?: PrescriptionItem[];
  priority?: 'Normal' | 'Urgent';
}

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "patients"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patientList: Patient[] = [];
      snapshot.forEach((doc) => {
        patientList.push(doc.data() as Patient);
      });
      setPatients(patientList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { patients, loading };
};
