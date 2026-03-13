"use client";

import { useState } from 'react';
import { Play, Volume2, Globe, Loader2, StopCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const languages = [
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
];

export default function SarvamTTS() {
  const [text, setText] = useState('Take one paracetamol tablet after breakfast and one after dinner. Drink plenty of water and rest.');
  const [targetLang, setTargetLang] = useState('hi');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleGenerateTTS = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setAudioUrl(null);

    try {
      const response = await fetch('http://localhost:8000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, target_language: targetLang }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio from backend');
      }

      // Convert backend audio stream to blob url
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

    } catch (err: any) {
      console.error(err);
      setError('Sarvam AI synthesis failed. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[32px] bg-white p-8 border border-ash-grey-700 shadow-sm transition-all hover:shadow-md">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-charcoal-blue-500 text-white shadow-lg shadow-charcoal-blue-500/20">
            <Volume2 className="h-6 w-6" />
          </div>
          <div>
             <h3 className="font-bold text-xl text-dark-slate-grey-500 tracking-tight">Sarvam Voice AI</h3>
             <p className="text-[10px] font-black uppercase tracking-widest text-deep-teal-600">Regional Translation</p>
          </div>
        </div>
      </div>

      <p className="mb-8 text-sm font-medium text-charcoal-blue-500 leading-relaxed">
        Instantly translate medical records and clinical summaries into Indic languages using specialized healthcare AI.
      </p>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Language Selector */}
        <div>
          <label className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400">
             <Globe className="h-3.5 w-3.5" /> Target Language
          </label>
          <div className="relative">
            <select 
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full appearance-none rounded-2xl bg-ash-grey-900 border border-ash-grey-700 p-4 text-sm font-bold text-charcoal-blue-600 focus:border-deep-teal-500 focus:outline-none focus:ring-4 focus:ring-deep-teal-500/10 transition-all"
            >
              {languages.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Text Input */}
        <div>
           <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-charcoal-blue-400">
             Record to Translate
           </label>
           <textarea 
             value={text}
             onChange={(e) => setText(e.target.value)}
             rows={4}
             className="w-full resize-none rounded-2xl bg-ash-grey-900 border border-ash-grey-700 p-4 text-sm font-bold text-dark-slate-grey-500 placeholder:text-charcoal-blue-300 focus:border-deep-teal-500 focus:outline-none focus:ring-4 focus:ring-deep-teal-500/10 transition-all"
             placeholder="Paste medical text here..."
           />
        </div>

        {/* Action Button */}
        <button 
          onClick={handleGenerateTTS}
          disabled={loading || !text.trim()}
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-deep-teal-500 py-4 text-sm font-bold text-white transition-all hover:bg-deep-teal-600 shadow-xl shadow-deep-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> 
              <span>Synthesizing...</span>
            </>
          ) : (
            <>
              <Play className={`h-5 w-5 transition-transform ${text.trim() ? 'group-hover:scale-110' : ''}`} /> 
              <span>Generate Audio</span>
            </>
          )}
        </button>

        {/* Audio Player Output */}
        {audioUrl && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="mt-8 rounded-3xl bg-ash-grey-900 p-6 border border-ash-grey-800"
           >
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-charcoal-blue-600">Audio Ready</span>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-deep-teal-600 bg-deep-teal-50 px-3 py-1 rounded-lg">
                    {languages.find(l => l.code === targetLang)?.name}
                 </span>
              </div>
              <audio controls className="h-10 w-full rounded-xl" src={audioUrl} autoPlay>
                 Your browser does not support the audio element.
              </audio>
           </motion.div>
        )}
      </div>
    </div>
  );
}
