"use client";

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { db } from '@/lib/firebase';
import { collection, query, where, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { FileText, Download, Calendar, Activity, Loader2, ExternalLink, AlertCircle, User, BellRing, Package } from 'lucide-react';

interface Report {
  id: string;
  fileName: string;
  url: string;
  uploadedAt: string;
  department: string;
  status: string;
  testName: string;
  patientId: string;
  patientName: string;
}

interface PatientProfile {
  name: string;
  id: string;
  info?: string;
  dept?: string;
  cond?: string;
}

export default function PatientDashboard() {
  const { user, patientId, loading: authLoading } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newReportIds, setNewReportIds] = useState<Set<string>>(new Set());
  const [showBanner, setShowBanner] = useState(false);
  const [deliveryNotification, setDeliveryNotification] = useState<{title: string, message: string} | null>(null);
  const [showDeliveryBanner, setShowDeliveryBanner] = useState(false);
  const isFirstLoad = useRef(true);
  const isFirstNotifLoad = useRef(true);

  // Allow manual patient ID override stored in localStorage for development/testing
  const [localPatientId, setLocalPatientId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('medflow-patient-id');
    return null;
  });
  const [linkInput, setLinkInput] = useState('');

  // Use auth-provided patientId first, then localStorage fallback
  const effectivePatientId = patientId || localPatientId;

  const handleLinkPatient = () => {
    const trimmed = linkInput.trim().toUpperCase().replace(/^#/, '');
    if (!trimmed) return;
    localStorage.setItem('medflow-patient-id', trimmed);
    setLocalPatientId(trimmed);
    setLinkInput('');
  };

  useEffect(() => {
    if (authLoading || !effectivePatientId) {
      if (!authLoading) setIsLoading(false);
      return;
    }

    // Fetch patient profile once
    const fetchProfile = async () => {
      const patientDocRef = doc(db, 'patients', effectivePatientId);
      const patientSnap = await getDoc(patientDocRef);
      if (patientSnap.exists()) setProfile(patientSnap.data() as PatientProfile);
    };
    fetchProfile();

    // Real-time listener for reports
    const q = query(
      collection(db, 'reports'),
      where('patientId', '==', effectivePatientId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReports: Report[] = [];
      const newIds = new Set<string>();

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' && !isFirstLoad.current) {
          // A brand-new report arrived after initial load
          newIds.add(change.doc.id);
        }
      });

      snapshot.forEach((doc) => {
        fetchedReports.push({ id: doc.id, ...doc.data() } as Report);
      });

      // Sort newest first
      fetchedReports.sort(
        (a, b) => new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime()
      );

      setReports(fetchedReports);
      setIsLoading(false);

      if (newIds.size > 0) {
        setNewReportIds((prev) => new Set([...prev, ...newIds]));
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 6000);
      }

      isFirstLoad.current = false;
    });

    return () => unsubscribe();
  }, [effectivePatientId, authLoading]);

  // Real-time listener for delivery notifications from Pharmacy
  useEffect(() => {
    if (!effectivePatientId) return;

    const nq = query(
      collection(db, 'notifications'),
      where('patientId', '==', effectivePatientId),
      where('type', '==', 'DELIVERY')
    );

    const unsubNotif = onSnapshot(nq, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' && !isFirstNotifLoad.current) {
          const data = change.doc.data();
          setDeliveryNotification({ title: data.title, message: data.message });
          setShowDeliveryBanner(true);
          setTimeout(() => setShowDeliveryBanner(false), 8000);
        }
      });
      isFirstNotifLoad.current = false;
    });

    return () => unsubNotif();
  }, [effectivePatientId]);

  const displayName = profile?.name || user?.displayName || user?.email || "Patient";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F5F7F5] p-2 rounded-[32px] relative">
        {/* Real-time notification banner — Lab Report */}
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
          showBanner ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className="bg-[#2A3B36] text-white px-7 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-xl animate-pulse">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">New Lab Report Available!</p>
              <p className="text-[12px] text-white/70 leading-tight">A new result has just been uploaded to your health portal.</p>
            </div>
          </div>
        </div>

        {/* Real-time notification banner — Ship-to-Home delivery */}
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
          showDeliveryBanner ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className="bg-emerald-700 text-white px-7 py-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-md">
            <div className="bg-white/20 p-2 rounded-xl animate-bounce">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">{deliveryNotification?.title || '📦 Your Medication Is On Its Way!'}</p>
              <p className="text-[12px] text-white/80 leading-snug">{deliveryNotification?.message}</p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div>
            <h1 className="text-[44px] tracking-tight font-black text-[#132A13] leading-none mb-2">
              My Health Portal
            </h1>
            <p className="text-[#3A5046] font-medium text-[15px]">
              {effectivePatientId
                ? `Welcome back, ${displayName} · ID: ${effectivePatientId}`
                : `Welcome, ${user?.email || "Patient"}`}
            </p>
          </div>
          <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-[#D0DCD5] flex items-center gap-3">
            <Activity className="h-5 w-5 text-[#2A3B36]" />
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-[#8B9C92] tracking-widest leading-none mb-1">Reports</p>
              <p className="text-sm font-bold text-[#132A13] leading-none">{reports.length} on file</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Column */}
          <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
            <div className="bg-white rounded-[24px] p-8 shadow-sm flex-1">
              <div className="flex items-center gap-3 mb-8">
                <FileText className="h-6 w-6 text-[#2A3B36]" />
                <h2 className="text-xl font-bold text-[#132A13]">My Laboratory Reports</h2>
              </div>

              {authLoading || isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 text-[#2A3B36] animate-spin mb-4" />
                  <p className="text-[#3A5046] font-medium">Fetching your secure medical records...</p>
                </div>
              ) : !effectivePatientId ? (
                <div className="flex flex-col items-center text-center py-8">
                  <div className="bg-[#E8F0EA] p-4 rounded-full mb-4">
                    <User className="h-8 w-8 text-[#2A3B36]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#132A13] mb-1">Link Your Patient ID</h3>
                  <p className="text-sm text-[#3A5046] mb-6 max-w-sm">
                    Enter your MedFlow Patient ID (e.g. <span className="font-mono font-bold">MF-92850</span>) to see your lab reports and receive delivery notifications in real time.
                  </p>
                  <div className="flex items-center gap-3 w-full max-w-sm">
                    <input
                      type="text"
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLinkPatient()}
                      placeholder="MF-92850"
                      className="flex-1 border border-[#D0DCD5] rounded-xl px-4 py-3 text-sm font-mono font-semibold text-[#132A13] focus:outline-none focus:ring-2 focus:ring-[#2A3B36] focus:border-transparent"
                    />
                    <button
                      onClick={handleLinkPatient}
                      className="bg-[#2A3B36] hover:bg-[#1C2925] text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors"
                    >
                      Link
                    </button>
                  </div>
                </div>
              ) : reports.length > 0 ? (
                <div className="space-y-4">
                  {reports.map((report) => {
                    const isNew = newReportIds.has(report.id);
                    return (
                    <div key={report.id} className={`group border rounded-2xl p-5 hover:shadow-md transition-all ${
                      isNew
                        ? 'border-[#2A3B36] bg-[#E8F0EA]/60 shadow-md'
                        : 'border-[#D0DCD5] hover:border-[#2A3B36]'
                    }`}>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-[#E8F0EA] p-3 rounded-xl group-hover:bg-[#2A3B36] group-hover:text-white transition-colors text-[#2A3B36] flex-shrink-0">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="text-[17px] font-bold text-[#132A13]">
                                {report.testName || 'Laboratory Report'}
                              </h3>
                              {isNew && (
                                <span className="bg-[#2A3B36] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
                                  New
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-medium text-[#8B9C92]">
                              {report.uploadedAt && (
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {new Date(report.uploadedAt).toLocaleDateString(undefined, {
                                    year: 'numeric', month: 'short', day: 'numeric',
                                  })}
                                </span>
                              )}
                              {report.department && <><span>·</span><span>{report.department}</span></>}
                              {report.fileName && <><span>·</span><span className="text-[12px] italic">{report.fileName}</span></>}
                            </div>
                            <span className={`mt-2 inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${report.status === 'Pending Review' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                              {report.status || 'Uploaded'}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <a
                            href={report.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#2A3B36] hover:bg-[#1C2925] text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                          >
                            <ExternalLink className="h-4 w-4" />
                            View
                          </a>
                          <a
                            href={report.url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#F5F7F5] border border-[#D0DCD5] hover:bg-white text-[#132A13] px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </a>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[#F5F7F5] rounded-2xl p-10 flex flex-col items-center justify-center text-center border border-dashed border-[#B8C9C0]">
                  <FileText className="h-12 w-12 text-[#8B9C92] mb-4 opacity-50" />
                  <h3 className="text-lg font-bold text-[#132A13] mb-2">No Reports Yet</h3>
                  <p className="text-sm text-[#3A5046] max-w-[260px]">
                    No laboratory reports have been uploaded for your patient ID ({effectivePatientId}) yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column — Patient Profile Card */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
            <div className="bg-[#2A3B36] rounded-[24px] p-8 text-white shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/10 p-2 rounded-xl">
                  <User className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold">Patient Profile</h2>
              </div>
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-4">
                  <p className="text-[11px] uppercase font-bold text-[#b6e5d8] tracking-widest mb-1">Full Name</p>
                  <p className="font-semibold">{profile?.name || displayName}</p>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <p className="text-[11px] uppercase font-bold text-[#b6e5d8] tracking-widest mb-1">Patient ID</p>
                  <p className="font-semibold tracking-wide">{effectivePatientId || '—'}</p>
                </div>
                {profile?.dept && (
                  <div className="border-b border-white/10 pb-4">
                    <p className="text-[11px] uppercase font-bold text-[#b6e5d8] tracking-widest mb-1">Department</p>
                    <p className="font-semibold">{profile.dept}</p>
                  </div>
                )}
                {profile?.cond && (
                  <div className="border-b border-white/10 pb-4">
                    <p className="text-[11px] uppercase font-bold text-[#b6e5d8] tracking-widest mb-1">Condition</p>
                    <p className="font-semibold">{profile.cond}</p>
                  </div>
                )}
                {profile?.info && (
                  <div>
                    <p className="text-[11px] uppercase font-bold text-[#b6e5d8] tracking-widest mb-1">Patient Info</p>
                    <p className="font-semibold">{profile.info}</p>
                  </div>
                )}
                <div>
                  <p className="text-[11px] uppercase font-bold text-[#b6e5d8] tracking-widest mb-1">Email on File</p>
                  <p className="font-semibold text-sm">{user?.email || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
