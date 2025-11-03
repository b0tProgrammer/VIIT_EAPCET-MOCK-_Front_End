import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "What is the EAPCET exam?",
    a: "EAPCET is an entrance exam for admission into various professional courses. It assesses candidates' knowledge in subject areas relevant to the program.",
  },
  {
    q: "Who can appear for the VIIT EAPCET mock test?",
    a: "Any student preparing for the EAPCET or those who want to practice timed mock tests can register and take the VIIT mock tests.",
  },
  {
    q: "Why should I take VIIT EAPCET mock tests?",
    a: "Mock tests help you build speed, accuracy and time management. They also familiarise you with the exam pattern and reduce anxiety on test day.",
  },
  {
    q: "Is there a registration fee for the mock tests?",
    a: "Some mock tests may be free while others may have a nominal registration fee. Check the specific test details on the portal for pricing.",
  },
  {
    q: "What is the pattern of the EAPCET mock test?",
    a: "The mock test follows the EAPCET pattern: multiple-choice questions across relevant subjects with a fixed duration and negative marking as applicable.",
  },
  {
    q: "Are the questions based on the latest syllabus?",
    a: "Yes — our mock tests are created and updated to follow the latest syllabus and exam pattern so your practice stays relevant.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h1>

        <div className="bg-sky-50 rounded-md overflow-hidden">
          <ul className="divide-y divide-slate-300">
            {FAQS.map((f, i) => {
              const open = openIndex === i;
              return (
                <li key={i} className={`${open ? "bg-sky-100" : "bg-transparent"}`}>
                  <div className="flex items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="text-xl font-medium text-slate-800">{i + 1}.</div>
                      <button
                        onClick={() => toggle(i)}
                        aria-expanded={open}
                        className="text-left"
                      >
                        <span className="text-base md:text-lg text-slate-900">{f.q}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => toggle(i)}
                      aria-label={open ? "Collapse" : "Expand"}
                      className="p-2 rounded hover:bg-white/40"
                    >
                      {open ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>
                  </div>

                  {open && (
                    <div className="px-6 pb-6 text-slate-700">
                      <p>{f.a}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}