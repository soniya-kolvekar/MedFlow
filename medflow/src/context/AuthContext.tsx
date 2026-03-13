"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  role: string | null;
  patientId: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateRoleInCookie: (newRole: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  patientId: null,
  loading: true,
  logout: async () => { },
  updateRoleInCookie: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
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
        // Fetch role from Firestore
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const userRole = data.role;
            setRole(userRole);
            updateRoleInCookie(userRole);
            // Also fetch patientId if the user is a patient
            setPatientId(data.patientId || null);
          } else {
            console.log("No user document found!");
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

  return (
    <AuthContext.Provider value={{ user, role, patientId, loading, logout, updateRoleInCookie }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
