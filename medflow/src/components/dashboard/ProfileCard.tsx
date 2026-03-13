import { Edit3, Download, User } from 'lucide-react';

interface PatientProfileProps {
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
}

export default function ProfileCard({ 
  name, 
  age, 
  gender, 
  bloodGroup, 
  allergies, 
  conditions 
}: PatientProfileProps) {
  return (
    <div className="overflow-hidden rounded-[24px] bg-white border border-ash-grey-700 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        {/* Left Section: Basic Info */}
        <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-ash-grey-700">
           <div className="flex items-center gap-6 mb-8">
              <div className="h-20 w-20 rounded-2xl bg-deep-teal-500/10 flex items-center justify-center text-deep-teal-600 border border-deep-teal-500/20">
                 <User className="h-10 w-10" />
              </div>
              <div>
                 <h2 className="text-2xl font-bold text-dark-slate-grey-500">{name}</h2>
                 <p className="text-sm font-bold text-charcoal-blue-600 uppercase tracking-widest">Patient Profile</p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4">
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal-blue-500 mb-1">Age</p>
                 <p className="text-sm font-bold text-dark-slate-grey-500">{age} Years</p>
              </div>
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal-blue-500 mb-1">Gender</p>
                 <p className="text-sm font-bold text-dark-slate-grey-500">{gender}</p>
              </div>
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal-blue-500 mb-1">Blood Group</p>
                 <p className="text-sm font-bold text-deep-teal-600 bg-deep-teal-500/10 px-2 py-0.5 rounded w-fit">{bloodGroup}</p>
              </div>
           </div>
        </div>

        {/* Right Section: Medical Info & Actions */}
        <div className="flex-1 p-6 md:p-8 bg-ash-grey-900/50">
           <div className="space-y-6 mb-8">
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-2">Allergies</p>
                 <div className="flex flex-wrap gap-2">
                    {allergies.map(allergy => (
                       <span key={allergy} className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">{allergy}</span>
                    ))}
                    {allergies.length === 0 && <span className="text-xs font-bold text-charcoal-blue-500">None</span>}
                 </div>
              </div>
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal-blue-500 mb-2">Existing Conditions</p>
                 <div className="flex flex-wrap gap-2">
                    {conditions.map(condition => (
                       <span key={condition} className="text-xs font-bold text-charcoal-blue-600 bg-white border border-ash-grey-700 px-3 py-1 rounded-full">{condition}</span>
                    ))}
                    {conditions.length === 0 && <span className="text-xs font-bold text-charcoal-blue-500">None Reported</span>}
                 </div>
              </div>
           </div>

           <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 rounded-xl bg-deep-teal-500 px-4 py-2 text-xs font-bold text-white hover:bg-deep-teal-600 transition-all shadow-lg shadow-deep-teal-500/20">
                 <Edit3 className="h-3.5 w-3.5" />
                 Edit Profile
              </button>
              <button className="flex items-center gap-2 rounded-xl border border-ash-grey-700 bg-white px-4 py-2 text-xs font-bold text-charcoal-blue-600 hover:bg-ash-grey-800 transition-all">
                 <Download className="h-3.5 w-3.5" />
                 Medical Summary
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
