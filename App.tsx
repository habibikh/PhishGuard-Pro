
import React, { useState, useEffect } from 'react';
import { AnalysisResult } from './types';
import { analyzeEmail } from './services/geminiService';
import AnalysisView from './components/AnalysisView';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(initialDark);
    
    const savedHistory = localStorage.getItem('phishguard_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) { console.error(e); }
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeEmail(input);
      const fullResult: AnalysisResult = {
        ...result, id: crypto.randomUUID(), timestamp: Date.now(), originalText: input
      };
      setCurrentResult(fullResult);
      const newHistory = [fullResult, ...history].slice(0, 8);
      setHistory(newHistory);
      localStorage.setItem('phishguard_history', JSON.stringify(newHistory));
    } catch (err: any) {
      setError(err.message || "Threat detection engine error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 transition-colors duration-500">
      {/* SaaS Navigation */}
      <header className="sticky top-0 z-50 glass border-b border-slate-100 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight dark:text-white">
                PhishGuard <span className="text-primary-500 font-medium">Pro</span>
              </h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1 hidden sm:block">Threat Analyst</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all hover:scale-105"
            >
              {isDark ? (
                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zM2 13h2a1 1 0 100-2H2a1 1 0 100 2zm18 0h2a1 1 0 100-2h-2a1 1 0 100 2zM11 2v2a1 1 0 100 2V2a1 1 0 100-2zm0 18v2a1 1 0 100 2v-2a1 1 0 100-2zM5.99 4.58a1 1 0 10-1.41 1.41l1.41-1.41zm12.02 12.02a1 1 0 10-1.41 1.41l1.41-1.41zm-1.41-12.02a1 1 0 101.41 1.41l-1.41-1.41zM4.58 18.01a1 1 0 101.41-1.41l-1.41 1.41z" /></svg>
              ) : (
                <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12.1 22c5.5 0 10-4.5 10-10 0-4.2-2.6-7.8-6.3-9.3.2.9.3 1.8.3 2.8 0 5.5-4.5 10-10 10-1 0-1.9-.1-2.8-.3 1.5 3.7 5.1 6.3 9.3 6.3z" /></svg>
              )}
            </button>
            <div className="h-10 w-px bg-slate-100 dark:bg-slate-800 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-600 rounded-xl text-white text-[11px] font-bold shadow-lg shadow-primary-500/20">
               Audit Mode
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Main Console */}
          <div className="flex-1 space-y-10 lg:order-1 order-2">
            <section className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="px-6 py-5 sm:px-10 sm:py-8 border-b border-slate-50 dark:border-slate-800/60 flex justify-between items-center bg-slate-50/30 dark:bg-black/10">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-6 bg-primary-500 rounded-full" />
                   <h2 className="text-sm font-bold tracking-tight dark:text-slate-200 uppercase">Analysis Deck</h2>
                </div>
                <button onClick={() => setInput('')} className="text-[10px] font-bold text-slate-300 hover:text-rose-500 transition-colors uppercase tracking-widest">Clear</button>
              </div>
              <div className="p-6 sm:p-10">
                <textarea
                  className="w-full h-56 sm:h-64 p-5 sm:p-8 bg-slate-50 dark:bg-[#020617]/50 border-0 rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none text-sm sm:text-base leading-relaxed dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                  placeholder="Insert suspicious content here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Secure API Endpoint Connected
                  </div>
                  
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !input.trim()}
                    className={`
                      w-full sm:w-auto px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all
                      ${loading || !input.trim() 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' 
                        : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-95 shadow-xl shadow-primary-500/20'}
                    `}
                  >
                    {loading ? 'Processing...' : 'Start Threat Scan'}
                  </button>
                </div>
              </div>
            </section>

            {error && (
              <div className="p-5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-4 text-sm font-bold">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {error}
              </div>
            )}

            {currentResult && <AnalysisView result={currentResult} />}

            {!currentResult && !loading && !error && (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-slate-200 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 </div>
                 <h3 className="text-lg font-bold text-slate-400 dark:text-slate-600">Awaiting Signal</h3>
              </div>
            )}
          </div>

          {/* Activity Ledger */}
          <aside className="lg:w-80 space-y-8 lg:order-2 order-1">
            <div className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col lg:h-[700px]">
              <div className="p-6 border-b border-slate-50 dark:border-slate-800/60 flex justify-between items-center">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">History Log</h2>
                {history.length > 0 && (
                  <button onClick={() => setHistory([])} className="text-[10px] font-bold text-rose-500">Flush</button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {history.length === 0 ? (
                  <p className="text-[10px] text-center mt-10 font-bold text-slate-300 uppercase tracking-widest">No entries yet</p>
                ) : history.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentResult(item)}
                    className={`w-full p-4 rounded-2xl border transition-all text-left flex items-start gap-3 group
                      ${currentResult?.id === item.id 
                        ? 'bg-primary-50 dark:bg-primary-500/5 border-primary-200 dark:border-primary-500/30' 
                        : 'bg-white dark:bg-black/10 border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}
                  >
                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0
                      ${item.riskLevel === 'SAFE' ? 'bg-emerald-500' : item.riskLevel === 'SUSPICIOUS' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-[11px] font-bold truncate ${currentResult?.id === item.id ? 'text-primary-700 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300'}`}>
                        {item.originalText.slice(0, 35)}...
                      </p>
                      <p className="text-[9px] font-medium text-slate-400 mt-1">{new Date(item.timestamp).toLocaleDateString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#020617] p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden hidden lg:block">
               <div className="absolute top-0 right-0 p-6 opacity-10"><svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/></svg></div>
               <h3 className="text-sm font-black mb-4">Security Advisory</h3>
               <p className="text-[11px] leading-loose opacity-70 font-medium">Use PhishGuard Pro to analyze email headers, body content, and URL metadata for maximum detection accuracy.</p>
               <div className="mt-6 flex gap-1 justify-end">
                  {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-white/20" />)}
               </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-24 border-t border-slate-100 dark:border-slate-800/60 py-16 text-center px-8">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 dark:text-slate-700">
           &copy; {new Date().getFullYear()} PhishGuard Security Systems | Enterprise Intelligence
         </p>
      </footer>
    </div>
  );
};

export default App;
