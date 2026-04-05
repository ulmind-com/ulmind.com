import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Upload, User, GraduationCap, Code2, FolderOpen, ClipboardCheck,
  Sparkles, Plus, Trash2, ChevronRight, ChevronLeft, Briefcase, Clock,
} from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

/* ── Types ── */
interface Project {
  title: string; description: string; technologies: string; role: string; url: string;
}

interface FormState {
  name: string; email: string; phone: string; location: string; linkedIn: string; portfolio: string;
  professionalSummary: string; qualification: string; specialization: string; university: string;
  yearOfPassing: string; cgpa: string; certifications: string;
  coreSkills: string[]; additionalSkills: string[];
  isFresher: boolean; company: string; role: string; duration: string; responsibilities: string; achievements: string;
  projects: Project[];
  resume: File | null; coverLetter: File | null; certificates: File | null;
  whyJoin: string; whyHire: string; whatDifferent: string;
  noticePeriod: string; relocate: string; workMode: string;
  currentCTC: string; expectedCTC: string;
  appliedBefore: string; referral: string; anythingElse: string;
  infoAccurate: boolean; agreeTerms: boolean; agreePrivacy: boolean;
}

const INIT_PROJECT: Project = { title: "", description: "", technologies: "", role: "", url: "" };

const INIT: FormState = {
  name: "", email: "", phone: "", location: "", linkedIn: "", portfolio: "",
  professionalSummary: "", qualification: "", specialization: "", university: "",
  yearOfPassing: "", cgpa: "", certifications: "",
  coreSkills: [], additionalSkills: [],
  isFresher: false, company: "", role: "", duration: "", responsibilities: "", achievements: "",
  projects: [{ ...INIT_PROJECT }],
  resume: null, coverLetter: null, certificates: null,
  whyJoin: "", whyHire: "", whatDifferent: "",
  noticePeriod: "", relocate: "", workMode: "",
  currentCTC: "", expectedCTC: "",
  appliedBefore: "", referral: "", anythingElse: "",
  infoAccurate: false, agreeTerms: false, agreePrivacy: false,
};

const STEPS = [
  { id: 1, label: "Personal Info", icon: User },
  { id: 2, label: "Education", icon: GraduationCap },
  { id: 3, label: "Skills & Exp", icon: Code2 },
  { id: 4, label: "Projects & Docs", icon: FolderOpen },
  { id: 5, label: "Final Details", icon: ClipboardCheck },
];

const QUALIFICATIONS = ["B.Tech", "BCA", "BSc", "MSc", "MCA", "MBA", "M.Tech", "PhD", "Diploma", "Other"];

const JOB_SKILLS: Record<string, { core: string[]; extra: string[] }> = {
  "Java Developer": {
    core: ["Java", "Spring Boot", "MySQL", "MongoDB", "REST APIs", "Hibernate"],
    extra: ["Docker", "AWS", "Git", "Microservices", "Kafka", "Redis", "CI/CD", "Kubernetes"],
  },
  "Full Stack Developer": {
    core: ["React", "Node.js", "MongoDB", "REST APIs", "TypeScript", "Git"],
    extra: ["Next.js", "PostgreSQL", "Docker", "AWS", "Redis", "GraphQL", "CI/CD", "Tailwind CSS"],
  },
  "Mobile App Developer": {
    core: ["React Native", "Flutter", "Android", "iOS", "REST APIs"],
    extra: ["Firebase", "TypeScript", "Redux", "Swift", "Kotlin", "Git", "CI/CD"],
  },
  "Graphics Designer": {
    core: ["Photoshop", "Illustrator", "Figma", "Brand Design"],
    extra: ["After Effects", "InDesign", "Canva", "UI/UX", "3D Design", "Motion Graphics"],
  },
  "Video Editor": {
    core: ["Premiere Pro", "After Effects", "Motion Graphics"],
    extra: ["DaVinci Resolve", "Final Cut Pro", "Photoshop", "Sound Design", "Color Grading"],
  },
};

/* ── Shared classes ── */
const inputCls = "bg-white/70 dark:bg-white/[0.06] border-slate-200 dark:border-white/10 focus-visible:ring-cyan-500/40 rounded-xl h-12 shadow-sm text-sm";
const selectCls = "w-full px-4 py-3.5 rounded-xl bg-white/70 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 shadow-sm text-sm transition-colors text-slate-800 dark:text-slate-200 appearance-none cursor-pointer";
const labelCls = "text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider";
const sectionCls = "space-y-4 relative rounded-2xl p-4 sm:p-6 bg-white/40 dark:bg-white/[0.03] border border-white/60 dark:border-white/8 shadow-sm";

/* ── Helper components (defined OUTSIDE parent to prevent re-creation on re-render) ── */
const Field = ({ label, children, helper, required = true }: { label: string; children: React.ReactNode; helper?: string; required?: boolean }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-2">
      <label className={labelCls}>{label}</label>
      {required && <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Required</span>}
    </div>
    {children}
    {helper && <p className="text-[11px] text-slate-400 dark:text-slate-500 pl-1">{helper}</p>}
  </div>
);

const SelectField = ({ label, value, onChange, options, placeholder, helper, required = true }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder: string; helper?: string; required?: boolean;
}) => (
  <Field label={label} helper={helper} required={required}>
    <div className="relative">
      <select required={required} value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
      </div>
    </div>
  </Field>
);

const FileField = ({ label, file, onChange, accept = ".pdf,.doc,.docx", helper, required = false }: {
  label: string; file: File | null; onChange: (f: File | null) => void; accept?: string; helper?: string; required?: boolean;
}) => (
  <Field label={label} required={required}>
    <label className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-md border border-dashed border-slate-300 dark:border-white/15 cursor-pointer hover:border-[#ff5a5f]/40 transition-colors shadow-sm group">
      <div className="w-10 h-10 rounded-xl bg-[#ff5a5f]/10 flex items-center justify-center border border-[#ff5a5f]/15 group-hover:scale-105 transition-transform shrink-0">
        <Upload className="w-5 h-5 text-[#ff5a5f]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{file ? file.name : "Choose a file..."}</p>
        <p className="text-[10px] text-slate-400">{helper || "PDF preferred — max 5MB"}</p>
      </div>
      <input type="file" className="hidden" accept={accept} required={required} onChange={(e) => onChange(e.target.files?.[0] || null)} />
    </label>
  </Field>
);

const Checkbox = ({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) => (
  <label className="flex items-start gap-3 cursor-pointer">
    <div className="relative mt-0.5">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-white/20 bg-white/60 dark:bg-white/5 peer-checked:bg-[#ff5a5f] peer-checked:border-[#ff5a5f] transition-all flex items-center justify-center">
        {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
      </div>
    </div>
    <span className="text-sm text-slate-600 dark:text-slate-400 leading-snug">{children}</span>
  </label>
);

const SkillTags = ({ items, selected, onToggle }: { items: string[]; selected: string[]; onToggle: (s: string) => void }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((s) => (
      <button key={s} type="button" onClick={() => onToggle(s)}
        className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all duration-200 touch-manipulation ${
          selected.includes(s)
            ? "bg-[#ff5a5f] text-white border-[#ff5a5f] shadow-[0_0_12px_rgba(255,90,95,0.3)]"
            : "bg-white/80 dark:bg-black/40 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-[#ff5a5f]/40 active:scale-95 shadow-sm"
        }`}
      >{s}</button>
    ))}
  </div>
);

/* ── Component ── */
interface Props {
  job: { title: string; department: string };
  onClose: () => void;
}

const CareerApplicationForm: React.FC<Props> = ({ job, onClose }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({ ...INIT });
  const [captchaOk, setCaptchaOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const skills = JOB_SKILLS[job.title] || JOB_SKILLS["Java Developer"];

  const set = useCallback(<K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
  }, []);

  const toggleSkill = (arr: "coreSkills" | "additionalSkills", s: string) => {
    setForm((p) => ({
      ...p,
      [arr]: p[arr].includes(s) ? p[arr].filter((x) => x !== s) : [...p[arr], s],
    }));
  };

  const updateProject = (i: number, k: keyof Project, v: string) => {
    setForm((p) => {
      const projects = [...p.projects];
      projects[i] = { ...projects[i], [k]: v };
      return { ...p, projects };
    });
  };

  const addProject = () => {
    if (form.projects.length < 3) setForm((p) => ({ ...p, projects: [...p.projects, { ...INIT_PROJECT }] }));
  };

  const removeProject = (i: number) => {
    if (form.projects.length > 1) setForm((p) => ({ ...p, projects: p.projects.filter((_, idx) => idx !== i) }));
  };

  /* ── Validation ── */
  const validateStep = (): boolean => {
    const fail = (msg: string) => { toast({ title: "Missing Information", description: msg, variant: "destructive" }); return false; };
    if (step === 1) {
      if (!form.name || !form.email || !form.phone || !form.location || !form.linkedIn || !form.portfolio) return fail("Please fill all personal information fields.");
    } else if (step === 2) {
      if (!form.professionalSummary || !form.qualification || !form.specialization || !form.university || !form.yearOfPassing || !form.cgpa) return fail("Please fill all education fields.");
    } else if (step === 3) {
      if (form.coreSkills.length === 0) return fail("Please select at least one core skill.");
      if (!form.isFresher && (!form.role || !form.duration || !form.responsibilities)) return fail("Please fill work experience or select Fresher.");
    } else if (step === 4) {
      if (!form.projects[0].title || !form.projects[0].description) return fail("Please add at least one project.");
      if (!form.resume) return fail("Please upload your resume.");
    } else if (step === 5) {
      if (!form.whyJoin || !form.whyHire || !form.whatDifferent) return fail("Please answer all screening questions.");
      if (!form.noticePeriod || !form.relocate || !form.workMode) return fail("Please fill availability preferences.");
      if (!form.infoAccurate || !form.agreeTerms || !form.agreePrivacy) return fail("Please accept all declarations.");
      if (!captchaOk) return fail("Please complete the CAPTCHA verification.");
    }
    return true;
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, 5)); };
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    const fd = new FormData();
    fd.append("_subject", `Career Application – ${job.title}`);
    fd.append("_template", "table");
    fd.append("_captcha", "false");
    fd.append("Position", job.title);
    fd.append("Name", form.name);
    fd.append("Email", form.email);
    fd.append("Phone", form.phone);
    fd.append("Location", form.location);
    fd.append("LinkedIn", form.linkedIn);
    fd.append("Portfolio / GitHub", form.portfolio);
    fd.append("Professional Summary", form.professionalSummary);
    fd.append("Qualification", form.qualification);
    fd.append("Specialization", form.specialization);
    fd.append("University", form.university);
    fd.append("Year of Passing", form.yearOfPassing);
    fd.append("CGPA / Percentage", form.cgpa);
    fd.append("Certifications", form.certifications || "N/A");
    fd.append("Core Skills", form.coreSkills.join(", "));
    fd.append("Additional Skills", form.additionalSkills.length > 0 ? form.additionalSkills.join(", ") : "N/A");
    fd.append("Experience Level", form.isFresher ? "Fresher" : "Experienced");
    if (!form.isFresher) {
      fd.append("Current Company", form.company || "N/A");
      fd.append("Role", form.role);
      fd.append("Duration", form.duration);
      fd.append("Key Responsibilities", form.responsibilities);
      fd.append("Achievements", form.achievements || "N/A");
    }
    form.projects.forEach((p, i) => {
      if (p.title) {
        fd.append(`Project ${i + 1} Title`, p.title);
        fd.append(`Project ${i + 1} Description`, p.description);
        fd.append(`Project ${i + 1} Tech`, p.technologies);
        fd.append(`Project ${i + 1} Role`, p.role);
        fd.append(`Project ${i + 1} URL`, p.url || "N/A");
      }
    });
    if (form.resume) fd.append("Resume", form.resume);
    if (form.coverLetter) fd.append("Cover Letter", form.coverLetter);
    if (form.certificates) fd.append("Certificates", form.certificates);
    fd.append("Why Join", form.whyJoin);
    fd.append("Why Hire You", form.whyHire);
    fd.append("What Makes Different", form.whatDifferent);
    fd.append("Notice Period", form.noticePeriod);
    fd.append("Willing to Relocate", form.relocate);
    fd.append("Preferred Work Mode", form.workMode);
    fd.append("Current CTC", form.currentCTC || "N/A");
    fd.append("Expected CTC", form.expectedCTC || "N/A");
    fd.append("Applied Before", form.appliedBefore || "N/A");
    fd.append("Referral", form.referral || "N/A");
    fd.append("Additional Info", form.anythingElse || "N/A");

    try {
      const res = await fetch("https://formsubmit.co/ulmindpvtltd@gmail.com", { method: "POST", body: fd });
      if (res.ok) {
        toast({ title: "Application Successfully Submitted 🎉", description: "Our hiring team is reviewing your profile. If shortlisted, we will reach out shortly." });
        onClose();
      } else throw new Error();
    } catch {
      toast({ title: "Submission Failed", description: "Please try again later.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Step Content ── */
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className={sectionCls}>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><User className="w-5 h-5 text-[#ff5a5f]" /> Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name"><Input required placeholder="John Doe" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} /></Field>
              <Field label="Email Address" helper="Professional email only"><Input type="email" required placeholder="john@company.com" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} /></Field>
              <Field label="Phone Number" helper="With country code"><Input required placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} /></Field>
              <Field label="Current Location" helper="City, State, Country"><Input required placeholder="Mumbai, Maharashtra, India" value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls} /></Field>
              <Field label="LinkedIn Profile URL"><Input required placeholder="https://linkedin.com/in/yourname" value={form.linkedIn} onChange={(e) => set("linkedIn", e.target.value)} className={inputCls} /></Field>
              <Field label="Portfolio / GitHub" helper="Strongly recommended"><Input required placeholder="https://github.com/yourname" value={form.portfolio} onChange={(e) => set("portfolio", e.target.value)} className={inputCls} /></Field>
            </div>
          </div>
        );
      case 2:
        return (
          <>
            <div className={sectionCls}>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#ff5a5f]" /> Professional Summary</h3>
              <Field label="About You" helper='e.g. "Java developer with 2+ years experience in building REST APIs and scalable backend systems."'>
                <Textarea required rows={3} placeholder="Write a 2–3 line summary about yourself, your expertise, and career focus..." value={form.professionalSummary} onChange={(e) => set("professionalSummary", e.target.value)}
                  className="bg-white/70 dark:bg-white/[0.06] border-slate-200 dark:border-white/10 focus-visible:ring-cyan-500/40 rounded-xl resize-none shadow-sm text-sm" />
              </Field>
            </div>
            <div className={sectionCls}>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><GraduationCap className="w-5 h-5 text-[#ff5a5f]" /> Education Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField label="Highest Qualification" value={form.qualification} onChange={(v) => set("qualification", v)} options={QUALIFICATIONS} placeholder="Select qualification" />
                <Field label="Specialization / Stream"><Input required placeholder="Computer Science" value={form.specialization} onChange={(e) => set("specialization", e.target.value)} className={inputCls} /></Field>
                <Field label="University / Institution"><Input required placeholder="IIT Kharagpur" value={form.university} onChange={(e) => set("university", e.target.value)} className={inputCls} /></Field>
                <Field label="Year of Passing"><Input required placeholder="2024" value={form.yearOfPassing} onChange={(e) => set("yearOfPassing", e.target.value)} className={inputCls} /></Field>
                <Field label="CGPA / Percentage"><Input required placeholder="8.5 / 85%" value={form.cgpa} onChange={(e) => set("cgpa", e.target.value)} className={inputCls} /></Field>
                <Field label="Certifications" required={false}><Input placeholder="AWS Certified, etc." value={form.certifications} onChange={(e) => set("certifications", e.target.value)} className={inputCls} /></Field>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className={sectionCls}>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><Code2 className="w-5 h-5 text-[#ff5a5f]" /> Technical Skills</h3>
              <Field label="Core Skills" helper="Select all that apply">
                <SkillTags items={skills.core} selected={form.coreSkills} onToggle={(s) => toggleSkill("coreSkills", s)} />
              </Field>
              <Field label="Additional Skills" required={false} helper="Optional but recommended">
                <SkillTags items={skills.extra} selected={form.additionalSkills} onToggle={(s) => toggleSkill("additionalSkills", s)} />
              </Field>
            </div>
            <div className={sectionCls}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><Briefcase className="w-5 h-5 text-[#ff5a5f]" /> Work Experience</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFresher} onChange={(e) => set("isFresher", e.target.checked)} className="sr-only peer" />
                  <div className="w-10 h-6 rounded-full bg-slate-200 dark:bg-white/10 peer-checked:bg-[#ff5a5f] transition-colors relative">
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.isFresher ? "left-5" : "left-1"}`} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Fresher</span>
                </label>
              </div>
              {!form.isFresher && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Current Company" required={false}><Input placeholder="Company name" value={form.company} onChange={(e) => set("company", e.target.value)} className={inputCls} /></Field>
                    <Field label="Role / Position"><Input required placeholder="Backend Developer" value={form.role} onChange={(e) => set("role", e.target.value)} className={inputCls} /></Field>
                    <Field label="Duration" helper="Start – End"><Input required placeholder="Jan 2023 – Present" value={form.duration} onChange={(e) => set("duration", e.target.value)} className={inputCls} /></Field>
                    <Field label="Achievements" required={false}><Input placeholder="Key impacts or awards" value={form.achievements} onChange={(e) => set("achievements", e.target.value)} className={inputCls} /></Field>
                  </div>
                  <Field label="Key Responsibilities">
                    <Textarea required rows={3} placeholder="Describe your main responsibilities..." value={form.responsibilities} onChange={(e) => set("responsibilities", e.target.value)}
                      className="bg-white/70 dark:bg-white/[0.06] border-slate-200 dark:border-white/10 focus-visible:ring-cyan-500/40 rounded-xl resize-none shadow-sm text-sm" />
                  </Field>
                </motion.div>
              )}
              {form.isFresher && <p className="text-sm text-slate-400 dark:text-slate-500 italic py-2">No prior work experience — that's perfectly fine! Focus on your projects and skills.</p>}
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className={sectionCls}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><FolderOpen className="w-5 h-5 text-[#ff5a5f]" /> Projects</h3>
                {form.projects.length < 3 && (
                  <button type="button" onClick={addProject} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#ff5a5f]/10 text-[#ff5a5f] border border-[#ff5a5f]/15 hover:bg-[#ff5a5f]/20 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                )}
              </div>
              {form.projects.map((p, i) => (
                <div key={i} className="space-y-3 p-4 rounded-xl bg-white/30 dark:bg-white/[0.02] border border-white/50 dark:border-white/6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Project {i + 1}</span>
                    {form.projects.length > 1 && <button type="button" onClick={() => removeProject(i)} className="text-rose-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Project Title"><Input required placeholder="E-commerce Platform" value={p.title} onChange={(e) => updateProject(i, "title", e.target.value)} className={inputCls} /></Field>
                    <Field label="Technologies Used"><Input required placeholder="React, Node.js, MongoDB" value={p.technologies} onChange={(e) => updateProject(i, "technologies", e.target.value)} className={inputCls} /></Field>
                    <Field label="Your Role"><Input required placeholder="Full Stack Developer" value={p.role} onChange={(e) => updateProject(i, "role", e.target.value)} className={inputCls} /></Field>
                    <Field label="GitHub / Live URL" required={false}><Input placeholder="https://github.com/..." value={p.url} onChange={(e) => updateProject(i, "url", e.target.value)} className={inputCls} /></Field>
                  </div>
                  <Field label="Description">
                    <Textarea required rows={2} placeholder="What you built and the problem it solves..." value={p.description} onChange={(e) => updateProject(i, "description", e.target.value)}
                      className="bg-white/70 dark:bg-white/[0.06] border-slate-200 dark:border-white/10 focus-visible:ring-cyan-500/40 rounded-xl resize-none shadow-sm text-sm" />
                  </Field>
                </div>
              ))}
            </div>
            <div className={sectionCls}>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><Upload className="w-5 h-5 text-[#ff5a5f]" /> Documents</h3>
              <FileField label="Resume" file={form.resume} onChange={(f) => set("resume", f)} accept=".pdf" helper="PDF only — max 5MB" required />
              <FileField label="Cover Letter" file={form.coverLetter} onChange={(f) => set("coverLetter", f)} helper="Optional — PDF preferred" />
              <FileField label="Certificates" file={form.certificates} onChange={(f) => set("certificates", f)} helper="Optional — Combine into single PDF" />
            </div>
          </>
        );
      case 5:
        return (
          <>
            <div className={sectionCls}>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-[#ff5a5f]" /> Screening Questions</h3>
              <Field label="Why do you want to join ULMIND?">
                <Textarea required rows={3} placeholder="Share what excites you about our company..." value={form.whyJoin} onChange={(e) => set("whyJoin", e.target.value)}
                  className="bg-white/70 dark:bg-white/[0.06] border-slate-200 dark:border-white/10 focus-visible:ring-cyan-500/40 rounded-xl resize-none shadow-sm text-sm" />
              </Field>
              <Field label="Why should we hire you?">
                <Textarea required rows={3} placeholder="Highlight your strengths and unique value..." value={form.whyHire} onChange={(e) => set("whyHire", e.target.value)}
                  className="bg-white/70 dark:bg-white/[0.06] border-slate-200 dark:border-white/10 focus-visible:ring-cyan-500/40 rounded-xl resize-none shadow-sm text-sm" />
              </Field>
              <Field label="What makes you different?">
                <Textarea required rows={3} placeholder="What sets you apart from other candidates..." value={form.whatDifferent} onChange={(e) => set("whatDifferent", e.target.value)}
                  className="bg-white/70 dark:bg-white/[0.06] border-slate-200 dark:border-white/10 focus-visible:ring-cyan-500/40 rounded-xl resize-none shadow-sm text-sm" />
              </Field>
            </div>
            <div className={sectionCls}>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><Clock className="w-5 h-5 text-[#ff5a5f]" /> Availability & Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SelectField label="Notice Period" value={form.noticePeriod} onChange={(v) => set("noticePeriod", v)} options={["Immediate", "15 Days", "30 Days", "60 Days", "90 Days"]} placeholder="Select" />
                <SelectField label="Willing to Relocate?" value={form.relocate} onChange={(v) => set("relocate", v)} options={["Yes", "No"]} placeholder="Select" />
                <SelectField label="Preferred Work Mode" value={form.workMode} onChange={(v) => set("workMode", v)} options={["Remote", "Hybrid", "On-site"]} placeholder="Select" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Current CTC" required={false} helper='Write "Negotiable" if preferred'><Input placeholder="e.g. ₹5 LPA or Negotiable" value={form.currentCTC} onChange={(e) => set("currentCTC", e.target.value)} className={inputCls} /></Field>
                <Field label="Expected CTC" required={false} helper='Write "As per company standards" if preferred'><Input placeholder="e.g. ₹8 LPA or Negotiable" value={form.expectedCTC} onChange={(e) => set("expectedCTC", e.target.value)} className={inputCls} /></Field>
              </div>
            </div>
            <div className={sectionCls}>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Additional Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField label="Applied Before?" value={form.appliedBefore} onChange={(v) => set("appliedBefore", v)} options={["Yes", "No"]} placeholder="Select" required={false} />
                <Field label="Referral" required={false}><Input placeholder="Employee name (if any)" value={form.referral} onChange={(e) => set("referral", e.target.value)} className={inputCls} /></Field>
              </div>
              <Field label="Anything else?" required={false}>
                <Textarea rows={2} placeholder="Any additional information you'd like us to know..." value={form.anythingElse} onChange={(e) => set("anythingElse", e.target.value)}
                  className="bg-white/70 dark:bg-white/[0.06] border-slate-200 dark:border-white/10 focus-visible:ring-cyan-500/40 rounded-xl resize-none shadow-sm text-sm" />
              </Field>
            </div>
            <div className={sectionCls}>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Declaration & Consent</h3>
              <div className="space-y-3">
                <Checkbox checked={form.infoAccurate} onChange={(v) => set("infoAccurate", v)}>I confirm that the information provided is <span className="font-semibold text-slate-800 dark:text-white">accurate and complete</span>.</Checkbox>
                <Checkbox checked={form.agreeTerms} onChange={(v) => set("agreeTerms", v)}>I agree to the <span className="text-[#ff5a5f] font-semibold">Terms & Conditions</span></Checkbox>
                <Checkbox checked={form.agreePrivacy} onChange={(v) => set("agreePrivacy", v)}>I agree to the <span className="text-[#ff5a5f] font-semibold">Privacy Policy</span></Checkbox>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mt-2">🔒 Your data is securely processed and never shared without consent.</p>
            </div>
            <div className="w-full overflow-x-auto">
              <div className="rounded-xl shadow-sm border border-white/30 dark:border-white/8 inline-block min-w-[302px]">
                <ReCAPTCHA sitekey="6Lc5pTgsAAAAAMCtIJaKj5iK79KYT6hSfwE4CMBk" onChange={() => setCaptchaOk(true)} theme="light" />
              </div>
            </div>
          </>
        );
      default: return null;
    }
  };

  const progress = (step / 5) * 100;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-50 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-4 px-3 sm:px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }} className="career-modal-glass w-full max-w-3xl relative my-4" onClick={(e) => e.stopPropagation()}>

        {/* Top accent */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#ff5a5f] via-pink-500 to-[#ff5a5f]" />

        {/* Corner glows */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#ff5a5f]/15 dark:bg-[#ff5a5f]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-cyan-400/10 dark:bg-cyan-500/8 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 p-5 sm:p-8">
          {/* Close */}
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/60 dark:border-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-white active:scale-90 transition-all shadow-sm z-20">
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#ff5a5f]/10 text-[#ff5a5f] border border-[#ff5a5f]/15 mb-3">
              <Sparkles className="w-3 h-3" />Application Form
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              Join Our Team as a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5a5f] to-pink-400">{job.title}</span>
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">This application takes approximately 3–5 minutes to complete.</p>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              {STEPS.map((s) => (
                <div key={s.id} className={`flex items-center gap-1.5 text-[10px] font-bold tracking-wide transition-colors ${step >= s.id ? "text-[#ff5a5f]" : "text-slate-400 dark:text-slate-600"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${
                    step > s.id ? "bg-[#ff5a5f] border-[#ff5a5f] text-white" : step === s.id ? "border-[#ff5a5f] text-[#ff5a5f] bg-[#ff5a5f]/10" : "border-slate-300 dark:border-white/15 text-slate-400"
                  }`}>
                    {step > s.id ? "✓" : s.id}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-[#ff5a5f] to-pink-500" animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 font-medium">Step {step} of 5 — {STEPS[step - 1].label}</p>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="space-y-5">
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-7 pt-5 border-t border-white/40 dark:border-white/8">
            {step > 1 ? (
              <button type="button" onClick={prev} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/10 active:scale-95 transition-all shadow-sm">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
            ) : <div />}

            {step < 5 ? (
              <button type="button" onClick={next} className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-[#ff5a5f] to-pink-500 text-white hover:from-[#e84e53] hover:to-pink-600 active:scale-95 transition-all shadow-[0_4px_16px_rgba(255,90,95,0.3)]">
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={submitting}
                className="flex items-center gap-2 px-7 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-[#ff5a5f] to-pink-500 text-white hover:from-[#e84e53] hover:to-pink-600 active:scale-[0.98] transition-colors shadow-[0_4px_24px_rgba(255,90,95,0.35)] disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? (<><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Submitting...</>) : (<>Complete Your Application <Send className="w-4 h-4" /></>)}
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-3">Our team will review your application within 24–48 hours.</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CareerApplicationForm;
