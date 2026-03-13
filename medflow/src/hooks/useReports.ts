import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export interface Report {
  name: string;
  id: string;
  category: string;
  type: string;
  date: string;
  status: string;
  statusColor?: string;
  dotColor?: string;
  fileUrl?: string;
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("date", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportList: Report[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Report, 'id'>;
        reportList.push({ ...data, id: doc.id } as unknown as Report);
      });
      setReports(reportList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { reports, loading };
};
