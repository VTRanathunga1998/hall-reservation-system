"use client";

import React, { useMemo, useState } from "react";

type Subject = {
  id: number | string;
  code: string;
  name: string;
  credit: number;
};

const GRADE_SCALE: { [label: string]: number } = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  E: 0.0,
};

function parseYearSemesterFromCode(code: string): {
  year: number | null;
  semester: number | null;
} {
  // Find numeric part anywhere in the code (e.g., "ECO 111", "STC325", "ABC 212")
  const m = code.match(/(\d+)/);
  if (!m) return { year: null, semester: null };
  const nums = m[1]; // e.g. "111", "325", "212"
  if (nums.length < 2) return { year: null, semester: null };
  const year = parseInt(nums.charAt(0), 10);
  const semester = parseInt(nums.charAt(1), 10);
  if (Number.isNaN(year) || Number.isNaN(semester))
    return { year: null, semester: null };
  return { year, semester };
}

export default function StudentGpaCalculator({
  subjects,
}: {
  subjects: Subject[];
}) {
  // gradeSelections keyed by subject.id
  const [gradeSelections, setGradeSelections] = useState<
    Record<string, string>
  >({});
  const [calculated, setCalculated] = useState<{
    yearGPA: Record<number, number | null>;
    finalGPA: number | null;
  } | null>(null);

  // Group subjects by year -> semester -> [subjects]
  const grouped = useMemo(() => {
    const map: Record<number, Record<number, Subject[]>> = {};

    for (const s of subjects) {
      const { year, semester } = parseYearSemesterFromCode(s.code);
      if (!year || !semester) continue; // skip badly formatted codes
      if (!map[year]) map[year] = {};
      if (!map[year][semester]) map[year][semester] = [];
      map[year][semester].push(s);
    }

    // Sort subjects within each semester by code for deterministic UI
    for (const y of Object.keys(map)) {
      for (const sem of Object.keys(map[Number(y)])) {
        map[Number(y)][Number(sem)].sort((a, b) =>
          a.code.localeCompare(b.code)
        );
      }
    }

    return map;
  }, [subjects]);

  const yearsSorted = useMemo(
    () =>
      Object.keys(grouped)
        .map(Number)
        .sort((a, b) => a - b),
    [grouped]
  );

  const handleSelectGrade = (
    subjectId: number | string,
    gradeLabel: string
  ) => {
    setGradeSelections((prev) => ({
      ...prev,
      [String(subjectId)]: gradeLabel,
    }));
  };

  const handleReset = () => {
    setGradeSelections({});
    setCalculated(null);
  };

  const handleCalculate = () => {
    const yearResults: Record<
      number,
      { totalPoints: number; totalCredits: number }
    > = {};

    for (const yearStr of Object.keys(grouped)) {
      const year = Number(yearStr);
      let totalPoints = 0;
      let totalCredits = 0;

      const sems = grouped[year];
      for (const semStr of Object.keys(sems)) {
        const sem = Number(semStr);
        for (const subj of sems[sem]) {
          const sel = gradeSelections[String(subj.id)];
          if (!sel) continue; // grade not selected -> skip
          const gp = GRADE_SCALE[sel];
          if (gp === undefined) continue;
          totalPoints += gp * subj.credit;
          totalCredits += subj.credit;
        }
      }

      yearResults[year] = { totalPoints, totalCredits };
    }

    const yearGPA: Record<number, number | null> = {};
    for (const [yearStr, data] of Object.entries(yearResults)) {
      const year = Number(yearStr);
      yearGPA[year] =
        data.totalCredits > 0 ? data.totalPoints / data.totalCredits : null;
    }

    // Final GPA: average of year GPAs that are not null
    const validYearGPAs = Object.values(yearGPA).filter(
      (g): g is number => g !== null
    );
    const finalGPA = validYearGPAs.length
      ? validYearGPAs.reduce((a, b) => a + b, 0) / validYearGPAs.length
      : null;

    setCalculated({ yearGPA, finalGPA });
    // you could also POST gradeSelections to server here to persist
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold">GPA Calculator</h2>
        <p className="text-sm text-gray-600 mt-1">
          Select the grade for each subject
        </p>
      </div>

      {yearsSorted.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center">
          No subjects found or subject codes are invalid.
        </div>
      ) : (
        yearsSorted.map((year) => (
          <div key={year} className="space-y-4">
            <div className="text-lg font-bold">Year {year}</div>

            {Object.keys(grouped[year])
              .map(Number)
              .sort((a, b) => a - b)
              .map((sem) => {
                const semSubjects = grouped[year][sem] || [];
                return (
                  <div
                    key={sem}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b flex items-center justify-between">
                      <div className="font-medium">Semester {sem}</div>
                      <div className="text-sm text-gray-500">
                        {semSubjects.length} subject
                        {semSubjects.length !== 1 ? "s" : ""}
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      {semSubjects.map((sub) => (
                        <div
                          key={sub.id}
                          className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center border-b pb-3"
                        >
                          <div className="md:col-span-6">
                            <div className="font-medium">
                              {sub.code} — {sub.name}
                            </div>
                          </div>
                          <div className="md:col-span-2 text-sm text-gray-600">
                            Credit: {sub.credit}
                          </div>
                          <div className="md:col-span-4 flex justify-end">
                            <select
                              className="border rounded px-2 py-1"
                              value={gradeSelections[String(sub.id)] ?? ""}
                              onChange={(e) =>
                                handleSelectGrade(sub.id, e.target.value)
                              }
                            >
                              <option value="">Select grade</option>
                              {Object.keys(GRADE_SCALE).map((lbl) => (
                                <option key={lbl} value={lbl}>
                                  {lbl}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                      <div className="text-sm font-medium">
                        Year {year} Semester {sem} summary
                      </div>
                      <div className="text-sm text-gray-700">
                        {/* compute semester subtotal on the fly */}
                        {(() => {
                          const semSubs = semSubjects;
                          let pts = 0;
                          let creds = 0;
                          for (const s of semSubs) {
                            const g = gradeSelections[String(s.id)];
                            if (!g) continue;
                            const gp = GRADE_SCALE[g];
                            if (gp === undefined) continue;
                            pts += gp * s.credit;
                            creds += s.credit;
                          }
                          return creds > 0
                            ? `GPA: ${(pts / creds).toFixed(2)}`
                            : "GPA: —";
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ))
      )}

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={handleCalculate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Calculate GPA
          </button>
          <button
            onClick={handleReset}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            Reset
          </button>
        </div>

        <div className="bg-white p-4 rounded shadow text-right min-w-[220px]">
          <div className="text-sm text-gray-500">Final GPA</div>
          <div className="text-2xl font-bold text-green-600">
            {calculated?.finalGPA != null
              ? calculated.finalGPA.toFixed(2)
              : "—"}
          </div>
          <div className="text-xs text-gray-400 mt-1">Average of year GPAs</div>
        </div>
      </div>

      {/* legend */}
      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold mb-2">Grade Scale</h4>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
          {Object.entries(GRADE_SCALE).map(([lbl, gp]) => (
            <div key={lbl} className="flex items-center gap-2">
              <div className="font-semibold">{lbl}</div>
              <div className="text-gray-600">GP {gp.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
