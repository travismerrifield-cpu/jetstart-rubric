import { useState, useEffect, useRef, useCallback } from "react";
import { MODULES, RATING_SCALE, DEFAULT_STUDENTS } from "./data/modules";

const ratingColor = (r) =>
  ({
    "4": "bg-green-100 text-green-800",
    "3": "bg-blue-100 text-blue-800",
    "2": "bg-yellow-100 text-yellow-800",
    "1": "bg-red-100 text-red-800",
    "N/O": "bg-gray-100 text-gray-500",
    "✓": "bg-green-100 text-green-800",
    "△": "bg-yellow-100 text-yellow-800",
    "✗": "bg-red-100 text-red-800",
  }[r] || "bg-white text-gray-300");

const avgColor = (avg) =>
  avg === null ? "" :
  avg >= 3.5 ? "text-green-700 font-bold" :
  avg >= 2.5 ? "text-blue-700 font-semibold" :
  avg >= 1.5 ? "text-yellow-700 font-semibold" :
  "text-red-700 font-bold";

const cardColor = (avg) =>
  avg === null ? "bg-gray-50 border-gray-200" :
  avg >= 3.5 ? "bg-green-50 border-green-300" :
  avg >= 2.5 ? "bg-blue-50 border-blue-300" :
  avg >= 1.5 ? "bg-yellow-50 border-yellow-300" :
  "bg-red-50 border-red-300";

export default function RubricApp({ session, onBack }) {
  const [students, setStudents]     = useState(session.students || DEFAULT_STUDENTS);
  const [grades, setGrades]         = useState(session.grades   || {});
  const [notes, setNotes]           = useState(session.notes    || {});
  const [cohortInfo, setCohortInfo] = useState({
    trainer: session.trainer      || "",
    cohort:  session.cohort_name  || "",
    dates:   session.dates        || "",
  });

  const [activeModule, setActiveModule]   = useState(0);
  const [editingStudent, setEditingStudent] = useState(null);
  const [tempName, setTempName]           = useState("");
  const [activeTab, setActiveTab]         = useState("grading");
  const [notesPanel, setNotesPanel]       = useState(null);
  const [editingInfo, setEditingInfo]     = useState(false);
  const [saveStatus, setSaveStatus]       = useState("saved"); // "saved" | "saving" | "error"

  const isFirstRender = useRef(true);
  const saveTimer = useRef(null);

  const autoSave = useCallback(
    (data) => {
      setSaveStatus("saving");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        try {
          await fetch(`/api/sessions/${session.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          setSaveStatus("saved");
        } catch {
          setSaveStatus("error");
        }
      }, 1200);
    },
    [session.id]
  );

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    autoSave({
      trainer:     cohortInfo.trainer,
      cohort_name: cohortInfo.cohort,
      dates:       cohortInfo.dates,
      students,
      grades,
      notes,
    });
  }, [students, grades, notes, cohortInfo, autoSave]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const getKey   = (mod, sec, skill) => `${mod}||${sec || ""}||${skill}`;

  const setGrade = (modIdx, secLabel, skill, si, val) => {
    const k = getKey(modIdx, secLabel, skill);
    setGrades(g => ({ ...g, [k]: { ...(g[k] || {}), [si]: val === (g[k]?.[si]) ? "" : val } }));
  };
  const getGrade = (modIdx, secLabel, skill, si) =>
    grades[getKey(modIdx, secLabel, skill)]?.[si] || "";

  const setNote     = (si, key, val) => setNotes(n => ({ ...n, [si]: { ...(n[si] || {}), [key]: val } }));
  const getNote     = (si, key) => notes[si]?.[key] || "";
  const overallNote = (si) => notes[si]?.["__overall__"] || "";
  const setOverallNote = (si, val) => setNote(si, "__overall__", val);
  const hasNote     = (si, key) => !!(notes[si]?.[key]);

  // ── Averages ─────────────────────────────────────────────────────────────────
  const allSkillKeys = [];
  MODULES.forEach((mod, mi) => {
    if (mod.sections) mod.sections.forEach(sec => sec.skills.forEach(sk => allSkillKeys.push({ modIdx: mi, secLabel: sec.subtitle, skill: sk })));
    else (mod.skills || []).forEach(sk => allSkillKeys.push({ modIdx: mi, secLabel: null, skill: sk }));
  });

  const studentAvg = (si) => {
    const vals = allSkillKeys
      .map(({ modIdx, secLabel, skill }) => {
        const g = grades[getKey(modIdx, secLabel, skill)]?.[si] || "";
        return ["4","3","2","1"].includes(g) ? parseInt(g) : null;
      })
      .filter(v => v !== null);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : null;
  };

  const modAvg = (mi, si) => {
    const m = MODULES[mi];
    const keys = [];
    if (m.sections) m.sections.forEach(sec => sec.skills.forEach(sk => keys.push({ secLabel: sec.subtitle, skill: sk })));
    else (m.skills || []).forEach(sk => keys.push({ secLabel: null, skill: sk }));
    const vals = keys
      .map(({ secLabel, skill }) => {
        const g = grades[getKey(mi, secLabel, skill)]?.[si] || "";
        return ["4","3","2","1"].includes(g) ? parseInt(g) : null;
      })
      .filter(v => v !== null);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
  };

  // ── PDF Export ────────────────────────────────────────────────────────────────
  const exportPDF = () => {
    const w = window.open("", "_blank");
    const ratingLabel = { "4":"4 – Exceeds","3":"3 – Meets","2":"2 – Approaching","1":"1 – Below","N/O":"N/O","✓":"✓","△":"△","✗":"✗","":"-" };
    let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>JetStart Training Rubric</title>
    <style>
      body{font-family:Arial,sans-serif;font-size:8pt;margin:20px;color:#111}
      h1{font-size:14pt;margin-bottom:2px} h2{font-size:10pt;margin:10px 0 4px;background:#1f2937;color:#fff;padding:4px 6px;page-break-inside:avoid}
      h3{font-size:8pt;margin:6px 0 2px;color:#1e40af;background:#eff6ff;padding:2px 6px}
      table{border-collapse:collapse;width:100%;margin-bottom:8px;font-size:7pt}
      th{background:#1f2937;color:#fff;padding:3px 4px;text-align:center;border:1px solid #4b5563}
      th.skill-col{text-align:left}
      td{border:1px solid #d1d5db;padding:2px 4px;vertical-align:top}
      td.skill{width:200px;max-width:200px;word-wrap:break-word}
      td.grade{text-align:center;white-space:nowrap}
      td.note-cell{font-size:6.5pt;color:#374151;font-style:italic;max-width:90px;word-wrap:break-word}
      .page-break{page-break-before:always}
      .summary-card{display:inline-block;border:1px solid #ccc;border-radius:4px;padding:6px 10px;margin:4px;min-width:100px;vertical-align:top}
      .avg{font-size:16pt;font-weight:bold}
      .overall-note{background:#fffbeb;border:1px solid #fde68a;padding:4px 6px;font-size:7pt;margin-top:2px;border-radius:3px}
      .legend{font-size:7pt;margin-bottom:8px;display:flex;gap:12px;flex-wrap:wrap}
      .legend span{padding:2px 5px;border-radius:3px}
      @media print{body{margin:10px}.page-break{page-break-before:always}}
    </style></head><body>`;

    html += `<h1>JetStart Installation Training — Skills Rubric</h1>`;
    html += `<p style="font-size:8pt;margin:0 0 8px"><strong>Trainer:</strong> ${cohortInfo.trainer||"_______________"} &nbsp;&nbsp; <strong>Cohort:</strong> ${cohortInfo.cohort||"_______________"} &nbsp;&nbsp; <strong>Dates:</strong> ${cohortInfo.dates||"_______________"}</p>`;
    html += `<div class="legend"><strong>Scale:</strong> <span style="background:#dcfce7">4 – Exceeds</span><span style="background:#dbeafe">3 – Meets</span><span style="background:#fef9c3">2 – Approaching</span><span style="background:#fee2e2">1 – Below</span><span style="background:#f3f4f6">N/O</span> &nbsp; Safety: ✓ Consistent · △ Inconsistent · ✗ Not Demonstrated</div>`;

    students.forEach((name, si) => {
      html += `<div class="${si > 0 ? "page-break" : ""}"><h2 style="font-size:12pt">${name}</h2>`;
      const avg = studentAvg(si);
      html += `<p style="font-size:8pt;margin:0 0 6px"><strong>Overall Average:</strong> ${avg ?? "N/A"}</p>`;
      const on = overallNote(si);
      if (on) html += `<div class="overall-note"><strong>Overall Notes:</strong> ${on}</div>`;

      MODULES.forEach((mod, mi) => {
        html += `<h2>${mod.title}</h2>`;
        const renderSection = (skills, secLabel) => {
          html += `<table><thead><tr><th class="skill-col">Skill</th><th style="width:70px">Rating</th><th>Field Notes</th></tr></thead><tbody>`;
          skills.forEach((skill, ski) => {
            const g = getGrade(mi, secLabel, skill, si);
            const n = getNote(si, getKey(mi, secLabel, skill));
            const bg = {"4":"#dcfce7","3":"#dbeafe","2":"#fef9c3","1":"#fee2e2","N/O":"#f3f4f6","✓":"#dcfce7","△":"#fef9c3","✗":"#fee2e2"}[g]||"#fff";
            html += `<tr style="${ski%2?"background:#f9fafb":""}"><td class="skill">${skill}</td><td class="grade" style="background:${bg}">${ratingLabel[g]||"-"}</td><td class="note-cell">${n||""}</td></tr>`;
          });
          html += `</tbody></table>`;
        };
        if (mod.sections) mod.sections.forEach(sec => { html += `<h3>${sec.subtitle}</h3>`; renderSection(sec.skills, sec.subtitle); });
        else renderSection(mod.skills || [], null);
      });
      html += `</div>`;
    });

    html += `<div class="page-break"><h2 style="font-size:12pt">Cohort Summary</h2><div style="margin-bottom:12px">`;
    students.forEach((name, si) => {
      const avg = studentAvg(si);
      const col = avg===null?"#f3f4f6":avg>=3.5?"#dcfce7":avg>=2.5?"#dbeafe":avg>=1.5?"#fef9c3":"#fee2e2";
      html += `<div class="summary-card" style="background:${col}"><div style="font-weight:bold">${name}</div><div class="avg">${avg??"-"}</div><div style="font-size:6.5pt;color:#666">overall avg</div></div>`;
    });
    html += `</div><table><thead><tr><th class="skill-col" style="width:180px">Module</th>${students.map(n=>`<th style="width:55px">${n}</th>`).join("")}</tr></thead><tbody>`;
    MODULES.forEach((m, mi) => {
      html += `<tr><td style="font-weight:600;font-size:7pt">${m.title.replace(/MODULE \d+: /,"").replace(/ — All Modules/,"")}</td>`;
      students.forEach((_, si) => {
        const a = modAvg(mi, si);
        const col = a===null?"":a>=3.5?"#dcfce7":a>=2.5?"#dbeafe":a>=1.5?"#fef9c3":"#fee2e2";
        html += `<td style="text-align:center;background:${col}">${a??"-"}</td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody></table></div></body></html>`;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 500);
  };

  // ── Skill rows ────────────────────────────────────────────────────────────────
  const mod = MODULES[activeModule];

  const renderSkillRows = (modIdx, skills, secLabel) =>
    skills.map((skill, si) => {
      const noteKey = getKey(modIdx, secLabel, skill);
      return (
        <tr key={si} className={si % 2 === 0 ? "bg-white" : "bg-gray-50"}>
          <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200 w-56 min-w-[180px]">{skill}</td>
          {students.map((_, idx) => {
            const g = getGrade(modIdx, secLabel, skill, idx);
            const opts = MODULES[modIdx].isSafety ? ["✓","△","✗"] : RATING_SCALE;
            return (
              <td key={idx} className="px-1 py-1 text-center border-r border-gray-100 align-top">
                <select
                  value={g}
                  onChange={e => setGrade(modIdx, secLabel, skill, idx, e.target.value)}
                  className={`text-xs rounded px-1 py-0.5 border border-gray-200 cursor-pointer w-full ${ratingColor(g)}`}
                >
                  <option value="">—</option>
                  {opts.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <button
                  onClick={() => setNotesPanel({ studentIdx: idx, modIdx, secLabel, skill, noteKey })}
                  className={`mt-0.5 text-xs px-1 rounded w-full truncate ${hasNote(idx, noteKey) ? "bg-amber-100 text-amber-700 border border-amber-300" : "bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100"}`}
                  title={hasNote(idx, noteKey) ? getNote(idx, noteKey) : "Add note"}
                >
                  {hasNote(idx, noteKey) ? "📝" : "+note"}
                </button>
              </td>
            );
          })}
        </tr>
      );
    });

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded border border-gray-700 hover:border-gray-500 transition"
          >
            ← Sessions
          </button>
          <div>
            <div className="text-base font-bold">JetStart Training Rubric</div>
            <div className="text-xs text-gray-400">12-Student Cohort · Trainer Tool</div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <span className={`text-xs px-2 py-0.5 rounded ${saveStatus === "saved" ? "text-green-400" : saveStatus === "saving" ? "text-yellow-400" : "text-red-400"}`}>
            {saveStatus === "saved" ? "✓ Saved" : saveStatus === "saving" ? "Saving…" : "⚠ Save error"}
          </span>
          <button onClick={() => setActiveTab("grading")} className={`px-3 py-1 rounded text-xs font-medium transition ${activeTab==="grading"?"bg-blue-600 text-white":"bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>Grading</button>
          <button onClick={() => setActiveTab("summary")} className={`px-3 py-1 rounded text-xs font-medium transition ${activeTab==="summary"?"bg-blue-600 text-white":"bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>Summary</button>
          <button onClick={() => setActiveTab("studentnotes")} className={`px-3 py-1 rounded text-xs font-medium transition ${activeTab==="studentnotes"?"bg-blue-600 text-white":"bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>Student Notes</button>
          <button onClick={exportPDF} className="px-3 py-1 rounded text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1">⬇ Export PDF</button>
        </div>
      </div>

      {/* Cohort info bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-1.5 flex items-center gap-4 text-xs flex-shrink-0">
        {editingInfo ? (
          <>
            {[["trainer","Trainer"],["cohort","Cohort"],["dates","Dates"]].map(([f, label]) => (
              <label key={f} className="flex items-center gap-1 text-gray-600">
                <span className="font-medium">{label}:</span>
                <input
                  value={cohortInfo[f]}
                  onChange={e => setCohortInfo(c => ({ ...c, [f]: e.target.value }))}
                  className="border border-gray-300 rounded px-1 py-0.5 text-xs w-28"
                />
              </label>
            ))}
            <button onClick={() => setEditingInfo(false)} className="px-2 py-0.5 rounded bg-blue-600 text-white text-xs">Save</button>
          </>
        ) : (
          <>
            <span className="text-gray-600"><strong>Trainer:</strong> {cohortInfo.trainer || <span className="text-gray-400 italic">not set</span>}</span>
            <span className="text-gray-600"><strong>Cohort:</strong> {cohortInfo.cohort || <span className="text-gray-400 italic">not set</span>}</span>
            <span className="text-gray-600"><strong>Dates:</strong> {cohortInfo.dates || <span className="text-gray-400 italic">not set</span>}</span>
            <button onClick={() => setEditingInfo(true)} className="ml-1 px-2 py-0.5 rounded border border-gray-300 text-gray-500 hover:bg-gray-50 text-xs">Edit</button>
            <span className="ml-4 text-gray-400">Scale: <span className="bg-green-100 text-green-700 px-1 rounded">4=Exceeds</span> <span className="bg-blue-100 text-blue-700 px-1 rounded">3=Meets</span> <span className="bg-yellow-100 text-yellow-700 px-1 rounded">2=Approaching</span> <span className="bg-red-100 text-red-700 px-1 rounded">1=Below</span></span>
          </>
        )}
      </div>

      {/* ── GRADING TAB ── */}
      {activeTab === "grading" && (
        <div className="flex flex-1 overflow-hidden">
          {/* Module sidebar */}
          <div className="w-52 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
            {MODULES.map((m, i) => (
              <button
                key={i}
                onClick={() => setActiveModule(i)}
                className={`w-full text-left px-3 py-2 text-xs border-b border-gray-100 transition ${activeModule===i ? "bg-blue-600 text-white font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
              >
                {m.title}
              </button>
            ))}
          </div>

          {/* Grading table */}
          <div className="flex-1 overflow-auto relative">
            <div className="p-4">
              <div className="text-sm font-bold text-gray-800 mb-3">{mod.title}</div>
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="text-xs min-w-max w-full">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="px-3 py-2 text-left font-semibold border-r border-gray-600 w-56">Skill</th>
                      {students.map((name, i) => (
                        <th key={i} className="px-1 py-2 text-center font-medium border-r border-gray-600 min-w-[80px]">
                          {editingStudent === i ? (
                            <input
                              autoFocus
                              value={tempName}
                              onChange={e => setTempName(e.target.value)}
                              onBlur={() => { const n = [...students]; n[i] = tempName || students[i]; setStudents(n); setEditingStudent(null); }}
                              onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") { const n = [...students]; n[i] = tempName || students[i]; setStudents(n); setEditingStudent(null); } }}
                              className="bg-gray-700 text-white text-xs rounded px-1 w-16 text-center outline-none"
                            />
                          ) : (
                            <span className="cursor-pointer hover:underline" title="Click to rename" onClick={() => { setEditingStudent(i); setTempName(students[i]); }}>{name}</span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mod.sections
                      ? mod.sections.map((sec, si) => (
                        <>{/* section header */}
                          <tr key={`sec-${si}`} className="bg-blue-50">
                            <td colSpan={students.length + 1} className="px-3 py-1.5 text-xs font-semibold text-blue-800 border-b border-blue-200">{sec.subtitle}</td>
                          </tr>
                          {renderSkillRows(activeModule, sec.skills, sec.subtitle)}
                        </>
                      ))
                      : renderSkillRows(activeModule, mod.skills || [], null)
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Notes slide-in panel */}
          {notesPanel && (
            <div className="w-72 bg-white border-l border-gray-200 shadow-xl flex flex-col flex-shrink-0">
              <div className="bg-gray-800 text-white px-4 py-3 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold">{students[notesPanel.studentIdx]}</div>
                  <div className="text-xs text-gray-400 mt-0.5 leading-tight">{notesPanel.skill}</div>
                </div>
                <button onClick={() => setNotesPanel(null)} className="text-gray-400 hover:text-white text-lg leading-none ml-2">×</button>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Field Notes for this Skill</label>
                  <textarea
                    autoFocus
                    value={getNote(notesPanel.studentIdx, notesPanel.noteKey)}
                    onChange={e => setNote(notesPanel.studentIdx, notesPanel.noteKey, e.target.value)}
                    placeholder="Enter observations, specific errors, coaching notes..."
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Overall Notes for {students[notesPanel.studentIdx]}</label>
                  <textarea
                    value={overallNote(notesPanel.studentIdx)}
                    onChange={e => setOverallNote(notesPanel.studentIdx, e.target.value)}
                    placeholder="General strengths, areas for improvement, follow-up actions..."
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                    rows={4}
                  />
                </div>
                <button onClick={() => setNotesPanel(null)} className="mt-auto w-full py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">Done</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SUMMARY TAB ── */}
      {activeTab === "summary" && (
        <div className="p-6 overflow-auto">
          <div className="text-sm font-bold text-gray-800 mb-4">Cohort Summary — Overall Averages</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
            {students.map((name, si) => {
              const avg = studentAvg(si);
              return (
                <div key={si} className={`rounded-lg border p-3 ${cardColor(avg)}`}>
                  <div className="font-semibold text-sm text-gray-800">{name}</div>
                  <div className={`text-2xl font-bold mt-1 ${avgColor(avg)}`}>{avg ?? "—"}</div>
                  <div className="text-xs text-gray-500">overall avg</div>
                  {overallNote(si) && <div className="text-xs text-gray-600 mt-1 italic border-t border-gray-200 pt-1 line-clamp-2">{overallNote(si)}</div>}
                </div>
              );
            })}
          </div>
          <div className="text-sm font-bold text-gray-800 mb-3">Module Averages by Student</div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="text-xs w-full min-w-max">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="px-3 py-2 text-left border-r border-gray-600 w-48">Module</th>
                  {students.map((n, i) => <th key={i} className="px-2 py-2 text-center border-r border-gray-600 min-w-[60px]">{n}</th>)}
                </tr>
              </thead>
              <tbody>
                {MODULES.map((m, mi) => (
                  <tr key={mi} className={mi % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-3 py-2 font-medium text-gray-700 border-r border-gray-200 text-xs">{m.title.replace(/MODULE \d+: /, "").replace(/ — All Modules/, "")}</td>
                    {students.map((_, si) => { const a = modAvg(mi, si); return <td key={si} className={`px-2 py-2 text-center border-r border-gray-100 ${avgColor(a)}`}>{a ?? "-"}</td>; })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── STUDENT NOTES TAB ── */}
      {activeTab === "studentnotes" && (
        <div className="p-6 overflow-auto">
          <div className="text-sm font-bold text-gray-800 mb-4">Student Notes Overview</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students.map((name, si) => {
              const allNotes = Object.entries(notes[si] || {}).filter(([k, v]) => k !== "__overall__" && v);
              return (
                <div key={si} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
                    <span className="font-semibold text-sm">{name}</span>
                    <span className="text-xs text-gray-400">{allNotes.length} skill note{allNotes.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="p-3 space-y-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Overall Notes</label>
                      <textarea
                        value={overallNote(si)}
                        onChange={e => setOverallNote(si, e.target.value)}
                        placeholder="General strengths, areas for improvement, follow-up actions..."
                        className="w-full border border-gray-200 rounded px-2 py-1 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 bg-amber-50"
                        rows={3}
                      />
                    </div>
                    {allNotes.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-1">Skill Notes</div>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {allNotes.map(([k, v]) => {
                            const parts = k.split("||");
                            const skillName = parts[2] || k;
                            return (
                              <div key={k} className="text-xs bg-gray-50 rounded px-2 py-1 border border-gray-100">
                                <div className="font-medium text-gray-700 truncate">{skillName}</div>
                                <div className="text-gray-500 italic">{v}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
