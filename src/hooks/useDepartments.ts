import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  ShieldCheck, 
  Rows, 
  Baby, 
  Activity, 
  Truck 
} from 'lucide-react';

export interface Department {
  name: string;
  type: string;
  category: string;
  staff: number;
  pending: number;
  status: string;
  statusColor: string;
  iconName: string;
  iconBg: string;
}

const iconMap: Record<string, any> = {
  Stethoscope,
  FlaskConical,
  Pill,
  ShieldCheck,
  Rows,
  Baby,
  Activity,
  Truck
};

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "departments"), orderBy("name", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const deptList: Department[] = [];
      snapshot.forEach((doc) => {
        deptList.push({ ...doc.data() as any, id: doc.id });
      });
      setDepartments(deptList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { departments, loading, iconMap };
};
