"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Save, 
  Camera,
  Heart,
  Activity,
  Droplets,
  AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const patientData = {
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    address: "Block 4, Sunrise Apartments, Mumbai, India",
    dob: "12 May 1988",
    gender: "Male",
    bloodGroup: "O Positive",
    allergies: ["Penicillin", "Dust"],
    emergencyContact: "Anjali Sharma (+91 98765 43211)"
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 font-sans">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
             <h1 className="text-4xl font-extrabold text-dark-slate-grey-500 tracking-tight mb-2">My Profile</h1>
             <p className="text-charcoal-blue-500 font-medium">Manage your personal information and medical preferences.</p>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-bold transition-all ${isEditing ? 'bg-deep-teal-500 text-white shadow-xl shadow-deep-teal-500/20' : 'bg-white border border-ash-grey-700 text-charcoal-blue-600 hover:bg-ash-grey-900'}`}
          >
             {isEditing ? <Save className="h-4 w-4" /> : <Save className="h-4 w-4 opacity-0" />}
             {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
       </div>

       <div className="grid gap-8">
          
          {/* Cover & Avatar */}
          <div className="relative h-48 rounded-[40px] bg-charcoal-blue-500 overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 w-96 h-96 bg-deep-teal-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
             <div className="absolute bottom-[-60px] left-10">
                <div className="relative group">
                   <div className="h-32 w-32 rounded-[32px] bg-white p-2 shadow-2xl">
                      <div className="h-full w-full rounded-[24px] bg-ash-grey-900 flex items-center justify-center text-charcoal-blue-500 overflow-hidden">
                         <User className="h-16 w-16" />
                      </div>
                   </div>
                   {isEditing && (
                     <button className="absolute bottom-2 right-2 h-10 w-10 rounded-xl bg-deep-teal-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Camera className="h-5 w-5" />
                     </button>
                   )}
                </div>
             </div>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
             
             {/* Left Column: Personal Info */}
             <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-[32px] p-8 border border-ash-grey-700 shadow-sm transition-all hover:shadow-md">
                   <h2 className="text-xl font-bold text-dark-slate-grey-500 mb-8 border-b border-ash-grey-700 pb-4">Personal Information</h2>
                   
                   <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400">Full Name</label>
                         <div className="flex items-center gap-3 text-dark-slate-grey-500">
                            <User className="h-4 w-4 text-ash-grey-700" />
                            <input 
                              type="text" 
                              disabled={!isEditing}
                              defaultValue={patientData.name}
                              className={`w-full bg-transparent font-bold focus:outline-none ${isEditing ? 'border-b border-deep-teal-500' : ''}`}
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400">Email Address</label>
                         <div className="flex items-center gap-3 text-dark-slate-grey-500">
                            <Mail className="h-4 w-4 text-ash-grey-700" />
                            <input 
                              type="email" 
                              disabled={!isEditing}
                              defaultValue={patientData.email}
                              className={`w-full bg-transparent font-bold focus:outline-none ${isEditing ? 'border-b border-deep-teal-500' : ''}`}
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400">Phone Number</label>
                         <div className="flex items-center gap-3 text-dark-slate-grey-500">
                            <Phone className="h-4 w-4 text-ash-grey-700" />
                            <input 
                              type="text" 
                              disabled={!isEditing}
                              defaultValue={patientData.phone}
                              className={`w-full bg-transparent font-bold focus:outline-none ${isEditing ? 'border-b border-deep-teal-500' : ''}`}
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400">Residential Address</label>
                         <div className="flex items-center gap-3 text-dark-slate-grey-500">
                            <MapPin className="h-4 w-4 text-ash-grey-700" />
                            <input 
                              type="text" 
                              disabled={!isEditing}
                              defaultValue={patientData.address}
                              className={`w-full bg-transparent font-bold focus:outline-none ${isEditing ? 'border-b border-deep-teal-500' : ''}`}
                            />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-ash-grey-700 shadow-sm transition-all hover:shadow-md">
                   <h2 className="text-xl font-bold text-dark-slate-grey-500 mb-8 border-b border-ash-grey-700 pb-4">Medical Metadata</h2>
                   
                   <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
                      <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                               <Heart className="h-5 w-5" />
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400">Emerg. Contact</p>
                               <p className="text-sm font-bold text-dark-slate-grey-500">{patientData.emergencyContact}</p>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-deep-teal-50 text-deep-teal-600 flex items-center justify-center">
                               <Droplets className="h-5 w-5" />
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400">Insurance ID</p>
                               <p className="text-sm font-bold text-dark-slate-grey-500">POL-88229911</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right Column: Health Summary & Files */}
             <div className="space-y-6">
                <div className="bg-charcoal-blue-500 rounded-[32px] p-8 text-white shadow-xl shadow-charcoal-blue-500/10 border border-charcoal-blue-400">
                   <div className="flex items-center gap-3 mb-8">
                      <Activity className="h-5 w-5 text-deep-teal-500" />
                      <h3 className="text-lg font-bold">Health Basics</h3>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-charcoal-blue-400 pb-4">
                         <span className="text-xs font-bold text-charcoal-blue-800">Blood Group</span>
                         <span className="text-sm font-black text-deep-teal-500">{patientData.bloodGroup}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-charcoal-blue-400 pb-4">
                         <span className="text-xs font-bold text-charcoal-blue-800">Date of Birth</span>
                         <span className="text-sm font-black">{patientData.dob}</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-xs font-bold text-charcoal-blue-800">Gender</span>
                         <span className="text-sm font-black">{patientData.gender}</span>
                      </div>
                   </div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-ash-grey-700 shadow-sm transition-all hover:shadow-md">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-bold text-dark-slate-grey-500">Trust Verification</h3>
                      <ShieldCheck className="h-6 w-6 text-green-500" />
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-ash-grey-900 border border-ash-grey-700">
                         <CreditCard className="h-5 w-5 text-charcoal-blue-400" />
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400">KYC Status</p>
                            <p className="text-xs font-bold text-green-600">Verified (Aadhar)</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-100 border border-red-200">
                         <AlertCircle className="h-5 w-5 text-red-500" />
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Critical Alerts</p>
                            <p className="text-xs font-bold text-red-700">Penicillin Allergy</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
