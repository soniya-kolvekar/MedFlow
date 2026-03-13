"use client";

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { FileText, Video, User } from 'lucide-react';
import SarvamTTS from '@/components/dashboard/SarvamTTS';
import ProfileCard from '@/components/dashboard/ProfileCard';
import HealthSnapshot from '@/components/dashboard/HealthSnapshot';

export default function PatientDashboard() {
  const { user } = useAuth();
  
  const userName = user?.email ? user.email.split('@')[0] : 'Patient';

  // Mock data for the profile - in a real app, this would come from Firestore
  const patientData = {
    name: "Rahul Sharma",
    age: 35,
    gender: "Male",
    bloodGroup: "O+",
    allergies: ["Penicillin"],
    conditions: ["Hypertension"]
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-ash-grey-900">
      <h1 className="text-3xl font-bold text-dark-slate-grey-500">
        Patient Dashboard
      </h1>
    </div>
  );
}
