import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  doc, 
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  condition: string;
  notes?: string;
  requestedDate: string;
  requestedTime: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  doctorId: string;
  doctorName?: string;
  type: 'Physical' | 'Virtual';
  rejectionReason?: string;
  createdAt: Timestamp;
}

export interface Doctor {
  uid: string;
  name: string;
  email: string;
  specialty?: string;
  department?: string;
}

export const useAppointments = () => {
  const { user, role } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let q;
    const appointmentsRef = collection(db, 'appointments');

    if (role === 'doctor') {
      q = query(
        appointmentsRef, 
        where('doctorId', '==', user.uid)
      );
    } else if (role === 'patient') {
      q = query(
        appointmentsRef, 
        where('patientId', '==', user.uid)
      );
    } else {
      q = query(appointmentsRef);
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Appointment[] = [];
      snapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as Appointment);
      });
      
      // Sort in memory to avoid needing a composite index
      const sortedList = list.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });

      setAppointments(sortedList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, role]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const q = query(collection(db, 'users'), where('role', '==', 'doctor'));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ uid: d.id, ...d.data() })) as Doctor[];
      setDoctors(list);
    };
    fetchDoctors();
  }, []);

  const bookAppointment = async (data: Omit<Appointment, 'id' | 'patientId' | 'status' | 'createdAt' | 'patientName' | 'patientEmail'>) => {
    if (!user) throw new Error('User not authenticated');

    return await addDoc(collection(db, 'appointments'), {
      ...data,
      patientId: user.uid,
      patientName: user.displayName || user.email?.split('@')[0] || 'Patient',
      patientEmail: user.email || '',
      status: 'pending',
      createdAt: Timestamp.now()
    });
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status'], reason?: string) => {
    const appointmentRef = doc(db, 'appointments', id);
    const updateData: any = { status };
    if (reason) updateData.rejectionReason = reason;
    return await updateDoc(appointmentRef, updateData);
  };

  return { 
    appointments, 
    doctors,
    loading, 
    bookAppointment, 
    updateAppointmentStatus 
  };
};
