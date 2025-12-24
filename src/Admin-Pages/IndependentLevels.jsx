import { useEffect, useMemo, useState } from "react";
import NavBarMain from "../components/NavBarMain";
import Footer from "../components/Footer";
import AdminSideBar from "../components/AdminSiderBar";
import { Menu as MenuIcon } from "lucide-react";
import { useLocation } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000";

const subjects = [
  { name: "Mathematics", questions: 80 },
  { name: "Physics", questions: 40 },
  { name: "Chemistry", questions: 40 },
];

export default function IndependentLevels() {
  const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(false);
  const [paperTitle, setPaperTitle] = useState("Custom Difficulty Exam");
  const [startTime, setStartTime] = useState("");
  const [durationHours, setDurationHours] = useState(3);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [paperId, setPaperId] = useState(null);
  const [availability, setAvailability] = useState({ EASY: 0, MEDIUM: 0, HARD: 0 });
  const [availabilityBySubject, setAvailabilityBySubject] = useState({});
  const token = useMemo(() => localStorage.getItem("token"), []);
  const adminId = useMemo(() => localStorage.getItem("adminId") || 1, []);
  const location = useLocation();

  const [difficulties, setDifficulties] = useState(() => {
    const init = {};
    subjects.forEach((subj) => {
      init[subj.name] = Array(subj.questions).fill(1); 
    });
    return init;
  });

  useEffect(() => {
    // Prefill from Exams page if navigated with state
    if (location.state) {
      const { title, startTime: st, duration } = location.state;
      if (title) setPaperTitle(title);
      if (st) setStartTime(st);
      if (duration) setDurationHours(duration);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/difficulty-availability`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch availability");
        setAvailability(data.availability || { EASY: 0, MEDIUM: 0, HARD: 0 });
        setAvailabilityBySubject(data.bySubject || {});
      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchAvailability();
  }, [token]);

  const diff = [1, 2, 3]; // 1: Easy, 2: Medium, 3: Hard
  const diffKeyMap = { 1: "EASY", 2: "MEDIUM", 3: "HARD" };

  const handleClick = (subject, index) => {
    setErrorMsg("");
    setDifficulties((prev) => {
      const next = { ...prev, [subject]: [...prev[subject]] };
      const currentLevel = next[subject][index];
      const nextLevel = diff[(currentLevel) % diff.length]; // Cycle: 1→2→3→1

      const currentKey = diffKeyMap[currentLevel];
      const nextKey = diffKeyMap[nextLevel];

      // Compute prospective subject demand after this change
      const subjCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };
      next[subject].forEach((lvl, i) => {
        const key = diffKeyMap[i === index ? nextLevel : lvl];
        subjCounts[key] = (subjCounts[key] || 0) + 1;
      });

      // Match subject name to backend format (e.g., "Mathematics" → "MATHEMATICS")
      const backendSubject = subject.toUpperCase();
      const subjAvail = availabilityBySubject[backendSubject] || {};
      
      if ((subjCounts[nextKey] || 0) > (subjAvail[nextKey] || 0)) {
        const msg = `${subject}: not enough ${nextKey} questions. Need ${subjCounts[nextKey]}, have ${subjAvail[nextKey] || 0}.`;
        setErrorMsg(msg);
        console.warn(msg);
        // Clear error after 3 seconds
        setTimeout(() => setErrorMsg(""), 3000);
        return prev;
      }

      // Apply change
      next[subject][index] = nextLevel;
      return next;
    });
  };


  const buildSlotsPayload = () => {
    const slotMap = { 1: "EASY", 2: "MEDIUM", 3: "HARD" };
    const slots = [];
    subjects.forEach((subject) => {
      difficulties[subject.name].forEach((level) => {
        slots.push({ difficulty: slotMap[level] });
      });
    });
    return slots;
  };

  const getDemandCounts = (slots) => {
    return slots.reduce(
      (acc, s) => {
        acc[s.difficulty] = (acc[s.difficulty] || 0) + 1;
        return acc;
      },
      { EASY: 0, MEDIUM: 0, HARD: 0 }
    );
  };

  const demand = useMemo(() => getDemandCounts(buildSlotsPayload()), [difficulties]);
  const demandBySubject = useMemo(() => {
    const slotMap = { 1: "EASY", 2: "MEDIUM", 3: "HARD" };
    const acc = {};
    subjects.forEach((subject) => {
      acc[subject.name] = { EASY: 0, MEDIUM: 0, HARD: 0 };
      difficulties[subject.name].forEach((level) => {
        const diffKey = slotMap[level];
        acc[subject.name][diffKey] = (acc[subject.name][diffKey] || 0) + 1;
      });
    });
    return acc;
  }, [difficulties]);

  const remaining = {
    EASY: Math.max(0, (availability.EASY || 0) - (demand.EASY || 0)),
    MEDIUM: Math.max(0, (availability.MEDIUM || 0) - (demand.MEDIUM || 0)),
    HARD: Math.max(0, (availability.HARD || 0) - (demand.HARD || 0)),
  };

  const remainingBySubject = useMemo(() => {
    const result = {};
    subjects.forEach((subject) => {
      const avail = availabilityBySubject[subject.name.toUpperCase()] || {};
      const dem = demandBySubject[subject.name] || {};
      result[subject.name] = {
        EASY: Math.max(0, (avail.EASY || 0) - (dem.EASY || 0)),
        MEDIUM: Math.max(0, (avail.MEDIUM || 0) - (dem.MEDIUM || 0)),
        HARD: Math.max(0, (avail.HARD || 0) - (dem.HARD || 0)),
      };
    });
    return result;
  }, [availabilityBySubject, demandBySubject, subjects]);

  // Real-time shortage detection
  const shortageWarnings = useMemo(() => {
    // Don't show warnings if availability data hasn't loaded yet
    if (!availability.EASY && !availability.MEDIUM && !availability.HARD) {
      return [];
    }

    const warnings = [];
    
    // Global shortages
    ["EASY", "MEDIUM", "HARD"].forEach((diff) => {
      if ((demand[diff] || 0) > (availability[diff] || 0)) {
        warnings.push(
          `Global ${diff}: need ${demand[diff]}, have ${availability[diff] || 0}`
        );
      }
    });

    // Subject-specific shortages
    subjects.forEach((subject) => {
      const subjAvail = availabilityBySubject[subject.name.toUpperCase()] || {};
      const subjDemand = demandBySubject[subject.name] || {};
      ["EASY", "MEDIUM", "HARD"].forEach((diff) => {
        if ((subjDemand[diff] || 0) > (subjAvail[diff] || 0)) {
          warnings.push(
            `${subject.name} ${diff}: need ${subjDemand[diff]}, have ${subjAvail[diff] || 0}`
          );
        }
      });
    });

    return warnings;
  }, [demand, availability, demandBySubject, availabilityBySubject, subjects]);

  const handleGeneratePaper = async () => {
    setErrorMsg("");
    const slots = buildSlotsPayload();
    if (!slots.length) {
      setErrorMsg("No questions configured.");
      return;
    }

    // Validate availability before sending to backend
    const shortages = Object.keys(demand).filter(
      (k) => demand[k] > (availability[k] || 0)
    );
    // Also validate per-subject shortages
    const subjectShortages = [];
    subjects.forEach((subject) => {
      const subjAvail = availabilityBySubject[subject.name.toUpperCase()] || {};
      const subjDemand = demandBySubject[subject.name] || {};
      ["EASY", "MEDIUM", "HARD"].forEach((k) => {
        if ((subjDemand[k] || 0) > (subjAvail[k] || 0)) {
          subjectShortages.push(
            `${subject.name} ${k} need ${subjDemand[k]}, have ${subjAvail[k] || 0}`
          );
        }
      });
    });
    if (shortages.length || subjectShortages.length) {
      const parts = [];
      if (shortages.length) {
        parts.push(
          `Global shortage: ${shortages
            .map((k) => `${k} need ${demand[k]}, have ${availability[k] || 0}`)
            .join("; ")}`
        );
      }
      if (subjectShortages.length) {
        parts.push(`Subject shortage: ${subjectShortages.join("; ")}`);
      }
      setErrorMsg(parts.join(" | "));
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/generate-custom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: paperTitle || "Custom Difficulty Exam",
          slots,
          durationHours: parseFloat(durationHours) || 3,
          startTime: startTime || new Date().toISOString(),
          adminId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to generate paper");
      }

      setPaperId(data.paperId);
      alert(`Paper created. ID: ${data.paperId}, Questions: ${data.totalQuestions}`);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to generate paper");
      alert(err.message || "Failed to generate paper");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreviewPaper = async () => {
    if (!paperId) {
      alert("Generate a paper first");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/preview-paper/${paperId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to preview paper");
      alert(`Preview ready. Questions: ${data.questions.length}`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to preview paper");
    }
  };

  const handleSaveDraft = async () => {
    await handleGeneratePaper();
  };

  const getTextColor = (level) => {
    switch (level) {
      case 1:
        return "text-green-600"; // Easy
      case 2:
        return "text-yellow-600"; // Medium
      case 3:
        return "text-red-600"; // Hard
      default:
        return "text-gray-600";
    }
  };

  return (
    <>
      <NavBarMain />
      <div className="flex flex-1 bg-[#f9fcff] font-poppins text-gray-800 relative">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static top-0 left-0 h-full w-64 bg-white border-r border-gray-200
            transform transition-transform duration-300 ease-in-out z-50
            ${
              isAdminSideBarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }`}
        >
          <AdminSideBar
            isAdminSideBarOpen={isAdminSideBarOpen}
            setIsAdminSideBarOpen={setIsAdminSideBarOpen}
          />
        </aside>

        {/* Overlay for mobile */}
        {isAdminSideBarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsAdminSideBarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col py-10 px-4 sm:px-6 lg:px-10 overflow-y-auto">
          {/* Mobile Sidebar Toggle */}
          <button
            className="lg:hidden mb-4 text-[#003973] flex items-center gap-2 font-medium self-start"
            onClick={() => setIsAdminSideBarOpen(!isAdminSideBarOpen)}
          >
            <MenuIcon size={24} />
            <span>Menu</span>
          </button>

          {/* Centered content container */}
          <div className="w-full max-w-[1200px] mx-auto space-y-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[#003973]">
              Choose Independent Level for Each Question!
            </h2>

            {subjects.map((subject) => (
              <div key={subject.name}>
                <h3 className="font-bold text-lg mb-3 text-[#003973]">
                  {subject.name}
                </h3>

                <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-2 justify-items-center">
                  {difficulties[subject.name].map((level, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleClick(subject.name, idx)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center 
                        border border-[#0080FF] rounded-[30px] 
                        bg-[#F0FEFF] shadow-[0_5px_10px_rgba(0,0,0,0.3)]
                        hover:scale-105 active:scale-95 transition-transform duration-200 
                        font-medium text-sm ${getTextColor(level)}`}
                      title={`Q${idx + 1}: ${
                        level === 1 ? "EASY" : level === 2 ? "MEDIUM" : "HARD"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Note */}
            <div className="text-sm text-gray-600 mt-6 text-center">
              *Tap each box to change its difficulty level (1 → Easy, 2 → Medium, 3 → Hard)
            </div>

            {/* Title input */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <label className="text-sm font-semibold text-[#003973]">Paper Title</label>
              <input
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
                className="w-full sm:w-80 px-3 py-2 border border-[#0080FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080FF]"
                placeholder="Enter a title"
              />
            </div>

            {/* Schedule info (read-only if provided) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <label className="text-sm font-semibold text-[#003973]">Start Time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full sm:w-80 px-3 py-2 border border-[#0080FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080FF]"
              />
              <label className="text-sm font-semibold text-[#003973]">Duration (hrs)</label>
              <input
                type="number"
                min="1"
                max="6"
                step="0.5"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                className="w-28 px-3 py-2 border border-[#0080FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080FF]"
              />
            </div>

            {/* Availability indicator */}
            <div className="text-center text-sm text-gray-700 mt-3 space-y-1">
              <div>
                Available — Easy: {availability.EASY} | Medium: {availability.MEDIUM} | Hard: {availability.HARD}
              </div>
              <div>
                Remaining after selection — Easy: {remaining.EASY} | Medium: {remaining.MEDIUM} | Hard: {remaining.HARD}
              </div>
              <div className="mt-2">
                <div className="font-semibold text-[#003973]">Per Subject</div>
                {subjects.map((subject) => {
                  const subjAvail = availabilityBySubject[subject.name.toUpperCase()] || {};
                  const subjRemain = remainingBySubject[subject.name] || {};
                  const subjDemand = demandBySubject[subject.name] || {};
                  
                  const hasShortage = 
                    (subjDemand.EASY > subjAvail.EASY) ||
                    (subjDemand.MEDIUM > subjAvail.MEDIUM) ||
                    (subjDemand.HARD > subjAvail.HARD);

                  return (
                    <div 
                      key={subject.name} 
                      className={`text-xs ${hasShortage ? 'text-red-600 font-semibold' : 'text-gray-700'}`}
                    >
                      {subject.name}: Avl E/M/H {subjAvail.EASY || 0}/{subjAvail.MEDIUM || 0}/{subjAvail.HARD || 0}
                      {"  "} | Rem E/M/H{" "}
                      <span className={subjDemand.EASY > subjAvail.EASY ? 'text-red-600 font-bold' : ''}>
                        {subjRemain.EASY || 0}
                      </span>/
                      <span className={subjDemand.MEDIUM > subjAvail.MEDIUM ? 'text-red-600 font-bold' : ''}>
                        {subjRemain.MEDIUM || 0}
                      </span>/
                      <span className={subjDemand.HARD > subjAvail.HARD ? 'text-red-600 font-bold' : ''}>
                        {subjRemain.HARD || 0}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Real-time shortage warnings */}
            {shortageWarnings.length > 0 && (
              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mt-4">
                <div className="font-bold text-red-800 text-center mb-2">
                  ⚠️ Insufficient Questions - Cannot Generate Paper
                </div>
                <div className="text-sm text-red-700 space-y-1">
                  {shortageWarnings.map((warning, idx) => (
                    <div key={idx}>• {warning}</div>
                  ))}
                </div>
                <div className="text-xs text-red-600 mt-2 text-center">
                  Reduce the difficulty levels that are over-allocated before generating.
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="text-center text-red-600 text-sm mt-2 font-semibold">{errorMsg}</div>
            )}

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button
                disabled={isSaving || shortageWarnings.length > 0}
                onClick={handlePreviewPaper}
                className="px-5 py-2 bg-[#F0FEFF] text-black border border-[#0080FF] rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                title={shortageWarnings.length > 0 ? "Fix shortages first" : ""}
              >
                Preview Paper
              </button>
              <button
                disabled={isSaving || shortageWarnings.length > 0}
                onClick={handleSaveDraft}
                className="px-5 py-2 bg-[#F0FEFF] text-black border border-[#0080FF] rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                title={shortageWarnings.length > 0 ? "Fix shortages first" : ""}
              >
                Save Draft
              </button>
              <button
                disabled={isSaving || shortageWarnings.length > 0}
                onClick={handleGeneratePaper}
                className={`px-5 py-2 bg-[#F0FEFF] text-black border border-[#0080FF] rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed`}
                title={shortageWarnings.length > 0 ? "Fix shortages first" : ""}
              >
                {isSaving ? "Generating..." : "Generate Question Paper"}
              </button>
            </div>
            {shortageWarnings.length === 0 && !isSaving && (
              <div className="text-center text-green-600 text-sm mt-2 font-semibold">
                ✅ All questions allocated correctly - Ready to generate!
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}