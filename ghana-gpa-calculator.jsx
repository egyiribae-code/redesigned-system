import { useState, useEffect, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart, Legend
} from "recharts";

// ── Ghana Grading Scale ──────────────────────────────────────────────────────
const GRADE_SCALE = [
  { label: "A",  min: 80, max: 100, point: 4.0 },
  { label: "B+", min: 75, max: 79,  point: 3.5 },
  { label: "B",  min: 70, max: 74,  point: 3.0 },
  { label: "C+", min: 65, max: 69,  point: 2.5 },
  { label: "C",  min: 60, max: 64,  point: 2.0 },
  { label: "D+", min: 55, max: 59,  point: 1.5 },
  { label: "D",  min: 50, max: 54,  point: 1.0 },
  { label: "F",  min: 0,  max: 49,  point: 0.0 },
];

const scoreToGrade = (score) => {
  const s = parseFloat(score);
  if (isNaN(s)) return null;
  return GRADE_SCALE.find(g => s >= g.min && s <= g.max) || GRADE_SCALE[GRADE_SCALE.length - 1];
};

const gradeToPoint = (label) => {
  const g = GRADE_SCALE.find(g => g.label === label);
  return g ? g.point : 0;
};

const calcGPA = (courses) => {
  const valid = courses.filter(c => c.credit > 0 && c.grade !== "");
  if (!valid.length) return 0;
  const totalPoints = valid.reduce((sum, c) => sum + gradeToPoint(c.grade) * c.credit, 0);
  const totalCredits = valid.reduce((sum, c) => sum + c.credit, 0);
  return totalCredits ? totalPoints / totalCredits : 0;
};

const calcCGPA = (semesters) => {
  const allCourses = semesters.flatMap(s => s.courses);
  return calcGPA(allCourses);
};

const getClassification = (cgpa) => {
  if (cgpa >= 3.6) return { label: "First Class", color: "#00E5FF" };
  if (cgpa >= 3.0) return { label: "Second Class Upper", color: "#00BCD4" };
  if (cgpa >= 2.0) return { label: "Second Class Lower", color: "#4FC3F7" };
  if (cgpa >= 1.5) return { label: "Third Class", color: "#90CAF9" };
  return { label: "Fail / Referral", color: "#EF9A9A" };
};

// ── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --blue:    #0057FF;
    --blue-lt: #3380FF;
    --teal:    #00C4B4;
    --teal-dk: #008F83;
    --white:   #FFFFFF;
    --bg:      #040F2B;
    --surface: #071A45;
    --card:    #0A2260;
    --border:  #0E3080;
    --muted:   #5B7BAE;
    --text:    #E8F0FF;
    --sub:     #8AAAD4;
    --glow-b:  0 0 24px rgba(0,87,255,0.35);
    --glow-t:  0 0 24px rgba(0,196,180,0.35);
    --radius:  14px;
    --font:    'DM Sans', sans-serif;
    --mono:    'Space Mono', monospace;
  }

  body { font-family: var(--font); background: var(--bg); color: var(--text); min-height: 100vh; }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* ── HEADER ── */
  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 32px;
    background: linear-gradient(90deg, var(--surface) 0%, #061535 100%);
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 100;
  }
  .header-brand { display: flex; align-items: center; gap: 10px; }
  .header-logo {
    width: 36px; height: 36px; border-radius: 8px;
    background: linear-gradient(135deg, var(--blue), var(--teal));
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 14px; color: white; letter-spacing: -0.5px;
  }
  .header-title { font-size: 17px; font-weight: 600; color: var(--white); }
  .header-sub   { font-size: 12px; color: var(--sub); margin-top: 1px; }
  .header-user  { display: flex; align-items: center; gap: 10px; }
  .header-id    { font-family: var(--mono); font-size: 12px; color: var(--teal); background: rgba(0,196,180,0.1); padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(0,196,180,0.25); }
  .btn-logout   { background: transparent; border: 1px solid var(--border); color: var(--sub); padding: 6px 14px; border-radius: 8px; cursor: pointer; font-size: 13px; font-family: var(--font); transition: all .2s; }
  .btn-logout:hover { border-color: var(--muted); color: var(--text); }

  /* ── LOGIN ── */
  .login-wrap {
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: 40px 20px;
    background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,87,255,0.15) 0%, transparent 70%);
  }
  .login-card {
    width: 100%; max-width: 420px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 48px 40px;
    box-shadow: var(--glow-b), 0 24px 64px rgba(0,0,0,0.5);
  }
  .login-icon {
    width: 64px; height: 64px; border-radius: 16px;
    background: linear-gradient(135deg, var(--blue), var(--teal));
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; margin-bottom: 24px;
    box-shadow: var(--glow-b);
  }
  .login-h1 { font-size: 26px; font-weight: 700; color: var(--white); margin-bottom: 6px; }
  .login-p  { font-size: 14px; color: var(--sub); margin-bottom: 32px; line-height: 1.5; }
  .field-label { font-size: 12px; font-weight: 500; color: var(--sub); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
  .field-input {
    width: 100%; padding: 13px 16px;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text);
    font-family: var(--mono); font-size: 14px;
    outline: none; transition: border-color .2s, box-shadow .2s;
    margin-bottom: 16px;
  }
  .field-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(0,87,255,0.2); }
  .field-input::placeholder { color: var(--muted); font-family: var(--font); }
  .btn-primary {
    width: 100%; padding: 14px;
    background: linear-gradient(90deg, var(--blue), var(--teal));
    border: none; border-radius: 10px;
    color: white; font-size: 15px; font-weight: 600; font-family: var(--font);
    cursor: pointer; transition: opacity .2s, transform .1s;
    letter-spacing: 0.2px;
  }
  .btn-primary:hover  { opacity: .9; transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }
  .login-hint { margin-top: 20px; text-align: center; font-size: 12px; color: var(--muted); }

  /* ── SETUP ── */
  .setup-wrap { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 20px; }
  .setup-card { width: 100%; max-width: 500px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 40px; box-shadow: var(--glow-b), 0 24px 64px rgba(0,0,0,0.5); }
  .setup-h2 { font-size: 22px; font-weight: 700; color: var(--white); margin-bottom: 6px; }
  .setup-p  { font-size: 14px; color: var(--sub); margin-bottom: 28px; }
  .setup-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .field-select {
    width: 100%; padding: 13px 16px;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text);
    font-family: var(--font); font-size: 14px;
    outline: none; cursor: pointer; transition: border-color .2s;
    margin-bottom: 16px; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235B7BAE' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center;
    padding-right: 36px;
  }
  .field-select:focus { border-color: var(--blue); }
  .field-select option { background: var(--card); }

  /* ── DASHBOARD ── */
  .dash { flex: 1; padding: 28px 32px; max-width: 1100px; width: 100%; margin: 0 auto; }

  /* Stats row */
  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    position: relative; overflow: hidden;
  }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--blue), var(--teal));
  }
  .stat-label { font-size: 11px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; }
  .stat-value { font-family: var(--mono); font-size: 28px; font-weight: 700; color: var(--white); line-height: 1; }
  .stat-value.blue  { color: var(--blue-lt); }
  .stat-value.teal  { color: var(--teal); }
  .stat-sub   { font-size: 12px; color: var(--muted); margin-top: 4px; }
  .stat-badge { display: inline-block; font-size: 11px; padding: 2px 8px; border-radius: 20px; font-weight: 500; margin-top: 6px; }

  /* Main grid */
  .main-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }
  .left-col  { display: flex; flex-direction: column; gap: 20px; }
  .right-col { display: flex; flex-direction: column; gap: 20px; }

  /* Section cards */
  .section-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .section-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid var(--border); }
  .section-title { font-size: 15px; font-weight: 600; color: var(--white); }
  .section-sub   { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .section-body  { padding: 22px; }

  /* Chart */
  .chart-wrap { width: 100%; height: 220px; }
  .recharts-tooltip-wrapper { font-family: var(--font) !important; }
  .custom-tooltip {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 14px;
    font-size: 13px; color: var(--text);
  }
  .custom-tooltip .ct-label { font-size: 11px; color: var(--muted); margin-bottom: 4px; }
  .custom-tooltip .ct-val   { font-family: var(--mono); font-weight: 700; }

  /* Semesters list */
  .sem-item {
    border: 1px solid var(--border); border-radius: 12px;
    margin-bottom: 12px; overflow: hidden;
    transition: border-color .2s;
  }
  .sem-item:hover { border-color: var(--blue); }
  .sem-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; cursor: pointer;
    background: var(--card);
  }
  .sem-name  { font-size: 14px; font-weight: 600; color: var(--white); }
  .sem-meta  { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .sem-gpa   { font-family: var(--mono); font-size: 18px; font-weight: 700; color: var(--teal); }
  .sem-chevron { color: var(--muted); transition: transform .2s; }
  .sem-chevron.open { transform: rotate(180deg); }

  .sem-courses { padding: 14px 18px; border-top: 1px solid var(--border); }
  .course-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .course-table th { text-align: left; color: var(--muted); font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; padding: 0 0 8px; }
  .course-table td { padding: 6px 0; color: var(--text); border-bottom: 1px solid rgba(14,48,128,0.5); }
  .course-table tr:last-child td { border-bottom: none; }
  .grade-pill {
    display: inline-block; padding: 2px 9px; border-radius: 6px;
    font-family: var(--mono); font-size: 12px; font-weight: 700;
  }
  .grade-A  { background: rgba(0,196,180,0.18); color: var(--teal); }
  .grade-B  { background: rgba(0,87,255,0.18);  color: var(--blue-lt); }
  .grade-C  { background: rgba(91,123,174,0.18); color: var(--sub); }
  .grade-D  { background: rgba(255,167,38,0.15); color: #FFB74D; }
  .grade-F  { background: rgba(239,154,154,0.15); color: #EF9A9A; }

  .btn-delete { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 16px; padding: 2px 6px; border-radius: 6px; transition: color .2s, background .2s; }
  .btn-delete:hover { color: #EF9A9A; background: rgba(239,154,154,0.12); }

  /* Add semester */
  .btn-add {
    display: flex; align-items: center; gap: 8px;
    background: rgba(0,87,255,0.12); border: 1px dashed var(--blue);
    color: var(--blue-lt); padding: 12px 18px; border-radius: 12px;
    font-size: 14px; font-weight: 500; font-family: var(--font);
    cursor: pointer; width: 100%; transition: background .2s;
  }
  .btn-add:hover { background: rgba(0,87,255,0.2); }

  /* Add semester form */
  .add-form { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; margin-top: 12px; }
  .add-form-title { font-size: 14px; font-weight: 600; color: var(--white); margin-bottom: 14px; }
  .course-row { display: grid; grid-template-columns: 2fr 80px 80px 80px; gap: 8px; margin-bottom: 8px; align-items: center; }
  .ci { width: 100%; padding: 9px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-family: var(--font); font-size: 13px; outline: none; transition: border-color .2s; }
  .ci:focus { border-color: var(--blue); }
  .ci::placeholder { color: var(--muted); }
  .ci.sel { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235B7BAE' stroke-width='1.5' fill='none'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px; cursor: pointer; }
  .course-head-row { display: grid; grid-template-columns: 2fr 80px 80px 80px; gap: 8px; margin-bottom: 4px; }
  .col-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.7px; }
  .form-btns { display: flex; gap: 10px; margin-top: 14px; }
  .btn-sm {
    padding: 9px 18px; border-radius: 8px; font-size: 13px; font-weight: 600;
    font-family: var(--font); cursor: pointer; border: none; transition: opacity .2s;
  }
  .btn-sm.primary { background: linear-gradient(90deg, var(--blue), var(--teal)); color: white; }
  .btn-sm.ghost   { background: transparent; border: 1px solid var(--border); color: var(--sub); }
  .btn-sm:hover   { opacity: .85; }
  .btn-sm-icon { background: rgba(0,87,255,0.1); border: 1px solid var(--border); color: var(--blue-lt); padding: 6px 12px; border-radius: 8px; font-size: 12px; cursor: pointer; font-family: var(--font); transition: background .2s; }
  .btn-sm-icon:hover { background: rgba(0,87,255,0.2); }

  /* Target GPA */
  .target-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .target-head { padding: 18px 22px; border-bottom: 1px solid var(--border); }
  .target-body { padding: 22px; }
  .target-result {
    margin-top: 16px; padding: 16px;
    background: linear-gradient(135deg, rgba(0,87,255,0.12), rgba(0,196,180,0.12));
    border: 1px solid rgba(0,196,180,0.25);
    border-radius: 12px; text-align: center;
  }
  .target-needed { font-family: var(--mono); font-size: 32px; font-weight: 700; line-height: 1; }
  .target-label  { font-size: 12px; color: var(--muted); margin-top: 4px; }
  .feasibility   { font-size: 12px; font-weight: 600; margin-top: 8px; }
  .feasibility.green  { color: var(--teal); }
  .feasibility.yellow { color: #FFB74D; }
  .feasibility.red    { color: #EF9A9A; }

  /* Grade ref */
  .grade-ref { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .grade-ref-body { padding: 14px; }
  .grade-row { display: flex; align-items: center; justify-content: space-between; padding: 5px 8px; border-radius: 7px; margin-bottom: 3px; }
  .grade-row:hover { background: rgba(255,255,255,0.03); }
  .gr-range { font-size: 12px; color: var(--sub); }
  .gr-point { font-family: var(--mono); font-size: 13px; font-weight: 700; }

  /* Sem progress bar */
  .progress-bar { height: 4px; background: var(--border); border-radius: 4px; overflow: hidden; margin-top: 10px; }
  .progress-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--blue), var(--teal)); transition: width .6s; }

  /* Empty */
  .empty { text-align: center; padding: 40px 20px; color: var(--muted); font-size: 14px; }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }

  /* Error */
  .error-msg { background: rgba(239,154,154,0.12); border: 1px solid rgba(239,154,154,0.3); color: #EF9A9A; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 14px; }

  /* Responsive */
  @media (max-width: 900px) {
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .main-grid { grid-template-columns: 1fr; }
    .dash { padding: 20px 16px; }
    .header { padding: 14px 16px; }
  }
  @media (max-width: 500px) {
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .course-row { grid-template-columns: 1fr 60px 60px 32px; }
    .login-card { padding: 32px 24px; }
  }
`;

// ── Sub-components ────────────────────────────────────────────────────────────
const GradePill = ({ label }) => {
  const cls = label?.startsWith("A") ? "grade-A" : label?.startsWith("B") ? "grade-B" : label?.startsWith("C") ? "grade-C" : label?.startsWith("D") ? "grade-D" : "grade-F";
  return <span className={`grade-pill ${cls}`}>{label}</span>;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="ct-label">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="ct-val" style={{ color: p.color }}>
          {p.name}: {parseFloat(p.value).toFixed(2)}
        </div>
      ))}
    </div>
  );
};

const GradeReference = () => (
  <div className="grade-ref">
    <div className="section-head">
      <div>
        <div className="section-title">Ghana Grade Scale</div>
        <div className="section-sub">Letter grades & points</div>
      </div>
    </div>
    <div className="grade-ref-body">
      {GRADE_SCALE.map(g => (
        <div className="grade-row" key={g.label}>
          <GradePill label={g.label} />
          <span className="gr-range">{g.min} – {g.max}%</span>
          <span className="gr-point" style={{ color: g.point >= 3 ? "var(--teal)" : g.point >= 2 ? "var(--blue-lt)" : g.point >= 1 ? "#FFB74D" : "#EF9A9A" }}>
            {g.point.toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const TargetGPA = ({ currentCGPA, totalCreditsEarned }) => {
  const [targetGPA, setTargetGPA] = useState("3.5");
  const [totalSemesters, setTotalSemesters] = useState("8");
  const [creditsPerSem, setCreditsPerSem] = useState("18");
  const [completedSems, setCompletedSems] = useState("");

  const totalCreditsNeeded = parseFloat(totalSemesters) * parseFloat(creditsPerSem) || 0;
  const remainingCredits = Math.max(totalCreditsNeeded - totalCreditsEarned, 0);
  const targetPoints = parseFloat(targetGPA) * totalCreditsNeeded;
  const currentPoints = currentCGPA * totalCreditsEarned;
  const neededPoints = targetPoints - currentPoints;
  const requiredGPA = remainingCredits > 0 ? neededPoints / remainingCredits : null;

  const feasible = requiredGPA !== null && requiredGPA <= 4.0;
  const color = requiredGPA === null ? "var(--muted)" : requiredGPA <= 3.0 ? "var(--teal)" : requiredGPA <= 3.8 ? "#FFB74D" : "#EF9A9A";
  const feasText = requiredGPA === null ? "Enter parameters" : requiredGPA <= 4.0 ? requiredGPA <= 3.0 ? "✓ Very achievable" : requiredGPA <= 3.8 ? "⚠ Challenging but possible" : "⚠ Very challenging" : "✗ Not achievable — consider adjusting your target";
  const feasCls = requiredGPA === null ? "" : requiredGPA <= 3.0 ? "green" : requiredGPA <= 3.8 ? "yellow" : "red";

  return (
    <div className="target-card">
      <div className="target-head">
        <div className="section-title">Target GPA Planner</div>
        <div className="section-sub">Find your required semester GPA</div>
      </div>
      <div className="target-body">
        <div className="field-label">Desired CGPA at Graduation</div>
        <select className="field-select" value={targetGPA} onChange={e => setTargetGPA(e.target.value)} style={{ marginBottom: 12 }}>
          {[4.0,3.9,3.8,3.7,3.6,3.5,3.0,2.5,2.0].map(v => <option key={v} value={v}>{v.toFixed(1)} — {getClassification(v).label}</option>)}
        </select>

        <div className="setup-row">
          <div>
            <div className="field-label">Total Semesters</div>
            <select className="field-select" value={totalSemesters} onChange={e => setTotalSemesters(e.target.value)}>
              {[6,7,8,9,10,12].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <div className="field-label">Credits / Sem</div>
            <select className="field-select" value={creditsPerSem} onChange={e => setCreditsPerSem(e.target.value)}>
              {[15,16,17,18,19,20,21,22,24].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        <div className="target-result">
          <div className="target-needed" style={{ color }}>
            {requiredGPA !== null && remainingCredits > 0 ? requiredGPA.toFixed(2) : remainingCredits === 0 ? "🎉" : "—"}
          </div>
          <div className="target-label">Required GPA per remaining semester</div>
          <div className={`feasibility ${feasCls}`}>{feasText}</div>
          {remainingCredits === 0 && <div className="feasibility green">You have completed all credits!</div>}
        </div>

        <div style={{ marginTop: 14, fontSize: 12, color: "var(--muted)" }}>
          Credits earned: <strong style={{ color: "var(--sub)" }}>{totalCreditsEarned}</strong> &nbsp;·&nbsp;
          Remaining: <strong style={{ color: "var(--sub)" }}>{Math.round(remainingCredits)}</strong>
        </div>
      </div>
    </div>
  );
};

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("login"); // login | setup | dash
  const [studentId, setStudentId] = useState("");
  const [inputId, setInputId] = useState("");
  const [student, setStudent] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [setupData, setSetupData] = useState({ name: "", program: "", level: "100" });
  const [openSems, setOpenSems] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addSemName, setAddSemName] = useState("");
  const [addCourses, setAddCourses] = useState([
    { id: 1, name: "", credit: "", grade: "" },
    { id: 2, name: "", credit: "", grade: "" },
    { id: 3, name: "", credit: "", grade: "" },
  ]);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const saveStudent = useCallback(async (data) => {
    try {
      await window.storage.set(`student:${data.id}`, JSON.stringify(data));
    } catch (e) { console.error(e); }
  }, []);

  const loadStudent = useCallback(async (id) => {
    try {
      const res = await window.storage.get(`student:${id}`);
      return res ? JSON.parse(res.value) : null;
    } catch { return null; }
  }, []);

  const handleLogin = async () => {
    const id = inputId.trim().toUpperCase();
    if (!id) { setLoginError("Please enter your Student ID."); return; }
    if (id.length < 4) { setLoginError("Student ID must be at least 4 characters."); return; }
    setLoading(true);
    const data = await loadStudent(id);
    setLoading(false);
    setStudentId(id);
    if (data) {
      setStudent(data);
      setScreen("dash");
    } else {
      setScreen("setup");
    }
    setLoginError("");
  };

  const handleSetup = async () => {
    if (!setupData.name.trim()) { setLoginError("Please enter your full name."); return; }
    if (!setupData.program.trim()) { setLoginError("Please enter your programme."); return; }
    const newStudent = {
      id: studentId,
      name: setupData.name.trim(),
      program: setupData.program.trim(),
      level: setupData.level,
      semesters: [],
    };
    await saveStudent(newStudent);
    setStudent(newStudent);
    setScreen("dash");
    setLoginError("");
  };

  const handleLogout = () => {
    setScreen("login");
    setStudentId("");
    setInputId("");
    setStudent(null);
    setShowAddForm(false);
    setLoginError("");
  };

  const toggleSem = (id) => setOpenSems(p => ({ ...p, [id]: !p[id] }));

  const addCourseRow = () => setAddCourses(prev => [...prev, { id: Date.now(), name: "", credit: "", grade: "" }]);
  const removeCourseRow = (id) => setAddCourses(prev => prev.filter(c => c.id !== id));
  const updateCourse = (id, field, val) => setAddCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));

  const handleAddSemester = async () => {
    if (!addSemName.trim()) { setFormError("Please enter a semester name."); return; }
    const valid = addCourses.filter(c => c.name.trim() && c.credit && c.grade);
    if (!valid.length) { setFormError("Add at least one course with name, credit, and grade."); return; }
    const newSem = {
      id: Date.now(),
      name: addSemName.trim(),
      courses: valid.map(c => ({ name: c.name.trim(), credit: parseFloat(c.credit), grade: c.grade })),
    };
    newSem.gpa = calcGPA(newSem.courses);
    newSem.credits = newSem.courses.reduce((s, c) => s + c.credit, 0);
    const updated = { ...student, semesters: [...student.semesters, newSem] };
    setStudent(updated);
    await saveStudent(updated);
    setShowAddForm(false);
    setAddSemName("");
    setAddCourses([
      { id: 1, name: "", credit: "", grade: "" },
      { id: 2, name: "", credit: "", grade: "" },
      { id: 3, name: "", credit: "", grade: "" },
    ]);
    setFormError("");
  };

  const handleDeleteSem = async (semId) => {
    const updated = { ...student, semesters: student.semesters.filter(s => s.id !== semId) };
    setStudent(updated);
    await saveStudent(updated);
  };

  // Computed data
  const cgpa = student ? calcCGPA(student.semesters) : 0;
  const classification = getClassification(cgpa);
  const totalCredits = student?.semesters.reduce((s, sem) => s + (sem.credits || 0), 0) || 0;
  const chartData = student?.semesters.map((sem, i) => {
    const runningCourses = student.semesters.slice(0, i + 1).flatMap(s => s.courses);
    return {
      name: sem.name,
      "Semester GPA": parseFloat(sem.gpa.toFixed(2)),
      "CGPA": parseFloat(calcGPA(runningCourses).toFixed(2)),
    };
  }) || [];

  const semNames = [
    "Year 1 – Semester 1", "Year 1 – Semester 2",
    "Year 2 – Semester 1", "Year 2 – Semester 2",
    "Year 3 – Semester 1", "Year 3 – Semester 2",
    "Year 4 – Semester 1", "Year 4 – Semester 2",
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* HEADER */}
        {screen === "dash" && (
          <header className="header">
            <div className="header-brand">
              <div className="header-logo">GPA</div>
              <div>
                <div className="header-title">GPA Tracker</div>
                <div className="header-sub">Ghana University Academic Portal</div>
              </div>
            </div>
            <div className="header-user">
              {student && <span style={{ fontSize: 14, color: "var(--sub)", marginRight: 4 }}>{student.name}</span>}
              <span className="header-id">{studentId}</span>
              <button className="btn-logout" onClick={handleLogout}>Sign out</button>
            </div>
          </header>
        )}

        {/* LOGIN */}
        {screen === "login" && (
          <div className="login-wrap">
            <div className="login-card">
              <div className="login-icon">🎓</div>
              <div className="login-h1">Welcome Back</div>
              <p className="login-p">Enter your Student ID to access your GPA dashboard and academic performance tracker.</p>
              {loginError && <div className="error-msg">{loginError}</div>}
              <div className="field-label">Student ID</div>
              <input
                className="field-input"
                placeholder="e.g. UG/20/0123"
                value={inputId}
                onChange={e => setInputId(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
              <button className="btn-primary" onClick={handleLogin} disabled={loading}>
                {loading ? "Loading…" : "Access Dashboard →"}
              </button>
              <div className="login-hint">New students will be prompted to set up their profile on first login.</div>
            </div>
          </div>
        )}

        {/* SETUP */}
        {screen === "setup" && (
          <div className="setup-wrap">
            <div className="setup-card">
              <div className="login-icon" style={{ marginBottom: 20 }}>✏️</div>
              <div className="setup-h2">Set Up Your Profile</div>
              <p className="setup-p">Student ID <strong style={{ color: "var(--teal)" }}>{studentId}</strong> — we don't have a record for this ID yet. Let's get you started.</p>
              {loginError && <div className="error-msg">{loginError}</div>}
              <div className="field-label">Full Name</div>
              <input className="field-input" placeholder="e.g. Abena Mensah" value={setupData.name} onChange={e => setSetupData(p => ({ ...p, name: e.target.value }))} />
              <div className="field-label">Programme / Course of Study</div>
              <input className="field-input" placeholder="e.g. BSc Computer Science" value={setupData.program} onChange={e => setSetupData(p => ({ ...p, program: e.target.value }))} />
              <div className="field-label">Current Level</div>
              <select className="field-select" value={setupData.level} onChange={e => setSetupData(p => ({ ...p, level: e.target.value }))}>
                {["100","200","300","400","Graduate"].map(l => <option key={l} value={l}>Level {l}</option>)}
              </select>
              <div className="form-btns">
                <button className="btn-sm ghost" onClick={() => setScreen("login")}>← Back</button>
                <button className="btn-sm primary" style={{ flex: 1 }} onClick={handleSetup}>Create Profile →</button>
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {screen === "dash" && student && (
          <div className="dash">
            {/* Stats */}
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-label">Cumulative GPA</div>
                <div className="stat-value teal">{cgpa.toFixed(2)}</div>
                <div className="stat-badge" style={{ background: `${classification.color}20`, color: classification.color }}>
                  {classification.label}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Semesters Completed</div>
                <div className="stat-value blue">{student.semesters.length}</div>
                <div className="stat-sub">{student.program}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Credits Earned</div>
                <div className="stat-value">{totalCredits}</div>
                <div className="stat-sub">credit hours</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Last Semester GPA</div>
                <div className="stat-value" style={{ color: student.semesters.length ? "var(--white)" : "var(--muted)" }}>
                  {student.semesters.length ? student.semesters[student.semesters.length - 1].gpa.toFixed(2) : "—"}
                </div>
                {student.semesters.length > 1 && (() => {
                  const last = student.semesters[student.semesters.length - 1].gpa;
                  const prev = student.semesters[student.semesters.length - 2].gpa;
                  const diff = last - prev;
                  return <div className="stat-sub" style={{ color: diff >= 0 ? "var(--teal)" : "#EF9A9A" }}>{diff >= 0 ? "▲" : "▼"} {Math.abs(diff).toFixed(2)} from last sem</div>;
                })()}
              </div>
            </div>

            {/* Main grid */}
            <div className="main-grid">
              <div className="left-col">
                {/* Chart */}
                <div className="section-card">
                  <div className="section-head">
                    <div>
                      <div className="section-title">GPA Progression</div>
                      <div className="section-sub">Semester GPA vs Cumulative GPA</div>
                    </div>
                  </div>
                  <div className="section-body">
                    {chartData.length < 2 ? (
                      <div className="empty">
                        <div className="empty-icon">📊</div>
                        Add at least two semesters to see your GPA trend
                      </div>
                    ) : (
                      <div className="chart-wrap">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0057FF" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0057FF" stopOpacity={0.02} />
                              </linearGradient>
                              <linearGradient id="gradTeal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00C4B4" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00C4B4" stopOpacity={0.02} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid stroke="#0E3080" strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fill: "#5B7BAE", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 4]} tick={{ fill: "#5B7BAE", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 12, color: "#8AAAD4" }} />
                            <ReferenceLine y={3.6} stroke="rgba(0,196,180,0.3)" strokeDasharray="4 4" label={{ value: "1st Class", fill: "#00C4B4", fontSize: 10 }} />
                            <Area type="monotone" dataKey="Semester GPA" stroke="#0057FF" strokeWidth={2.5} fill="url(#gradBlue)" dot={{ r: 4, fill: "#0057FF", strokeWidth: 0 }} />
                            <Area type="monotone" dataKey="CGPA" stroke="#00C4B4" strokeWidth={2.5} fill="url(#gradTeal)" dot={{ r: 4, fill: "#00C4B4", strokeWidth: 0 }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>

                {/* Semester records */}
                <div className="section-card">
                  <div className="section-head">
                    <div>
                      <div className="section-title">Semester Records</div>
                      <div className="section-sub">{student.semesters.length} semester{student.semesters.length !== 1 ? "s" : ""} recorded</div>
                    </div>
                  </div>
                  <div className="section-body">
                    {student.semesters.length === 0 && (
                      <div className="empty">
                        <div className="empty-icon">📝</div>
                        No semesters yet. Add your first semester below.
                      </div>
                    )}
                    {student.semesters.map((sem) => (
                      <div className="sem-item" key={sem.id}>
                        <div className="sem-header" onClick={() => toggleSem(sem.id)}>
                          <div>
                            <div className="sem-name">{sem.name}</div>
                            <div className="sem-meta">{sem.courses.length} courses · {sem.credits} credits</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div className="sem-gpa">{sem.gpa.toFixed(2)}</div>
                            <button className="btn-delete" onClick={e => { e.stopPropagation(); handleDeleteSem(sem.id); }} title="Delete semester">✕</button>
                            <span className={`sem-chevron ${openSems[sem.id] ? "open" : ""}`}>▾</span>
                          </div>
                        </div>
                        {openSems[sem.id] && (
                          <div className="sem-courses">
                            <table className="course-table">
                              <thead>
                                <tr>
                                  <th>Course</th>
                                  <th style={{ textAlign: "center" }}>Credits</th>
                                  <th style={{ textAlign: "center" }}>Grade</th>
                                  <th style={{ textAlign: "right" }}>Points</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sem.courses.map((c, i) => (
                                  <tr key={i}>
                                    <td>{c.name}</td>
                                    <td style={{ textAlign: "center" }}>{c.credit}</td>
                                    <td style={{ textAlign: "center" }}><GradePill label={c.grade} /></td>
                                    <td style={{ textAlign: "right", fontFamily: "var(--mono)", color: "var(--teal)", fontSize: 13 }}>
                                      {(gradeToPoint(c.grade) * c.credit).toFixed(1)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="progress-bar" style={{ marginTop: 14 }}>
                              <div className="progress-fill" style={{ width: `${(sem.gpa / 4) * 100}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add semester */}
                    {!showAddForm && (
                      <button className="btn-add" onClick={() => setShowAddForm(true)}>
                        <span style={{ fontSize: 18 }}>+</span> Add Semester
                      </button>
                    )}

                    {showAddForm && (
                      <div className="add-form">
                        <div className="add-form-title">New Semester</div>
                        {formError && <div className="error-msg">{formError}</div>}
                        <div className="field-label">Semester Name</div>
                        <select className="field-select" value={addSemName} onChange={e => setAddSemName(e.target.value)} style={{ marginBottom: 14 }}>
                          <option value="">— Select semester —</option>
                          {semNames.map(n => <option key={n} value={n}>{n}</option>)}
                          <option value="custom">Custom…</option>
                        </select>
                        {addSemName === "custom" && (
                          <input className="field-input" placeholder="e.g. Resit Semester" style={{ marginBottom: 14 }} onBlur={e => setAddSemName(e.target.value)} />
                        )}

                        <div className="course-head-row">
                          <div className="col-label">Course Name</div>
                          <div className="col-label" style={{ textAlign: "center" }}>Credits</div>
                          <div className="col-label" style={{ textAlign: "center" }}>Grade</div>
                          <div />
                        </div>
                        {addCourses.map(c => (
                          <div className="course-row" key={c.id}>
                            <input className="ci" placeholder="e.g. MATH 201" value={c.name} onChange={e => updateCourse(c.id, "name", e.target.value)} />
                            <input className="ci" type="number" placeholder="3" min="1" max="6" value={c.credit} onChange={e => updateCourse(c.id, "credit", e.target.value)} />
                            <select className="ci sel" value={c.grade} onChange={e => updateCourse(c.id, "grade", e.target.value)}>
                              <option value="">—</option>
                              {GRADE_SCALE.map(g => <option key={g.label} value={g.label}>{g.label} ({g.point.toFixed(1)})</option>)}
                            </select>
                            <button className="btn-delete" onClick={() => removeCourseRow(c.id)}>✕</button>
                          </div>
                        ))}
                        <button className="btn-sm-icon" onClick={addCourseRow} style={{ marginTop: 6 }}>+ Add course</button>
                        <div className="form-btns">
                          <button className="btn-sm ghost" onClick={() => { setShowAddForm(false); setFormError(""); }}>Cancel</button>
                          <button className="btn-sm primary" onClick={handleAddSemester}>Save Semester</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="right-col">
                <TargetGPA currentCGPA={cgpa} totalCreditsEarned={totalCredits} />
                <GradeReference />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
