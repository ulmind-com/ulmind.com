import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Search, ShieldCheck, XCircle, Award, User, Hash } from "lucide-react";
import { useSearchParams } from "react-router-dom";

type Certificate = { id: string; name: string; status: string };

const CERTIFICATES: Record<string, Certificate> = {
  "ULM-2026-001": {
    id: "ULM-2026-001",
    name: "Buddhadeb Giri",
    status: "Successfully Verified by ULMIND",
  },
  "ULM-2026-002": {
    id: "ULM-2026-002",
    name: "Arnab Senapati",
    status: "Successfully Verified by ULMIND",
  },
  "ULM-2026-003": {
    id: "ULM-2026-003",
    name: "Bikram Mondal",
    status: "Successfully Verified by ULMIND",
  },
  "ULM-2026-004": {
    id: "ULM-2026-004",
    name: "Dipan Sahu",
    status: "Successfully Verified by ULMIND",
  },
  "ULM-2026-005": {
    id: "ULM-2026-005",
    name: "Nilabhra Biswas",
    status: "Successfully Verified by ULMIND",
  },
};

const CertificateVerification = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<Certificate | null | "invalid">(null);

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setQuery(idFromUrl);
      handleSearch(idFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = (searchId: string = query) => {
    if (!searchId.trim()) return;
    setIsSearching(true);
    setResult(null);

    setTimeout(() => {
      const found = CERTIFICATES[searchId.trim().toUpperCase()];
      if (found) {
        setResult(found);
      } else {
        setResult("invalid");
      }
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 relative overflow-hidden flex flex-col items-center justify-center dark:bg-[#050B14] bg-slate-50">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-3xl z-10 space-y-10">
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center justify-center p-4 rounded-3xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2 shadow-inner"
          >
            <ShieldCheck size={48} className="stroke-[1.5]" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Credential <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Verification</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Verify the authenticity of ULMIND certificates and internship credentials globally.
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/80 dark:bg-[#0B141A]/80 backdrop-blur-2xl border border-slate-200/50 dark:border-white/5 rounded-[2rem] p-6 md:p-10 shadow-2xl shadow-blue-900/5 dark:shadow-blue-900/10"
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Search size={22} />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter Certificate ID "
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-lg font-medium tracking-wide shadow-inner"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={isSearching || !query.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed min-w-[180px]"
            >
              {isSearching ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Verify Now</>
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {result === "invalid" && (
              <motion.div
                key="invalid"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="bg-red-50/80 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-3xl p-8 text-center backdrop-blur-sm"
              >
                <XCircle size={64} className="mx-auto text-red-500 mb-4" />
                <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-3">Certificate Not Found</h3>
                <p className="text-red-600 dark:text-red-300 text-lg">
                  The certificate ID you entered is invalid or does not exist in our records. Please check the ID and try again.
                </p>
              </motion.div>
            )}

            {result !== null && result !== "invalid" && (
              <motion.div
                key="valid"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="relative overflow-hidden rounded-3xl"
              >
                {/* Premium gradient glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 dark:from-blue-500/10 dark:to-indigo-500/10 z-0" />

                <div className="relative z-10 bg-white/90 dark:bg-[#0B1A24]/90 backdrop-blur-md border border-blue-100 dark:border-blue-500/20 rounded-3xl p-8 md:p-12 shadow-2xl">

                  {/* Big Blue Tick */}
                  <div className="flex justify-center mb-8">
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-30 rounded-full animate-pulse" />
                      <CheckCircle size={100} className="text-blue-500 dark:text-blue-400 relative z-10 drop-shadow-lg" />
                    </motion.div>
                  </div>

                  <div className="text-center mb-12 space-y-3">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Verified!</h2>
                    <p className="text-blue-700 dark:text-blue-300 font-medium text-lg max-w-lg mx-auto leading-relaxed">
                      This certificate is valid and was officially issued to the student by <span className="font-bold">ULMIND</span>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-slate-50 dark:bg-[#121E28] border border-slate-100 dark:border-white/5 rounded-2xl p-4 sm:p-6 flex items-center gap-4 hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors">
                      <div className="flex-shrink-0 p-3 sm:p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
                        <Hash size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-1">Certificate ID</p>
                        <p className="text-base sm:text-xl font-bold text-slate-900 dark:text-white break-all">{result.id}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-[#121E28] border border-slate-100 dark:border-white/5 rounded-2xl p-4 sm:p-6 flex items-center gap-4 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors">
                      <div className="flex-shrink-0 p-3 sm:p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                        <User size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-1">Student Name</p>
                        <p className="text-base sm:text-xl font-bold text-slate-900 dark:text-white truncate">{result.name}</p>
                      </div>
                    </div>

                    <div className="md:col-span-2 bg-slate-50 dark:bg-[#121E28] border border-slate-100 dark:border-white/5 rounded-2xl p-4 sm:p-6 flex items-center gap-4 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-colors">
                      <div className="flex-shrink-0 p-3 sm:p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
                        <Award size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-1">Status</p>
                        <p className="text-base sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">{result.status}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </div>
  );
};

export default CertificateVerification;
