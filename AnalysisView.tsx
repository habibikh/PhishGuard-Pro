
import React from 'react';
import { RiskLevel, AnalysisResult } from '../types';

interface AnalysisViewProps {
  result: AnalysisResult;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result }) => {
  const getRiskMetadata = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SAFE: 
        return {
          glow: 'risk-glow-safe',
          bg: 'bg-emerald-50 dark:bg-emerald-500/10',
          text: 'text-emerald-600 dark:text-emerald-400',
          accent: 'bg-emerald-500',
          border: 'border-emerald-100 dark:border-emerald-500/20',
          label: 'Secure - No Threats Found'
        };
      case RiskLevel.SUSPICIOUS: 
        return {
          glow: 'risk-glow-suspicious',
          bg: 'bg-amber-50 dark:bg-amber-500/10',
          text: 'text-amber-600 dark:text-amber-400',
          accent: 'bg-amber-500',
          border: 'border-amber-100 dark:border-amber-500/20',
          label: 'Caution - Potential Risks'
        };
      case RiskLevel.PHISHING: 
        return {
          glow: 'risk-glow-phishing',
          bg: 'bg-rose-50 dark:bg-rose-500/10',
          text: 'text-rose-600 dark:text-rose-400',
          accent: 'bg-rose-500',
          border: 'border-rose-100 dark:border-rose-500/20',
          label: 'Critical - Malicious Intent'
        };
    }
  };

  const meta = getRiskMetadata(result.riskLevel);

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Risk Summary Deck */}
      <div className={`relative p-6 sm:p-10 border rounded-3xl sm:rounded-[2.5rem] bg-white dark:bg-slate-900/40 ${meta.border} ${meta.glow} transition-all`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${meta.accent} animate-pulse`} />
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${meta.text}`}>
                {meta.label}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight dark:text-white">
              {result.riskLevel}
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-xs font-semibold text-slate-400">
               <div className="flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </div>
               <div className="flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 {result.confidence}% Match
               </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-black/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-white/5 text-center flex-shrink-0">
             <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Analysis Vector</p>
             <div className="text-xl sm:text-2xl font-black text-primary-500">PAYLOAD</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Indicators */}
        <div className="bg-white dark:bg-slate-900/40 p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm transition-all">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 bg-primary-500/5 rounded-xl flex items-center justify-center text-primary-500 border border-primary-500/10">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold dark:text-white">Risk Signals</h3>
          </div>
          <ul className="space-y-4 sm:space-y-5">
            {result.riskIndicators.map((indicator, idx) => (
              <li key={idx} className="flex items-start gap-3.5 group">
                <span className="mt-1 w-5 h-5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:text-primary-500 transition-colors">
                  {idx + 1}
                </span>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{indicator}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Insight */}
        <div className="bg-white dark:bg-slate-900/40 p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm transition-all">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 bg-indigo-500/5 rounded-xl flex items-center justify-center text-indigo-500 border border-indigo-500/10">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold dark:text-white">Forensic Overview</h3>
          </div>
          <p className="text-sm leading-loose text-slate-500 dark:text-slate-400 font-medium italic">
            "{result.explanation}"
          </p>
          <div className="mt-6 sm:mt-8 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
             <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
               <span>Engine Status</span>
               <span className="text-emerald-500">Verified</span>
             </div>
          </div>
        </div>
      </div>

      {/* Recommended Strategy */}
      <div className="bg-slate-950 p-8 sm:p-12 rounded-3xl sm:rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-transparent opacity-50" />
        <div className="relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Defense Strategy</h3>
              <p className="text-[11px] sm:text-sm text-slate-500 mt-1">Recommended professional mitigation steps.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {result.recommendedActions.map((action, idx) => (
              <div key={idx} className="p-5 sm:p-6 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl hover:bg-white/10 transition-all cursor-default group/item">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-300 leading-relaxed">{action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
