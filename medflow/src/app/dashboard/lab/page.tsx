"use client";

import { useRef, useState } from 'react';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  Activity,
  Sparkles,
  ChevronRight as ArrowRight,
  Loader2,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function LabDashboard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(1);

  const activeRequests = [
    {
      id: 1,
      patientID: "MF-92850",
      patientName: "Elena Rodriguez",
      priority: "URGENT",
      testName: "Complete Blood Count (CBC) + Differential",
      requestedBy: "Dr. Marcus Vance",
      colorLine: "bg-red-500",
      pillColor: "bg-red-100 text-red-600"
    },
    {
      id: 2,
      patientID: "MF-92799",
      patientName: "Jameson K. Blake",
      priority: "ROUTINE",
      testName: "Metabolic Panel, Comprehensive",
      requestedBy: "Dr. Sarah Chen",
      colorLine: "bg-green-300",
      pillColor: "bg-green-100 text-green-700"
    },
    {
      id: 3,
      patientID: "MF-93001",
      patientName: "Miriam Sterling",
      priority: "ROUTINE",
      testName: "Lipid Profile + HbA1c",
      requestedBy: "Dr. Anita Roy",
      colorLine: "bg-green-300",
      pillColor: "bg-green-100 text-green-700"
    }
  ];

  const activePatientRequest = activeRequests.find(r => r.id === selectedRequestId);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const cleanPatientId = (activePatientRequest?.patientID || "MF-00000").replace('#', '');
        
        await addDoc(collection(db, 'reports'), {
          fileName: file.name,
          url: data.result.secure_url,
          uploadedAt: new Date().toISOString(),
          department: "Laboratory",
          status: "Finalized",
          patientId: cleanPatientId,
          patientName: activePatientRequest?.patientName || "Unknown Patient",
          testName: activePatientRequest?.testName || "Laboratory Test"
        });

        await addDoc(collection(db, 'notifications'), {
          patientId: cleanPatientId,
          patientName: activePatientRequest?.patientName || "Unknown Patient",
          type: 'info',
          title: '🔬 Lab Results Available',
          message: `Your results for "${activePatientRequest?.testName}" are now available for viewing.`,
          reportUrl: data.result.secure_url,
          createdAt: new Date().toISOString(),
          read: false
        });

        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const scheduleDays = [
    { day: "S", date: 28, dimmed: true },
    { day: "M", date: 29, dimmed: true },
    { day: "T", date: 30, dimmed: true },
    { day: "W", date: 1 },
    { day: "T", date: 2 },
    { day: "F", date: 3 },
    { day: "S", date: 4 },
    { day: "S", date: 5 },
    { day: "M", date: 6 },
    { day: "T", date: 7 },
    { day: "W", date: 8 },
    { day: "T", date: 9 },
    { day: "F", date: 10 },
    { day: "S", date: 11 },
    { day: "S", date: 12, active: true },
    { day: "M", date: 13 },
    { day: "T", date: 14 },
    { day: "W", date: 15 },
    { day: "T", date: 16 },
    { day: "F", date: 17 },
    { day: "S", date: 18 },
    { day: "S", date: 19 }
  ];

  return (
    <div className="flex-1 min-h-0">
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h1 className="text-[44px] tracking-tight font-black text-[#132A13] leading-none mb-2">
            Laboratory Queue
          </h1>
          <p className="text-[#3A5046] font-medium text-[15px]">
            Managing 14 active test requests across 3 departments.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#2A3B36] hover:bg-[#1C2925] transition-colors text-white px-6 py-3.5 rounded-xl shadow-lg shadow-[#2A3B36]/20">
          <Plus className="h-5 w-5" />
          <span className="font-semibold text-sm">New Laboratory Request</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-[24px] p-8 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-[#132A13]">Active Test Requests</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-[#b6e5d8]/50 text-[#1f6650] rounded-full text-xs font-bold">4 Urgent</span>
                <span className="px-3 py-1 bg-[#E8ECE8] text-[#3A5046] rounded-full text-xs font-bold">10 Standard</span>
              </div>
            </div>

            <div className="space-y-6">
              {activeRequests.map((req) => (
                <div 
                  key={req.id} 
                  onClick={() => setSelectedRequestId(req.id)}
                  className={`flex items-center justify-between group p-3 -mx-3 rounded-2xl transition-colors cursor-pointer ${selectedRequestId === req.id ? 'bg-[#E8F0EA] border border-[#B8C9C0] shadow-sm' : 'hover:bg-[#F5F7F5] border border-transparent'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-1.5 h-12 rounded-full ${req.colorLine} flex-shrink-0 mt-1`}></div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-[17px] font-bold text-[#132A13]">{req.patientName}</h3>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${req.pillColor}`}>
                          {req.priority}
                        </span>
                      </div>
                      <p className="text-[14px] text-[#3A5046] font-medium">{req.testName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[11px] font-semibold text-[#8B9C92] mb-0.5">Requested by</p>
                      <p className="text-sm font-bold text-[#132A13]">{req.requestedBy}</p>
                    </div>
                    <div className="h-10 w-10 bg-[#E8ECE8] rounded-full flex items-center justify-center text-[#3A5046] group-hover:bg-[#2A3B36] group-hover:text-white transition-colors">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`bg-[#E8F0EA]/50 rounded-[24px] border-2 border-dashed ${uploadSuccess ? 'border-green-400 bg-green-50/50' : 'border-[#B8C9C0]'} p-10 flex flex-col items-center justify-center text-center transition-colors duration-300`}>
            <div className={`h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 transition-colors ${uploadSuccess ? 'text-green-500' : 'text-[#2A3B36]'}`}>
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : uploadSuccess ? (
                <CheckCircle2 className="h-8 w-8" />
              ) : (
                <Upload className="h-8 w-8" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-[#132A13] mb-2">
              {uploadSuccess ? 'Upload Successful!' : 'Upload Test Reports'}
            </h2>
            <p className="text-[15px] text-[#3A5046] font-medium max-w-sm mb-6">
              {uploadSuccess 
                ? 'Your report has been safely stored in Cloudinary and linked to the database.' 
                : 'Drag and drop verified CSV or PDF results to automatically link them to patient records.'}
            </p>
            
            {activePatientRequest && (
              <div className="mb-6 px-4 py-2 bg-white rounded-xl shadow-sm border border-[#D0DCD5] flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-[#8B9C92] tracking-widest">Target Patient:</span>
                <span className="font-bold text-[#132A13]">{activePatientRequest.patientName}</span>
              </div>
            )}

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept=".pdf,.csv,.jpg,.jpeg,.png"
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-white border border-[#D0DCD5] text-[#132A13] font-bold px-8 py-3 rounded-full hover:bg-[#F5F7F5] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading Securely...
                </>
              ) : (
                'Select Files'
              )}
            </button>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#132A13]">Schedule</h2>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-[#F5F7F5] rounded">
                  <ChevronLeft className="h-5 w-5 text-[#3A5046]" />
                </button>
                <button className="p-1 hover:bg-[#F5F7F5] rounded">
                  <ChevronRight className="h-5 w-5 text-[#3A5046]" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-bold text-[#132A13]">October 2024</h3>
            </div>

            <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#8B9C92] mb-2">
              <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-y-3 text-center text-[13px] font-medium text-[#132A13] mb-8">
              {scheduleDays.map((dayObj, i) => (
                <div key={i} className="flex justify-center">
                  <div className={`
                    flex items-center justify-center h-8 w-8 rounded-full
                    ${dayObj.dimmed ? 'text-[#B8C9C0]' : ''}
                    ${dayObj.active ? 'bg-[#2A3B36] text-white shadow-md' : 'hover:bg-[#F5F7F5] cursor-pointer'}
                  `}>
                    {dayObj.date}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#8B9C92] mb-4">
                Today's Appointments
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="px-2 py-1 bg-[#b6e5d8]/50 text-[#1f6650] rounded text-xs font-bold mt-0.5">
                    09:30
                  </div>
                  <div>
                    <h4 className="font-bold text-[#132A13] text-[15px]">Phlebotomy Slot 4</h4>
                    <p className="text-xs text-[#8B9C92] font-medium">Patient: Henry G.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="px-2 py-1 bg-[#E8ECE8] text-[#3A5046] rounded text-xs font-bold mt-0.5">
                    11:00
                  </div>
                  <div>
                    <h4 className="font-bold text-[#132A13] text-[15px]">MRI Prep Room</h4>
                    <p className="text-xs text-[#8B9C92] font-medium">Maintenance window</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#2A3B36] rounded-[24px] p-6 shadow-md text-white">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="h-5 w-5 text-[#b6e5d8]" />
              <h2 className="text-lg font-bold">Equipment Status</h2>
            </div>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>Hematology Analyzer A1</span>
                  <span className="text-[#b6e5d8]">98%</span>
                </div>
                <div className="h-1.5 w-full bg-[#1C2925] rounded-full overflow-hidden">
                  <div className="h-full bg-[#b6e5d8] w-[98%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>Centrifuge C-400</span>
                  <span className="text-[#b6e5d8]">42%</span>
                </div>
                <div className="h-1.5 w-full bg-[#1C2925] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4A645A] w-[42%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#EAECE6] rounded-[24px] p-6 shadow-sm border border-[#DDE1D7] relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-[#2A3B36]" />
              <h2 className="text-sm font-bold text-[#132A13]">MedFlow AI Insight</h2>
            </div>
            <p className="text-[13px] text-[#3A5046] font-medium leading-relaxed z-10 relative">
              Based on current throughput, the CBC queue will clear by 14:15. Recommend prioritizing Slot B for urgent lipid panels.
            </p>
            <Settings className="absolute -bottom-6 -right-6 h-32 w-32 text-white opacity-40 rotate-[15deg] z-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

