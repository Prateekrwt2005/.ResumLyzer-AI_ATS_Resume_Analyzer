const checks = [
  { text: "Clear formatting, readable by ATS", ok: true },
  { text: "Keywords relevant to the job", ok: true },
  { text: "Skills section detected", ok: false },
];
export default function ATSChecklist() {
  const checks = [
    "Clear section headings",
    "Consistent formatting",
    "Relevant keywords included",
    "No images or tables",
    "Simple fonts used",
    "Achievements quantified",
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">
        ATS Checklist
      </h3>

      <ul className="space-y-2">
        {checks.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-slate-700"
          >
            <span className="text-green-600">✔</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
