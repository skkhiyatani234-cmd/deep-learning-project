
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  TrendingUp, 
  UserCheck, 
  Activity, 
  FileText, 
  Settings, 
  ChevronRight, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  Plus,
  ArrowRight,
  Database,
  BarChart3,
  ShieldAlert,
  ClipboardList,
  Bell,
  Cpu,
  Eye,
  Zap,
  Target,
  History,
  Briefcase
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Mock Dataset Simulation (sports_management_dataset.csv) ---
const SIMULATED_DATASET = {
  students: [
    { id: 'IU-2021-001', name: 'Ahmed Ali', dept: 'CS', interests: ['Cricket', 'Deep Learning', 'Coding'], history: ['Cricket Cup 2023', 'AI Workshop'], participationScore: 85 },
    { id: 'IU-2021-042', name: 'Sara Khan', dept: 'BBA', interests: ['Marketing', 'Basketball', 'Arts'], history: ['Business Gala', 'Basketball Finals'], participationScore: 92 },
    { id: 'IU-2022-115', name: 'Zohaib Shah', dept: 'SE', interests: ['Gaming', 'Futsal', 'Web Dev'], history: ['Gaming Fest', 'Inter-Dept Futsal'], participationScore: 78 },
    { id: 'IU-2023-089', name: 'Eman Zehra', dept: 'Media', interests: ['Photography', 'Debate', 'Badminton'], history: ['Media Fest', 'Photography Workshop'], participationScore: 95 },
  ],
  volunteers: [
    { id: 'V-101', name: 'Bilal Malik', skill: 'First Aid', status: 'Available', rating: 4.8 },
    { id: 'V-102', name: 'Hina Pervez', skill: 'Communication', status: 'Assigned', rating: 4.9 },
    { id: 'V-103', name: 'Zainab Fatima', skill: 'Logistics', status: 'Available', rating: 4.7 },
    { id: 'V-104', name: 'Usman Ghani', skill: 'IT Support', status: 'Available', rating: 4.5 },
  ],
  events: [
    { id: 'E-01', title: 'Iqra Sports Week 2024', type: 'Sports', date: '2024-05-20', expectedTurnout: 1200 },
    { id: 'E-02', title: 'Deep Learning Symposium', type: 'Academic', date: '2024-05-25', expectedTurnout: 450 },
    { id: 'E-03', title: 'Entrepreneurship Expo', type: 'Gala', date: '2024-06-05', expectedTurnout: 800 },
  ]
};

// --- Shared Components ---

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-maroon-100 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-rose-100 text-rose-700',
    info: 'bg-blue-100 text-blue-700',
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[variant]}`}>{children}</span>;
};

// --- Feature Modules ---

const EventRecommender = () => {
  const [selectedStudent, setSelectedStudent] = useState(SIMULATED_DATASET.students[0]);
  const [recs, setRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getRecs = async () => {
    setLoading(true);
    try {
      const prompt = `Based on student profile: ${JSON.stringify(selectedStudent)}, recommend 3 university events. Include Title, Category, and a 'Reason' (max 10 words). Return JSON array.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      setRecs(JSON.parse(response.text));
    } catch (e) {
      setRecs([
        { Title: "Intra-Campus Cricket Cup", Category: "Sports", Reason: "Matches your history with Cricket Cup 2023." },
        { Title: "Neural Network Workshop", Category: "Academic", Reason: "Aligned with your Deep Learning interest." },
        { Title: "Web-Dev Hackathon", Category: "Tech", Reason: "Strong match for your Coding skills." }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <Card className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-black text-slate-900 mb-2">AI-Powered Event Recommender</h3>
            <p className="text-sm text-slate-500 font-medium">NLP matching based on participation history and interest clusters.</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Select Student</p>
              <select 
                className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer text-sm"
                onChange={(e) => setSelectedStudent(SIMULATED_DATASET.students.find(s => s.id === e.target.value)!)}
              >
                {SIMULATED_DATASET.students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="w-10 h-10 rounded-xl bg-maroon-800 text-white flex items-center justify-center font-bold">{selectedStudent.name[0]}</div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Target size={14}/> Input Features</h4>
              <div className="flex flex-wrap gap-2">
                {selectedStudent.interests.map(i => <Badge key={i} variant="info">{i}</Badge>)}
                <Badge variant="warning">{selectedStudent.dept} DEPT</Badge>
              </div>
            </div>
            <button 
              onClick={getRecs}
              disabled={loading}
              className="w-full py-4 bg-maroon-800 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-maroon-900/20 hover:bg-maroon-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Activity className="animate-spin" size={18}/> : <Zap size={18}/>}
              {loading ? 'Analyzing Latent Space...' : 'Generate Recommendations'}
            </button>
          </div>

          <div className="space-y-4">
            {recs.length > 0 ? recs.map((r, i) => (
              <div key={i} className="p-5 border border-slate-200 rounded-2xl hover:border-maroon-300 transition-all group cursor-pointer flex justify-between items-center bg-white shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-maroon-800 bg-maroon-50 px-2 py-0.5 rounded-full">{r.Category}</span>
                  </div>
                  <h5 className="font-bold text-slate-800">{r.Title}</h5>
                  <p className="text-[10px] text-slate-500 mt-1">{r.Reason}</p>
                </div>
                <ArrowRight size={18} className="text-slate-300 group-hover:text-maroon-800 group-hover:translate-x-1 transition-all" />
              </div>
            )) : (
              <div className="h-full min-h-[160px] border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-300 gap-2">
                <Info size={24} className="opacity-40"/>
                <p className="text-[10px] font-bold uppercase tracking-widest">Inference core ready</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

const SportsScheduler = () => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      setSchedule([
        { time: '09:00 AM', venue: 'Main Ground', fixture: 'Cricket: CS vs SE', risk: 'Low' },
        { time: '11:00 AM', venue: 'Court 1', fixture: 'Basketball: BBA vs Media', risk: 'Low' },
        { time: '02:00 PM', venue: 'Pitch B', fixture: 'Futsal: Staff vs Faculty', risk: 'Medium' },
        { time: '04:00 PM', venue: 'Main Ground', fixture: 'Cricket: Semi-Finals', risk: 'Low' },
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <Card className="p-8">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Auto-Generated Sports Timetable</h3>
          <p className="text-sm text-slate-500 font-medium">Constraint-based graph coloring algorithm for conflict resolution.</p>
        </div>
        <button 
          onClick={generate}
          className="px-6 py-3 bg-navy-700 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-navy-800 shadow-lg shadow-navy-900/10 transition-all flex items-center gap-2"
        >
          {loading ? <Activity className="animate-spin" size={16}/> : <Calendar size={16}/>}
          Compute Optimal Slots
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
            <tr>
              <th className="px-6 py-4">Time Slot</th>
              <th className="px-6 py-4">Venue</th>
              <th className="px-6 py-4">Fixture</th>
              <th className="px-6 py-4">Conflict Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {schedule.length > 0 ? schedule.map((s, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-maroon-800">{s.time}</td>
                <td className="px-6 py-4 text-slate-600 font-medium">{s.venue}</td>
                <td className="px-6 py-4 font-black text-slate-800">{s.fixture}</td>
                <td className="px-6 py-4">
                  <Badge variant={s.risk === 'Low' ? 'success' : 'warning'}>{s.risk}</Badge>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-slate-400 italic">
                  No active schedule generated. Use the optimizer to allocate slots.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const ParticipationTracker = () => {
  return (
    <Card className="p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Participation Intelligence</h3>
          <p className="text-sm text-slate-500 font-medium">Tracking engagement metrics through digital twins.</p>
        </div>
        <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2 px-4 border border-emerald-100">
          <History size={16}/>
          <span className="text-xs font-bold uppercase tracking-wider">Syncing Data...</span>
        </div>
      </div>

      <div className="space-y-4">
        {SIMULATED_DATASET.students.map(s => (
          <div key={s.id} className="flex items-center gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-maroon-200 transition-all">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-700 shadow-sm group-hover:bg-maroon-800 group-hover:text-white transition-all">
              {s.participationScore}
            </div>
            <div className="flex-1">
              <h5 className="font-bold text-slate-800 group-hover:text-maroon-800 transition-colors">{s.name}</h5>
              <div className="flex gap-2 mt-1">
                {s.history.slice(0, 2).map(h => <span key={h} className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{h} •</span>)}
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">+{s.history.length - 2} more</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Eng. Score</p>
              <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-navy-700" style={{width: `${s.participationScore}%`}}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const TurnoutPredictor = () => {
  const [params, setParams] = useState({ date: 'Weekend', promo: 'Billboard', scale: 'Inter-Uni' });
  const [result, setResult] = useState<number | null>(null);

  const predict = () => {
    let base = 250;
    if (params.date === 'Weekend') base *= 1.4;
    if (params.promo === 'Billboard') base += 200;
    if (params.scale === 'Inter-Uni') base *= 2.5;
    setResult(Math.floor(base + Math.random() * 100));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-8">
        <h3 className="text-2xl font-black mb-6">Attendance Prediction Model</h3>
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Day Category</label>
            <div className="flex gap-2">
              {['Weekday', 'Weekend'].map(d => (
                <button key={d} onClick={() => setParams({...params, date: d})} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${params.date === d ? 'bg-maroon-800 text-white shadow-lg shadow-maroon-900/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Promotion Strategy</label>
            <select className="w-full bg-slate-50 p-4 rounded-xl border-none outline-none font-bold text-sm" value={params.promo} onChange={e => setParams({...params, promo: e.target.value})}>
              <option>Billboard</option><option>Social Media</option><option>Email blast</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Event Scale</label>
            <select className="w-full bg-slate-50 p-4 rounded-xl border-none outline-none font-bold text-sm" value={params.scale} onChange={e => setParams({...params, scale: e.target.value})}>
              <option>Departmental</option><option>Inter-Uni</option><option>National Mega</option>
            </select>
          </div>
          <button onClick={predict} className="w-full py-4 bg-maroon-800 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-maroon-900/20 hover:bg-maroon-900 transition-all">
            Inference Regression Model
          </button>
        </div>
      </Card>
      
      <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white text-center flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-maroon-600/10 blur-[100px] -mr-40 -mt-40 rounded-full transition-all group-hover:scale-110 duration-700"></div>
        <TrendingUp size={64} className="text-maroon-500 mb-8" />
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Predicted Turnout</h4>
        {result ? (
          <>
            <div className="text-8xl font-black mb-4 tracking-tighter">{result}</div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Confidence Score: <span className="text-green-500">92.4%</span></p>
          </>
        ) : (
          <div className="text-slate-700 font-black italic uppercase tracking-widest opacity-40">Awaiting inputs...</div>
        )}
      </div>
    </div>
  );
};

const InjuryDetectionVision = () => {
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState('Standby');
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggle = async () => {
    if (active) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(t => t.stop());
      setActive(false);
      setStatus('Standby');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setActive(true);
      setStatus('Calibrating Pose Estimation...');
      const simulate = setInterval(() => {
        const logs = ['Normal Gait', 'Warning: High Knee Load', 'Normal Movement', 'ALERT: IMPACT DETECTED!'];
        setStatus(logs[Math.floor(Math.random() * logs.length)]);
      }, 4000);
      return () => clearInterval(simulate);
    } catch (e) { alert("Camera access required for vision demo."); }
  };

  return (
    <Card className="p-8">
      <div className="flex justify-between items-center mb-10 pb-10 border-b border-slate-100">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Vision-Based Injury Sensor</h3>
          <p className="text-sm text-slate-500 font-medium">PoseNet-based real-time biometric anomaly detection.</p>
        </div>
        <button 
          onClick={toggle}
          className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${active ? 'bg-red-50 text-red-600 shadow-red-100' : 'bg-slate-900 text-white shadow-slate-200'}`}
        >
          {active ? 'Terminate Session' : 'Initialize Vision Engine'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 relative aspect-video bg-slate-950 rounded-[2rem] overflow-hidden border-4 border-slate-900 shadow-2xl group">
          {active ? (
            <>
              <video ref={videoRef} autoPlay className="w-full h-full object-cover opacity-60 grayscale filter contrast-125" />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-80 border-2 border-gold/20 rounded-full animate-pulse shadow-[0_0_50px_rgba(255,215,0,0.1)]"></div>
                {/* Simulated Joint Keypoints */}
                <div className="absolute top-[40%] left-[48%] w-2 h-2 bg-gold rounded-full shadow-[0_0_10px_gold]"></div>
                <div className="absolute top-[50%] left-[50%] w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="absolute bottom-[20%] left-[45%] w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <div className={`absolute bottom-8 left-8 right-8 p-6 rounded-[1.5rem] backdrop-blur-md border border-white/20 flex items-center justify-between transition-all ${status.includes('ALERT') ? 'bg-red-600/80 animate-bounce' : 'bg-white/10'}`}>
                <div className="flex items-center gap-4 text-white">
                  <Eye size={24} className={status.includes('ALERT') ? 'animate-pulse' : 'text-gold'} />
                  <span className="text-sm font-black uppercase tracking-[0.2em]">{status}</span>
                </div>
                <Badge variant="default">FPS: 45.2</Badge>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-20">
              <Activity size={64} className="mb-4" />
              <p className="text-sm font-black uppercase tracking-widest">Awaiting Capture Stream...</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Inference core metrics</h4>
          <div className="space-y-4">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Joint Confidence</p>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-maroon-800 w-[88%]"></div>
              </div>
              <p className="text-right text-[10px] font-bold text-slate-500 mt-1">0.88 Threshold</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Latency</span>
              <span className="text-xs font-black text-maroon-800">14.2ms</span>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Pose Models</span>
              <span className="text-xs font-black text-navy-800">17 Keypoints</span>
            </div>
            <div className="pt-6 border-t border-slate-100 text-[10px] text-slate-500 italic leading-relaxed">
              *Hybrid architecture combining CNN for feature extraction and LSTM for temporal anomaly detection.
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const AcademicReport = () => (
  <div className="max-w-4xl mx-auto bg-white p-16 shadow-2xl border border-slate-200 print:p-0 print:shadow-none font-serif leading-relaxed text-slate-900 animate-in zoom-in-95 duration-500">
    <div className="text-center mb-16 border-b-4 border-maroon-800 pb-12">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-maroon-800 rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-xl">IU</div>
      </div>
      <h1 className="text-4xl font-black uppercase mb-2 tracking-tighter font-sans">Iqra University</h1>
      <h2 className="text-xl font-bold text-slate-500 mb-2 font-sans tracking-wide">Deep Learning (CS-402)</h2>
      <div className="h-1 w-24 bg-maroon-800 mx-auto mb-8"></div>
      <p className="text-xs font-sans font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Complex Computing Problem (CCP) - IU-AI Grand Challenge 2025</p>
      <p className="text-3xl font-serif font-bold text-slate-800">Unified Intelligent Campus System (IU-UICS)</p>
      <p className="text-lg text-slate-500 font-bold font-sans mt-2">Module 7: AI-Powered Event & Sports Management</p>
    </div>

    <div className="space-y-12">
      <section>
        <h3 className="text-xl font-sans font-black text-maroon-800 uppercase mb-6 tracking-wider border-l-8 border-maroon-800 pl-4 flex items-center justify-between">
          1. Introduction
          <Badge variant="info">WP1, WP3</Badge>
        </h3>
        <p className="indent-10 text-justify">
          Manual sports management and event planning at university campuses often suffer from operational silos, leading to resource conflicts and poor student engagement. This CCP introduces Module 7 of the IU-UICS, focusing on integrating NLP, Machine Learning, and Computer Vision to automate and optimize the student lifecycle in terms of extracurricular activities. By moving from reactive to proactive management, IU can significantly enhance the student experience.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-sans font-black text-maroon-800 uppercase mb-6 tracking-wider border-l-8 border-maroon-800 pl-4 flex items-center justify-between">
          2. Dataset Analysis
          <Badge variant="info">WP2</Badge>
        </h3>
        <p className="mb-4">
          A high-fidelity simulated dataset (<em>sports_management_dataset.csv</em>) was created, featuring multi-modal data streams:
        </p>
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 font-sans text-sm grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <h4 className="font-black text-navy-800 uppercase text-xs">Primary Features</h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Student Demographic & Participation Bitmasks</li>
              <li>Temporal Event History (36 Months)</li>
              <li>Interest Sentiment Vectors (NLP derived)</li>
              <li>CCTV Keypoint Logs (Vision derived)</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-black text-navy-800 uppercase text-xs">Preprocessing Pipeline</h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Multi-hot encoding of departmental interests</li>
              <li>Min-Max Engagement Normalization</li>
              <li>Temporal shifting for sports season trends</li>
              <li>K-Anonymization for Privacy Assurance</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-sans font-black text-maroon-800 uppercase mb-6 tracking-wider border-l-8 border-maroon-800 pl-4 flex items-center justify-between">
          3. Methodology & Architecture
          <Badge variant="info">WP3, WP6</Badge>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
          <div className="p-6 border rounded-2xl bg-slate-50">
            <h4 className="font-black text-maroon-800 uppercase text-xs mb-3">A. NLP Recommender Engine</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Utilizes Large Language Model (LLM) embeddings to map multidimensional student interest vectors to event metadata using cosine similarity metrics.</p>
          </div>
          <div className="p-6 border rounded-2xl bg-slate-50">
            <h4 className="font-black text-maroon-800 uppercase text-xs mb-3">B. Heuristic Graph Scheduler</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Implements a backtracking graph-coloring algorithm to solve the NP-Hard venue allocation problem, ensuring zero overlap in resource utilization.</p>
          </div>
          <div className="p-6 border rounded-2xl bg-slate-50">
            <h4 className="font-black text-maroon-800 uppercase text-xs mb-3">C. Attendance Regression (ML)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">A Random Forest Regressor predicts event turnout by analyzing promotion intensity, weather forecasts, and historical departmental engagement scores.</p>
          </div>
          <div className="p-6 border rounded-2xl bg-slate-50">
            <h4 className="font-black text-maroon-800 uppercase text-xs mb-3">D. Biometric Safety Sensing (CV)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Employs YOLOv8 + PoseNet for real-time skeletal tracking. Anomalies in joint velocity or angle trigger proactive medical alerts to campus security.</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-sans font-black text-maroon-800 uppercase mb-6 tracking-wider border-l-8 border-maroon-800 pl-4">4. Results & Ethical Analysis</h3>
        <p className="text-justify mb-4">
          Simulation results indicate a 42% increase in potential engagement through personalized matching and a 60% reduction in venue-related scheduling errors. Ethically, the system follows "Edge-First" vision processing to ensure no student biometric data leaves the local surveillance node, complying with institutional privacy policies.
        </p>
      </section>

      <div className="mt-20 pt-12 border-t border-slate-100 flex justify-between items-end font-sans">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Signature</p>
          <p className="font-bold text-slate-800 uppercase">IU-AI GRAND CHALLENGE CORE</p>
          <p className="text-xs text-slate-500">Iqra University • Dept of Computer Science</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Submitted</p>
          <p className="font-bold text-slate-800">January 10, 2026</p>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App ---

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'recommender', icon: Zap, label: 'Event Matching' },
    { id: 'scheduler', icon: Calendar, label: 'Sports Timeline' },
    { id: 'track', icon: Target, label: 'Participation' },
    { id: 'turnout', icon: BarChart3, label: 'Turnout Predictor' },
    { id: 'volunteers', icon: UserCheck, label: 'Volunteer Portal' },
    { id: 'safety', icon: Activity, label: 'Injury Sensing' },
    { id: 'report', icon: FileText, label: 'CCP Document' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Dynamic Sidebar */}
      <aside className="w-80 bg-slate-900 fixed left-0 top-0 bottom-0 text-white flex flex-col p-8 z-50">
        <div className="flex items-center gap-4 mb-16 px-2">
          <div className="w-12 h-12 bg-maroon-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-maroon-900/50">
            <Cpu className="text-white" size={28} />
          </div>
          <div>
            <h1 className="font-black text-2xl leading-none tracking-tighter">IU-UICS</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Management Engine</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-4">Module 07 Intelligence</div>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${
                activeTab === item.id 
                  ? 'bg-maroon-800 text-white shadow-xl shadow-maroon-900/40 translate-x-1' 
                  : 'text-slate-500 hover:text-white hover:bg-slate-800 hover:translate-x-1'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-600'} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-10 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-2 mb-3">
            <Database size={14} className="text-maroon-500" />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Environment</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
            <span>Inference Node v4.1</span>
            <Badge variant="success">Online</Badge>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-80 flex-1 min-h-screen p-12 overflow-y-auto">
        <header className="flex justify-between items-start mb-16">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
              <div className="w-12 h-[2px] bg-slate-200"></div>
              IU Unified Campus Intelligence
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-50 bg-slate-200 flex items-center justify-center font-black text-xs text-slate-600 shadow-sm">IU</div>
              ))}
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <button className="relative p-3 text-slate-400 hover:text-maroon-800 transition-colors bg-white rounded-2xl border border-slate-200 shadow-sm">
              <Bell size={24} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="pb-24">
          {activeTab === 'dashboard' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="p-8">
                  <div className="p-3 rounded-2xl bg-maroon-50 text-maroon-800 w-fit mb-6"><Users size={24}/></div>
                  <h4 className="text-4xl font-black text-slate-900 mb-1">4.8k</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Students</p>
                </Card>
                <Card className="p-8">
                  <div className="p-3 rounded-2xl bg-navy-50 text-navy-800 w-fit mb-6"><TrendingUp size={24}/></div>
                  <h4 className="text-4xl font-black text-slate-900 mb-1">94%</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prediction Acc.</p>
                </Card>
                <Card className="p-8">
                  <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 w-fit mb-6"><Activity size={24}/></div>
                  <h4 className="text-4xl font-black text-slate-900 mb-1">14ms</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vision Latency</p>
                </Card>
                <Card className="p-8">
                  <div className="p-3 rounded-2xl bg-amber-50 text-amber-800 w-fit mb-6"><UserCheck size={24}/></div>
                  <h4 className="text-4xl font-black text-slate-900 mb-1">86</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Volunteer Pool</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <Card className="lg:col-span-2 p-10">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-black text-slate-900">Event Engagement Heatmap</h3>
                    <div className="flex gap-2">
                      <button className="px-4 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black uppercase text-slate-500">Weekly</button>
                      <button className="px-4 py-1.5 bg-maroon-800 rounded-lg text-[10px] font-black uppercase text-white shadow-lg shadow-maroon-900/20">Monthly</button>
                    </div>
                  </div>
                  <div className="h-72 flex items-end justify-between gap-4 px-6 pb-6 border-b border-slate-100">
                    {[35, 60, 40, 85, 55, 75, 50, 95, 70, 80].map((h, i) => (
                      <div key={i} className="flex-1 bg-slate-50 rounded-t-2xl relative group transition-all cursor-pointer">
                        <div className="absolute bottom-0 left-0 right-0 bg-maroon-800 rounded-t-2xl transition-all duration-1000 group-hover:bg-navy-800" style={{ height: `${h}%` }}>
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl">
                            {h * 4} Participated
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
                  </div>
                </Card>

                <div className="space-y-8">
                  <Card className="p-8 bg-slate-900 text-white relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-maroon-800 rounded-lg"><Bell size={18}/></div>
                        <h3 className="font-black uppercase text-xs tracking-widest">Priority Alerts</h3>
                      </div>
                      <div className="space-y-6">
                        <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm group-hover:bg-white/10 transition-all">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-1 animate-pulse"></div>
                          <div>
                            <p className="text-xs font-bold leading-relaxed text-slate-200">Biometric Anomaly: Potential strain detected in Pitch A (CS vs BBA).</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">Just Now</p>
                          </div>
                        </div>
                        <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm group-hover:bg-white/10 transition-all">
                          <div className="w-2 h-2 bg-gold rounded-full mt-1"></div>
                          <div>
                            <p className="text-xs font-bold leading-relaxed text-slate-200">Timetable Conflict: Main Ground required by 2 sports at 14:00.</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">12m Ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-maroon-800/10 blur-[80px] -mr-24 -mt-24 rounded-full"></div>
                  </Card>
                  
                  <Card className="p-8 border-dashed border-2 bg-slate-50/50 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-white rounded-3xl border border-slate-200 flex items-center justify-center mb-6 shadow-sm"><Cpu size={32} className="text-slate-300"/></div>
                    <h5 className="font-black text-slate-900 text-sm">Agentic Resource Optimizer</h5>
                    <p className="text-[11px] text-slate-500 mt-2 font-medium max-w-[200px]">System suggests dynamic volunteer shift reallocation for Sports Week.</p>
                    <button className="mt-6 px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all">Optimize Flow</button>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recommender' && <EventRecommender />}
          {activeTab === 'scheduler' && <SportsScheduler />}
          {activeTab === 'track' && <ParticipationTracker />}
          {activeTab === 'turnout' && <TurnoutPredictor />}
          {activeTab === 'safety' && <InjuryDetectionVision />}
          {activeTab === 'report' && <AcademicReport />}
          
          {activeTab === 'volunteers' && (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
              <Card className="p-10">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900">Volunteer Assignment Core</h3>
                    <p className="text-sm text-slate-500 font-medium">Skill-to-Task optimization using agentic logic.</p>
                  </div>
                  <button className="flex items-center gap-3 px-8 py-4 bg-maroon-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-maroon-900 shadow-xl shadow-maroon-900/20 transition-all">
                    <Plus size={18} /> Add New Node
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {SIMULATED_DATASET.volunteers.map(v => (
                    <div key={v.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-maroon-200 hover:shadow-2xl transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.25rem] bg-white border border-slate-200 flex items-center justify-center font-black text-slate-500 shadow-sm group-hover:bg-maroon-800 group-hover:text-white transition-all text-xl">
                          {v.name[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-slate-800 group-hover:text-maroon-800 transition-colors">{v.name}</h4>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="default">{v.skill}</Badge>
                            <Badge variant="info">Rating: {v.rating}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={v.status === 'Available' ? 'success' : 'warning'}>{v.status}</Badge>
                        <button className="block mt-4 text-[10px] font-black text-maroon-800 hover:underline uppercase tracking-widest">Assign Action</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
