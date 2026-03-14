"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  role: string | null;
  patientId: string | null;
  testPatientId: string | null;
  setTestPatientId: (id: string | null) => void;
  language: string;
  setLanguage: (lang: string) => void;
  loading: boolean;
  logout: () => Promise<void>;
  updateRoleInCookie: (newRole: string) => void;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  patientId: null,
  testPatientId: null,
  setTestPatientId: () => { },
  language: 'English',
  setLanguage: () => { },
  loading: true,
  logout: async () => { },
  updateRoleInCookie: () => { },
  updateProfile: async () => { },
});

const ADMIN_EMAIL = "admin@medflow.com";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [testPatientId, setTestPatientId] = useState<string | null>(null);
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const updateRoleInCookie = (newRole: string | null) => {
    if (newRole) {
      document.cookie = `medflow-role=${newRole}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Strict`;
    } else {
      document.cookie = `medflow-role=; path=/; max-age=0; SameSite=Strict`;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // 1. Hardcoded Admin Check
        if (firebaseUser.email === ADMIN_EMAIL) {
            setRole("admin");
            updateRoleInCookie("admin");
            setLoading(false);
            return;
        }

        // 2. Fetch role from Firestore for all other users
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const userRole = data.role;
            
            // Security: Prevent any other user from claiming 'admin' role via Firestore
            const safeRole = userRole === 'admin' ? 'patient' : userRole;
            
            setRole(safeRole);
            updateRoleInCookie(safeRole);
            setPatientId(data.patientId || null);
          } else {
            setRole(null);
            updateRoleInCookie(null);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole(null);
          updateRoleInCookie(null);
        }
      } else {
        setUser(null);
        setRole(null);
        setPatientId(null);
        updateRoleInCookie(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      updateRoleInCookie(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const updateProfile = async (data: any) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, data, { merge: true });
      // Refresh local role/patientId if they were updated
      if (data.role) setRole(data.role);
      if (data.patientId) setPatientId(data.patientId);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      patientId, 
      testPatientId,
      setTestPatientId,
      language,
      setLanguage,
      loading, 
      logout, 
      updateRoleInCookie 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
