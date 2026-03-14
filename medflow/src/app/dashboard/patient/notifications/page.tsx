"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Pill, 
  AlertTriangle,
  MoreVertical,
  Trash2,
  Check,
  Truck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

export default function NotificationsPage() {
  const { patientId, testPatientId, language } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const translations: any = {
    'English': {
       title: 'Notifications',
       desc: 'Stay updated with your medication status and delivery alerts.',
       markRead: 'Mark all as read',
       justNow: 'Just now',
       delivering: 'Delivering',
       track: 'Track Order',
       syncing: 'Syncing your notifications...',
       empty: 'All caught up!'
    },
    'Hindi': {
       title: 'सूचनाएं',
       desc: 'अपनी दवा की स्थिति और वितरण अलर्ट के साथ अपडेट रहें।',
       markRead: 'सभी को पढ़ा हुआ मानें',
       justNow: 'अभी-अभी',
       delivering: 'वितरण हो रहा है',
       track: 'ऑर्डर ट्रैक करें',
       syncing: 'आपकी सूचनाएं सिंक हो रही हैं...',
       empty: 'सब कुछ अपडेट है!'
    },
    'Tamil': {
       title: 'அறிவிப்புகள்',
       desc: 'உங்கள் மருந்து நிலை மற்றும் விநியோக விழிப்பூட்டல்களுடன் புதுப்பித்த நிலையில் இருங்கள்.',
       markRead: 'அனைத்தையும் படித்ததாகக் குறிக்கவும்',
       justNow: 'இப்போதே',
       delivering: 'விநியோகம் செய்யப்படுகிறது',
       track: 'ஆர்டரை டிராக் செய்யவும்',
       syncing: 'உங்கள் அறிவிப்புகளை ஒத்திசைக்கிறது...',
       empty: 'அனைத்தும் புதுப்பிக்கப்பட்டது!'
    },
    'Telugu': {
       title: 'నోటిఫికేషన్లు',
       desc: 'మీ మందుల స్థితి మరియు డెలివరీ హెచ్చరికలతో అప్‌డేట్‌గా ఉండండి.',
       markRead: 'అన్నింటినీ చదివినట్లుగా గుర్తించండి',
       justNow: 'ఇప్పుడే',
       delivering: 'డెలివరీ అవుతోంది',
       track: 'ఆర్డర్‌ను ట్రాక్ చేయండి',
       syncing: 'మీ నోటిఫికేషన్‌లను సమకాలీకరిస్తోంది...',
       empty: 'అన్నీ అప్‌డేట్ అయ్యాయి!'
    },
    'Bengali': {
       title: 'বিজ্ঞপ্তি',
       desc: 'আপনার ওষুধের অবস্থা এবং ডেলিভারি অ্যালার্টের সাথে আপডেট থাকুন।',
       markRead: 'সবগুলো পড়া হিসেবে চিহ্নিত করুন',
       justNow: 'এইমাত্র',
       delivering: 'ডেলিভারি করা হচ্ছে',
       track: 'অর্ডার ট্র্যাক করুন',
       syncing: 'আপনার বিজ্ঞপ্তিগুলি সিঙ্ক করা হচ্ছে...',
       empty: 'সবই আপডেট আছে!'
    }
  };

  const t = translations[language] || translations['English'];

  // Helper to translate common notification phrases
  const translateContent = (text: string) => {
    if (!text) return text;
    if (language === 'English') return text;

    let translated = text;
    const phraseMap: any = {
      'Hindi': {
        'Your Medication Is On Its Way!': 'आपकी दवा आ रही है!',
        'Your prescription from Central Hospital has been dispatched for home delivery.': 'सेंट्रल अस्पताल से आपका नुस्खा होम डिलीवरी के लिए भेज दिया गया है।',
        'Total:': 'कुल:',
        'Estimated delivery:': 'अनुमानित वितरण:',
        'Test Notification': 'परीक्षण सूचना',
        'If you can see this, the real-time system is working perfectly!': 'यदि आप इसे देख सकते हैं, तो रीयल-टाइम सिस्टम पूरी तरह से काम कर रहा है!'
      },
      'Tamil': {
        'Your Medication Is On Its Way!': 'உங்கள் மருந்து வந்து கொண்டிருக்கிறது!',
        'Your prescription from Central Hospital has been dispatched for home delivery.': 'சென்ட்ரல் மருத்துவமனையிலிருந்து உங்கள் மருந்து சீட்டு ஹோம் டெலிவரிக்காக அனுப்பப்பட்டுள்ளது.',
        'Total:': 'மொத்தம்:',
        'Estimated delivery:': 'மதிப்பிடப்பட்ட விநியோகம்:',
        'Test Notification': 'சோதனை அறிவிப்பு'
      },
      'Telugu': {
        'Your Medication Is On Its Way!': 'మీ మందులు అందుతున్నాయి!',
        'Your prescription from Central Hospital has been dispatched for home delivery.': 'సెంట్రల్ హాస్పిటల్ నుండి మీ మందుల ప్రిస్క్రిప్షన్ హోమ్ డెలివరీ కోసం పంపబడింది.',
        'Total:': 'మొత్తం:',
        'Estimated delivery:': 'డెలివరీ సమయం:',
        'Test Notification': 'పరీక్ష నోటిఫికేషన్'
      },
      'Bengali': {
        'Your Medication Is On Its Way!': 'আপনার ওষুধ আসছে!',
        'Your prescription from Central Hospital has been dispatched for home delivery.': 'সেন্ট্রাল হাসপাতাল থেকে আপনার প্রেসক্রিপশন হোম ডেলিভারির জন্য পাঠানো হয়েছে।',
        'Total:': 'মোট:',
        'Estimated delivery:': 'আনুমানিক ডেলিভরি:',
        'Test Notification': 'পরীক্ষা বিজ্ঞপ্তি'
      }
    };

    const map = phraseMap[language];
    if (map) {
      Object.keys(map).forEach(key => {
        translated = translated.replace(key, map[key]);
      });
    }
    return translated;
  };

  const effectiveId = testPatientId || patientId;

  useEffect(() => {
    if (!effectiveId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const cleanId = effectiveId.replace('#', '');

    const q = query(
      collection(db, 'notifications'),
      where('patientId', '==', cleanId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          time: timeAgo(data.createdAt)
        };
      }).sort((a: any, b: any) => {
        // Sort descending by createdAt
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });
      setNotifications(notifs);
      setLoading(false);
    }, (error) => {
      console.error("Snapshot error:", error);
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [effectiveId]);

  const markAllRead = async () => {
    for (const n of notifications) {
      if (!n.read) {
        await updateDoc(doc(db, 'notifications', n.id), { read: true });
      }
    }
  };

  const deleteNotification = async (id: string) => {
    await deleteDoc(doc(db, 'notifications', id));
  };

  function timeAgo(isoString?: string): string {
    if (!isoString) return '';
    const now = new Date();
    const past = new Date(isoString);
    const diff = now.getTime() - past.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 font-sans">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
             <h1 className="text-4xl font-extrabold text-dark-slate-grey-500 tracking-tight mb-2">{t.title}</h1>
             <p className="text-charcoal-blue-500 font-medium">{t.desc}</p>
             {error && (
                <p className="mt-2 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md border border-red-100 flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3" />
                  Connection Error: {error}
                </p>
             )}
          </div>
          <button 
            onClick={markAllRead}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-ash-grey-700 text-xs font-bold text-charcoal-blue-600 hover:bg-ash-grey-800 transition-all"
          >
             <Check className="h-4 w-4" />
             {t.markRead}
          </button>
       </div>

       <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
               <Bell className="h-12 w-12 text-ash-grey-700 mb-4 animate-bounce" />
               <p className="text-charcoal-blue-500 font-bold uppercase tracking-widest text-xs">{t.syncing}</p>
            </div>
          ) : (
           <AnimatePresence initial={false}>
              {notifications.map((n) => (
                <motion.div
                   key={n.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className={`relative group rounded-[24px] p-6 border transition-all ${n.read ? 'bg-ash-grey-900/50 border-ash-grey-700' : 'bg-white border-deep-teal-500 shadow-md ring-1 ring-deep-teal-500/10'}`}
                >
                   <div className="flex gap-6">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${
                        n.type === 'DELIVERY' ? 'bg-orange-100 text-orange-600' :
                        n.type === 'success' ? 'bg-green-100 text-green-600' : 
                        n.type === 'med' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                         {n.type === 'DELIVERY' && <Bell className="h-7 w-7" />}
                         {n.type === 'success' && <CheckCircle2 className="h-7 w-7" />}
                         {n.type === 'med' && <Pill className="h-7 w-7" />}
                         {n.type === 'info' && <FileText className="h-7 w-7" />}
                      </div>
                      
                      <div className="flex-1 pr-10">
                         <div className="flex items-center gap-3 mb-1">
                            <h3 className={`font-bold ${n.read ? 'text-charcoal-blue-600' : 'text-dark-slate-grey-500 text-lg'}`}>
                              {translateContent(n.title)}
                            </h3>
                            {!n.read && <span className="h-2 w-2 rounded-full bg-deep-teal-500" />}
                         </div>
                         <p className={`text-sm leading-relaxed mb-3 ${n.read ? 'text-charcoal-blue-400 font-medium' : 'text-charcoal-blue-600 font-bold'}`}>
                            {translateContent(n.message)}
                         </p>

                         {n.medicines && (
                            <div className="flex flex-wrap gap-2 mb-4">
                               {n.medicines.split(', ').map((med: string, i: number) => (
                                  <span key={i} className="px-2.5 py-1 bg-ash-grey-900 border border-ash-grey-700 rounded-lg text-[10px] font-bold text-charcoal-blue-600 flex items-center gap-1.5">
                                     <div className="w-1.5 h-1.5 rounded-full bg-deep-teal-500" />
                                     {med}
                                  </span>
                               ))}
                            </div>
                         )}

                         <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400">
                            <span className="flex items-center gap-1.5">
                               <Clock className="h-3 w-3" />
                               {n.time === 'Just now' ? t.justNow : n.time}
                            </span>
                            {n.deliveryTime && (
                              <span className="flex items-center gap-1.5 text-orange-600 bg-orange-100/50 px-2.5 py-1 rounded-xl border border-orange-200">
                                <Truck className="h-3 w-3" />
                                {t.delivering}: {n.deliveryTime}
                              </span>
                            )}
                            {n.type === 'DELIVERY' && (
                              <>
                                <span>•</span>
                                <button className="hover:text-deep-teal-500 transition-colors uppercase">{t.track}</button>
                              </>
                            )}
                         </div>
                      </div>

                      <button 
                        onClick={() => deleteNotification(n.id)}
                        className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center rounded-xl bg-ash-grey-900 text-charcoal-blue-300 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                         <Trash2 className="h-4 w-4" />
                      </button>
                   </div>
                </motion.div>
              ))}
           </AnimatePresence>
          )}
          
          {!loading && notifications.length === 0 && (
            <div className="text-center py-20 bg-ash-grey-900 rounded-[40px] border border-dashed border-ash-grey-700">
               <Bell className="h-10 w-10 text-ash-grey-700 mx-auto mb-4" />
               <p className="text-charcoal-blue-400 font-bold uppercase tracking-widest text-xs">{t.empty}</p>
            </div>
          )}
       </div>
    </div>
  );
}
