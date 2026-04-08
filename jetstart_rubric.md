import { useState } from "react";

const RATING_SCALE = ["4", "3", "2", "1", "N/O"];

const MODULES = [
  {
    title: "MODULE 1: Professionalism & Customer Communication",
    sections: [
      {
        subtitle: "Arriving on Site (Meet & Greet)",
        skills: [
          "Introduces self, crew, and company clearly and professionally",
          "Confirms scope of work in simple, jargon-free terms",
          "Sets expectations for duration, noise, and power interruptions",
          "Explains home protection measures (runners, tarps, boot covers)",
          "Asks permission before entering the home",
          "Asks for parking and equipment staging location",
          "Asks for permission to use customer's bathroom",
          "Completes pre-walk (equipment location, line set runs, ceiling/wall cuts)",
          "Asks for Wi-Fi credentials",
          "Asks for permission to place Jetson yard sign",
          "Responds calmly and clearly to homeowner questions and concerns",
        ],
      },
      {
        subtitle: "Departing the Site",
        skills: [
          "Confirms all work is completed and site is clean",
          "Walks homeowner through thermostat operation",
          "Explains heat pump operation vs. traditional HVAC",
          "Walks homeowner through the Jetson app",
          "Explains outdoor unit normal operation (including defrost cycle)",
          "Explains filter maintenance and outdoor unit clearing responsibilities",
          "Asks for homeowner satisfaction before leaving",
          "Professionally and confidently requests a 5-star Google review",
          "Handles unsatisfied homeowner appropriately; attempts to resolve",
        ],
      },
    ],
  },
  { title: "MODULE 2: Jetson System Knowledge", skills: ["Identifies all major components of the Jetson Air System","Explains the function of the ODU (compressor, base/pad, stand, wall bracing)","Explains the function of the IDU (evaporator, coil, blower, condensate)","Explains liquid line vs. suction line purpose, size, and insulation","Explains the Jetson Hub — purpose, communications, LED indicators","Explains the Temperature & Humidity Sensor — placement and function","Explains the IAQ Sensor — placement and function","Explains the Emporia energy monitor — purpose and CT clamp orientation","Explains the Jetson thermostat and homeowner app","Describes heating vs. cooling refrigerant cycle","Distinguishes between 2-ton, 3-ton, 4-ton, and 5-ton systems"] },
  {
    title: "MODULE 3: Line Set Handling",
    sections: [
      { subtitle: "Line Set Unrolling", skills: ["Explains why improper unrolling causes damage","Correctly unrolls line set using the walk-out method","Unrolls on flat, smooth ground without kinks or flat spots","Performs visual inspection of unrolled line set","Identifies damage (kinks, flat spots, stress marks) correctly"] },
      { subtitle: "Line Set Cutting", skills: ["Measures and marks cut locations accurately (within ±⅛\")","Uses pipe cutter correctly (snug, not over-tightened; 2–3 rotation scoring)","Produces clean, square cuts without deforming the pipe","Reams inside of tubing completely","Deburrs and chamfers outside of tubing","Covers cut ends with electrical tape immediately after cutting","Keeps pipe face down while deburring to prevent shavings entry"] },
      { subtitle: "Line Set Bending", skills: ["Cuts insulation without scoring the pipe","Makes a 90° bend meeting radius spec with no visible flattening","Makes offset bends with equal angles and correct spacing","Makes reverse bends correctly","Re-tapes insulation seam neatly with color-matched duct tape","Plans bends before executing (minimizes waste)","Does not re-bend kinked tubing (replaces instead)"] },
    ],
  },
  {
    title: "MODULE 4: Line Set Connections",
    sections: [
      { subtitle: "Press Fitting (RLS Tool)", skills: ["Inspects O-rings and fittings before use","Cleans outside of tubing with Scotch-Brite (spinning motion, not lengthwise)","Marks fitting depth with depth gauge","Calibrates press tool when changing jaw sizes","Inserts tubing fully to depth mark without damaging O-ring","Aligns and seats press jaws squarely over fitting","Completes full press cycle; verifies RLS stamp","Confirms press with crimp gauge"] },
      { subtitle: "Flaring (NAVAC Tool)", skills: ["Reams inside of line set before flaring","Slides flare nut onto tubing (correct orientation) before flaring","Inserts tubing to correct depth in flaring tool block","Completes one full machine cycle; inspects flare","Identifies a good flare (smooth, centered, 45°, no cracks or thinning)","Identifies and correctly cuts off a bad flare"] },
      { subtitle: "Flare Nut Torquing", skills: ["Applies oil/Nylog to flare face before attaching","Hand-tightens before using torque wrench","Uses proper two-wrench (back-wrench) technique","Torques to correct specification (¾\" = 73 ft-lbs; ⅜\" = 26 ft-lbs; ⅝\" = 50 ft-lbs)","Does not reuse previously torqued flares"] },
    ],
  },
  {
    title: "MODULE 5: Equipment Removal",
    sections: [
      { subtitle: "Removing Old Condensing Unit (ODU)", skills: ["Disconnects electrical at disconnect and breaker; confirms absence of voltage","Inspects recovery cylinder (no damage, correct refrigerant, within 5-year date)","Sets up recovery cylinder on level scale; zeros scale","Removes Schrader cores from both service valves","Makes correct hose connections (RED to liquid, BLUE to suction, YELLOW to recovery)","Purges air from hoses before opening recovery cylinder","Operates recovery machine correctly; allows auto-shutoff and self-purge","Does not exceed 80% cylinder capacity","Crimps and seals old line set ends with electrical tape after recovery","Safely moves old unit to staging area"] },
      { subtitle: "Removing Old Forced Air Unit (IDU)", skills: ["Confirms electricity is OFF; uses voltage tester","Shuts off gas at meter; disconnects and caps gas line","Caps flue pipe to prevent carbon monoxide intrusion","Removes condensate pump","Disconnects and seals A/C coil line set","Disconnects supply and return plenums (preserves plenum for reuse where applicable)","After capping gas, turns gas back on and soap-tests cap","Confirms pilot lights and all gas appliances are operational"] },
    ],
  },
  {
    title: "MODULE 6: Sheet Metal Fabrication",
    sections: [
      { subtitle: "Supply Plenum Transitions", skills: ["Correctly measures air handler outlet dimensions","Safely cuts sheet metal using snips and folding bar","Notches V's in corners correctly","Makes proper 1\" bends/lips on all edges","Makes cross-breaks in each panel","Secures sections with correct screw locations and quantity","Seals all seams with foil tape (minimal creases)","Final transition is square, tight, and aesthetically clean"] },
      { subtitle: "Return Air Base Can", skills: ["Measures and plans base can dimensions correctly","Cuts and bends all panels cleanly","Assembles base can square and level","Installs foil tape on all interior and exterior seams","Places IDU on base can and verifies level fit, full contact, and filter access","Installs foam tape between base can and IDU"] },
    ],
  },
  { title: "MODULE 7: Sensor Installation", skills: ["Selects correct plenum for Temperature & Humidity Sensor (supply air)","Marks and drills sensor opening without dropping shavings into plenum","Installs T&H sensor in correct orientation; secures with screws","Selects correct plenum for IAQ Sensor (supply air; 2' from turns)","Drills 2.5\" hole cleanly and cleans sharp edges","Installs IAQ sensor with vanes aligned parallel to airflow; confirms black tip is present"] },
  { title: "MODULE 8: Condensate Pump Installation", skills: ["Determines correct pump location (level, accessible, below IDU drain outlet)","Installs trap and PVC drain line with correct slope to pump","Installs overflow switch in IDU overflow port","Routes and secures discharge tubing correctly (no improper termination)","Wires overflow switch and pump in series at CN5 (cuts blue jumper wire)","Tests pump operation by adding water to p-trap","Confirms safety switch shuts system off when float is triggered"] },
  { title: "MODULE 9: ODU Base & Stand", skills: ["Prepares level gravel base (¾\" then ¼\" gravel, tamped)","Confirms base pad is level in all directions","Assembles ODU stand to correct dimensions for unit size","Places stand symmetrically on pad; confirms 12\" clearance from wall","Mounts ODU on stand and confirms level","Installs aircraft cable (seismic bracing) to ODU and wall correctly"] },
  { title: "MODULE 10: Line Set Cleaning", skills: ["Explains why line set cleaning is required","Flushes Rx11 solvent for correct duration (20–30 sec per 50' for ⅜\"; 60–90 sec for ¾\")","Flushes from inside the home toward outside","Collects and disposes of solvent waste properly","Selects correct pig size; loads and launches Hilmor pig correctly","Sets nitrogen regulator to correct pressure (max 60 psig)","Repeats pigging until pig comes out clean","Caps line set ends with electrical tape after cleaning"] },
  {
    title: "MODULE 11: Pressure Testing (Nitrogen)",
    sections: [
      { subtitle: "3/4/5-Ton Systems", skills: ["Confirms all connections are exposed before pressurizing","Removes Schrader cores from both VCRTs","Connects hoses correctly (YELLOW hose to ⅜\" liquid; pressure probe to ¾\" suction)","Purges hoses before pressurizing","Pressurizes to 200 psi; soap-tests all joints","Increases to 550 psi; monitors Fieldpiece app for 30 minutes","Identifies and corrects leaks before continuing","Depressurizes correctly (leaves 5 psi in system)"] },
      { subtitle: "2-Ton Systems (Additional Requirements)", skills: ["Confirms EEV is open by verifying nitrogen flow from loosened ⅜\" flare fitting","Places system in Recovery Mode (Menu n122) when EEV is closed","Torques ⅜\" flare nut to 26 ft-lbs after purge confirmation"] },
    ],
  },
  { title: "MODULE 12: Vacuum Testing", skills: ["Confirms system passed nitrogen pressure test before pulling vacuum","Checks vacuum pump oil (clean and correct level)","Connects large-diameter hoses (½\") directly to service ports","Places vacuum gauge at the system (not at the pump)","Opens gas ballast; closes at 3,000 microns","Pulls vacuum to 150 microns; closes VCRT valves","Performs 15-minute decay test (passes if rise ≤ 500 microns)","Correctly diagnoses cause of failed decay test","Removes vacuum hoses without losing vacuum integrity"] },
  { title: "MODULE 13: Refrigerant Charging", skills: ["Verifies correct refrigerant type (R-454B)","Confirms system passed pressure and vacuum tests before charging","Measures line set length with tape measure (does not estimate)","Calculates correct charge amount (0.036 lb/ft of ⅜\" line set)","Sets cylinder upside down on level scale; zeros scale","Purges air from YELLOW hose before opening VCRT","Uses heater blanket correctly when needed (includes blanket + cord in weight)","Closes VCRT at target weight; does not overcharge","Replaces Schrader cores; soap-tests; back-seats service valves"] },
  { title: "MODULE 14: Line Set Routing & Wall Penetrations", skills: ["Plans shortest practical route and marks penetration locations","Locates and confirms joist bay before drilling (exploratory hole if needed)","Uses Super Hawg safely (two hands, solid footing, stages drilling)","Drills 3.5\" hole cleanly through siding, sheathing, and rim joist","Inspects opening with flashlight before routing","Attaches line sets and comm wire to fish tape using Kallem grip","Routes both line sets through mock-up without damage","Secures line sets at correct intervals (vertical, horizontal, at direction changes)","Installs line hide level and plumb","Seals wall penetration with clear silicone caulk"] },
  { title: "MODULE 15: Wiring the Jetson Hub", skills: ["Installs Jetson thermostat and baseplate level on wall","Sets correct dip switch (SW8-1 = ON) and ENC1 rotary dial (= 1)","Correctly strips wires to proper strip length (no nicks or stray strands)","Terminates all sensors in correct phoenix connector positions per wiring diagram","Uses correct wire gauge/type for each connection (18 AWG 2/3/4-wire; shielded comm wire)","Grounds drain wire on one end only (shielded wire)","Passes tug test on all connections","Manages wires neatly with cable clips; no excessive tension","Wires condensate pump and overflow switch in series at CN5"] },
  { title: "MODULE 16: Hub Provisioning", skills: ["Explains what provisioning means and why it is required","Confirms all wiring is complete and dip switches are correctly set before powering on","Follows correct Hub initialization sequence (unplug T&H sensor, power on, wait, reconnect)","Provisions Hub via Installer app (USB connection, paper clip button, solid blue LED confirmation)","Connects Hub to homeowner's 2.4 GHz Wi-Fi via Jetson Home app","Allows firmware update to complete (does not power-cycle during white LED)","Re-provisions after firmware update","Correctly interprets Hub LED codes and knows appropriate field response"] },
  { title: "MODULE 17: System Commissioning", skills: ["Verifies all pre-commissioning checklist items (wiring, dip switches, valves, power, Emporia)","Initializes ODU correctly (2 middle buttons → 01-0 OK → 02-1 OK; waits for \"0 1\")","Drills and installs supply psychrometer, return psychrometer, and manometer probes correctly","Zeros manometer probes before use","Pairs all Fieldpiece tools to mobile app correctly","Orients manometer probe correctly toward blower","Records TESP and Delta P readings in Zuper","Records supply and return dry-bulb and wet-bulb temperatures in Zuper","Removes probes and seals all ⅜\" test holes with duct plugs","Does not interrupt power during INIT/AuAd sequence"] },
  { title: "SAFETY — All Modules", isSafety: true, skills: ["Wears safety glasses during all hands-on activities","Wears gloves during all hands-on activities","Confirms absence of voltage before electrical work","Never carries nitrogen cylinder up a ladder","Stands to the side of gauges when pressurizing","Pressurizes slowly and gradually","Wears cut-resistant gloves during sheet metal work","Cleans up metal shavings from sheet metal work","Confirms gas is off before removing gas line; soap-tests cap","Caps flue pipe after removing furnace","Works in ventilated area when handling refrigerant or solvents","Does not power-cycle Hub during firmware update (white LED)"] },
  { title: "PROFESSIONALISM — All Modules", isSafety: true, skills: ["Maintains clean and tidy work area throughout the day","Returns all tools/systainer kits to correct storage after each activity","Uses Notion app to look up answers before asking instructor","Communicates proactively with crew and instructor","Treats training equipment and customer property with care","Represents Jetson's code of conduct at all times","Communicates with maturity"] },
];

const NUM_STUDENTS = 12;
const DEFAULT_STUDENTS = Array.from({ length: NUM_STUDENTS }, (_, i) => `Student ${i + 1}`);

const ratingColor = (r) => ({
  "4": "bg-green-100 text-green-800", "3": "bg-blue-100 text-blue-800",
  "2": "bg-yellow-100 text-yellow-800", "1": "bg-red-100 text-red-800",
  "N/O": "bg-gray-100 text-gray-500", "✓": "bg-green-100 text-green-800",
  "△": "bg-yellow-100 text-yellow-800", "✗": "bg-red-100 text-red-800",
}[r] || "bg-white text-gray-300");

const avgColor = (avg) => avg === null ? "" : avg >= 3.5 ? "text-green-700 font-bold" : avg >= 2.5 ? "text-blue-700 font-semibold" : avg >= 1.5 ? "text-yellow-700 font-semibold" : "text-red-700 font-bold";
const cardColor = (avg) => avg === null ? "bg-gray-50 border-gray-200" : avg >= 3.5 ? "bg-green-50 border-green-300" : avg >= 2.5 ? "bg-blue-50 border-blue-300" : avg >= 1.5 ? "bg-yellow-50 border-yellow-300" : "bg-red-50 border-red-300";

export default function App() {
  const [students, setStudents] = useState(DEFAULT_STUDENTS);
  const [grades, setGrades] = useState({});
  const [notes, setNotes] = useState({}); // { studentIdx: { modIdx_secLabel_skill: "note" } } or { studentIdx: "overall" }
  const [activeModule, setActiveModule] = useState(0);
  const [editingStudent, setEditingStudent] = useState(null);
  const [tempName, setTempName] = useState("");
  const [activeTab, setActiveTab] = useState("grading");
  const [notesPanel, setNotesPanel] = useState(null); // { studentIdx, modIdx, secLabel, skill } or null
  const [cohortInfo, setCohortInfo] = useState({ trainer: "", cohort: "", dates: "" });
  const [editingInfo, setEditingInfo] = useState(false);

  const getKey = (mod, sec, skill) => `${mod}||${sec || ""}||${skill}`;

  const setGrade = (modIdx, secLabel, skill, si, val) => {
    const k = getKey(modIdx, secLabel, skill);
    setGrades(g => ({ ...g, [k]: { ...(g[k] || {}), [si]: val === (g[k]?.[si]) ? "" : val } }));
  };
  const getGrade = (modIdx, secLabel, skill, si) => grades[getKey(modIdx, secLabel, skill)]?.[si] || "";

  const setNote = (si, key, val) => setNotes(n => ({ ...n, [si]: { ...(n[si] || {}), [key]: val } }));
  const getNote = (si, key) => notes[si]?.[key] || "";
  const overallNote = (si) => notes[si]?.["__overall__"] || "";
  const setOverallNote = (si, val) => setNote(si, "__overall__", val);

  const hasNote = (si, key) => !!(notes[si]?.[key]);

  const allSkillKeys = [];
  MODULES.forEach((mod, mi) => {
    if (mod.sections) mod.sections.forEach(sec => sec.skills.forEach(sk => allSkillKeys.push({ modIdx: mi, secLabel: sec.subtitle, skill: sk, modTitle: mod.title })));
    else (mod.skills || []).forEach(sk => allSkillKeys.push({ modIdx: mi, secLabel: null, skill: sk, modTitle: mod.title }));
  });

  const studentAvg = (si) => {
    const vals = allSkillKeys.map(({ modIdx, secLabel, skill }) => {
      const g = grades[getKey(modIdx, secLabel, skill)]?.[si] || "";
      return ["4","3","2","1"].includes(g) ? parseInt(g) : null;
    }).filter(v => v !== null);
    return vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2) : null;
  };

  const modAvg = (mi, si) => {
    const m = MODULES[mi];
    const keys = [];
    if (m.sections) m.sections.forEach(sec => sec.skills.forEach(sk => keys.push({ secLabel: sec.subtitle, skill: sk })));
    else (m.skills||[]).forEach(sk => keys.push({ secLabel: null, skill: sk }));
    const vals = keys.map(({secLabel,skill}) => { const g = grades[getKey(mi,secLabel,skill)]?.[si]||""; return ["4","3","2","1"].includes(g)?parseInt(g):null; }).filter(v=>v!==null);
    return vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1) : null;
  };

  // PDF Export
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

    // Per-student pages
    students.forEach((name, si) => {
      html += `<div class="${si>0?"page-break":""}"><h2 style="font-size:12pt">${name}</h2>`;
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
        else renderSection(mod.skills||[], null);
      });
      html += `</div>`;
    });

    // Summary page
    html += `<div class="page-break"><h2 style="font-size:12pt">Cohort Summary</h2>`;
    html += `<div style="margin-bottom:12px">`;
    students.forEach((name, si) => {
      const avg = studentAvg(si);
      const col = avg===null?"#f3f4f6":avg>=3.5?"#dcfce7":avg>=2.5?"#dbeafe":avg>=1.5?"#fef9c3":"#fee2e2";
      html += `<div class="summary-card" style="background:${col}"><div style="font-weight:bold">${name}</div><div class="avg">${avg??"-"}</div><div style="font-size:6.5pt;color:#666">overall avg</div></div>`;
    });
    html += `</div>`;

    html += `<table><thead><tr><th class="skill-col" style="width:180px">Module</th>${students.map(n=>`<th style="width:55px">${n}</th>`).join("")}</tr></thead><tbody>`;
    MODULES.forEach((m, mi) => {
      html += `<tr><td style="font-weight:600;font-size:7pt">${m.title.replace(/MODULE \d+: /,"").replace(/ — All Modules/,"")}</td>`;
      students.forEach((_,si)=>{
        const a = modAvg(mi,si);
        const col = a===null?"":a>=3.5?"#dcfce7":a>=2.5?"#dbeafe":a>=1.5?"#fef9c3":"#fee2e2";
        html += `<td style="text-align:center;background:${col}">${a??"-"}</td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody></table></div>`;
    html += `</body></html>`;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 500);
  };

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
                <select value={g} onChange={e => setGrade(modIdx, secLabel, skill, idx, e.target.value)}
                  className={`text-xs rounded px-1 py-0.5 border border-gray-200 cursor-pointer w-full ${ratingColor(g)}`}>
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

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="text-base font-bold">JetStart Training Rubric</div>
          <div className="text-xs text-gray-400">12-Student Cohort · Trainer Tool</div>
        </div>
        <div className="flex gap-2 items-center">
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
            {["trainer","cohort","dates"].map(f => (
              <label key={f} className="flex items-center gap-1 text-gray-600">
                <span className="capitalize font-medium">{f}:</span>
                <input value={cohortInfo[f]} onChange={e => setCohortInfo(c=>({...c,[f]:e.target.value}))}
                  className="border border-gray-300 rounded px-1 py-0.5 text-xs w-28"/>
              </label>
            ))}
            <button onClick={()=>setEditingInfo(false)} className="px-2 py-0.5 rounded bg-blue-600 text-white text-xs">Save</button>
          </>
        ) : (
          <>
            <span className="text-gray-600"><strong>Trainer:</strong> {cohortInfo.trainer||<span className="text-gray-400 italic">not set</span>}</span>
            <span className="text-gray-600"><strong>Cohort:</strong> {cohortInfo.cohort||<span className="text-gray-400 italic">not set</span>}</span>
            <span className="text-gray-600"><strong>Dates:</strong> {cohortInfo.dates||<span className="text-gray-400 italic">not set</span>}</span>
            <button onClick={()=>setEditingInfo(true)} className="ml-1 px-2 py-0.5 rounded border border-gray-300 text-gray-500 hover:bg-gray-50 text-xs">Edit</button>
            <span className="ml-4 text-gray-400">Scale: <span className="bg-green-100 text-green-700 px-1 rounded">4=Exceeds</span> <span className="bg-blue-100 text-blue-700 px-1 rounded">3=Meets</span> <span className="bg-yellow-100 text-yellow-700 px-1 rounded">2=Approaching</span> <span className="bg-red-100 text-red-700 px-1 rounded">1=Below</span></span>
          </>
        )}
      </div>

      {activeTab === "grading" && (
        <div className="flex flex-1 overflow-hidden">
          {/* Module sidebar */}
          <div className="w-52 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
            {MODULES.map((m, i) => (
              <button key={i} onClick={() => setActiveModule(i)}
                className={`w-full text-left px-3 py-2 text-xs border-b border-gray-100 transition ${activeModule===i?"bg-blue-600 text-white font-semibold":"text-gray-700 hover:bg-gray-50"}`}>
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
                            <input autoFocus value={tempName} onChange={e=>setTempName(e.target.value)}
                              onBlur={()=>{const n=[...students];n[i]=tempName||students[i];setStudents(n);setEditingStudent(null);}}
                              onKeyDown={e=>{if(e.key==="Enter"||e.key==="Escape"){const n=[...students];n[i]=tempName||students[i];setStudents(n);setEditingStudent(null);}}}
                              className="bg-gray-700 text-white text-xs rounded px-1 w-16 text-center outline-none"/>
                          ) : (
                            <span className="cursor-pointer hover:underline" title="Click to rename" onClick={()=>{setEditingStudent(i);setTempName(students[i]);}}>{name}</span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mod.sections
                      ? mod.sections.map((sec, si) => (
                        <>
                          <tr key={`sec-${si}`} className="bg-blue-50">
                            <td colSpan={NUM_STUDENTS+1} className="px-3 py-1.5 text-xs font-semibold text-blue-800 border-b border-blue-200">{sec.subtitle}</td>
                          </tr>
                          {renderSkillRows(activeModule, sec.skills, sec.subtitle)}
                        </>
                      ))
                      : renderSkillRows(activeModule, mod.skills||[], null)
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
                <button onClick={()=>setNotesPanel(null)} className="text-gray-400 hover:text-white text-lg leading-none ml-2">×</button>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Field Notes for this Skill</label>
                  <textarea
                    autoFocus
                    value={getNote(notesPanel.studentIdx, notesPanel.noteKey)}
                    onChange={e=>setNote(notesPanel.studentIdx, notesPanel.noteKey, e.target.value)}
                    placeholder="Enter observations, specific errors, coaching notes..."
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Overall Notes for {students[notesPanel.studentIdx]}</label>
                  <textarea
                    value={overallNote(notesPanel.studentIdx)}
                    onChange={e=>setOverallNote(notesPanel.studentIdx, e.target.value)}
                    placeholder="General strengths, areas for improvement, follow-up actions..."
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                    rows={4}
                  />
                </div>
                <button onClick={()=>setNotesPanel(null)} className="mt-auto w-full py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">Done</button>
              </div>
            </div>
          )}
        </div>
      )}

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
                  {students.map((n,i)=><th key={i} className="px-2 py-2 text-center border-r border-gray-600 min-w-[60px]">{n}</th>)}
                </tr>
              </thead>
              <tbody>
                {MODULES.map((m, mi) => (
                  <tr key={mi} className={mi%2===0?"bg-white":"bg-gray-50"}>
                    <td className="px-3 py-2 font-medium text-gray-700 border-r border-gray-200 text-xs">{m.title.replace(/MODULE \d+: /,"").replace(/ — All Modules/,"")}</td>
                    {students.map((_,si)=>{const a=modAvg(mi,si);return <td key={si} className={`px-2 py-2 text-center border-r border-gray-100 ${avgColor(a)}`}>{a??"-"}</td>;})}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "studentnotes" && (
        <div className="p-6 overflow-auto">
          <div className="text-sm font-bold text-gray-800 mb-4">Student Notes Overview</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students.map((name, si) => {
              const allNotes = Object.entries(notes[si]||{}).filter(([k,v])=>k!=="__overall__"&&v);
              return (
                <div key={si} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
                    <span className="font-semibold text-sm">{name}</span>
                    <span className="text-xs text-gray-400">{allNotes.length} skill note{allNotes.length!==1?"s":""}</span>
                  </div>
                  <div className="p-3 space-y-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Overall Notes</label>
                      <textarea value={overallNote(si)} onChange={e=>setOverallNote(si,e.target.value)}
                        placeholder="General strengths, areas for improvement, follow-up actions..."
                        className="w-full border border-gray-200 rounded px-2 py-1 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 bg-amber-50"
                        rows={3}/>
                    </div>
                    {allNotes.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-1">Skill Notes</div>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {allNotes.map(([k,v]) => {
                            const parts = k.split("||");
                            const skillName = parts[2]||k;
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
