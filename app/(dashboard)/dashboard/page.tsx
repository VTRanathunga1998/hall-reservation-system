import prisma from "@/lib/prisma";
import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  DoorOpen,
} from "lucide-react";

/* ---------------- STATS ---------------- */
async function getStats() {
  const students = await prisma.student.count();
  const lecturers = await prisma.lecturer.count();
  const departments = await prisma.department.count();
  const subjects = await prisma.subject.count();
  const lectureRooms = await prisma.lectureRoom.count();

  return { students, lecturers, departments, subjects, lectureRooms };
}

/* ---------------- RECENT ---------------- */
async function getRecentActivity() {
  const recentStudents = await prisma.student.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { department: { select: { name: true } } },
  });

  const recentLecturers = await prisma.lecturer.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { department: { select: { name: true } } },
  });

  return { recentStudents, recentLecturers };
}

/* ---------------- DEPARTMENTS ---------------- */
async function getDepartmentBreakdown() {
  return prisma.department.findMany({
    include: {
      _count: {
        select: {
          students: true,
          lecturers: true,
          subjects: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });
}

/* ---------------- CARD ---------------- */
function StatCard({ title, value, icon, accent, border, description }: any) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${border} bg-white p-6 hover:shadow-sm transition`}
    >
      <div
        className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 ${accent}`}
      />

      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-4xl font-black text-slate-800">
            {value.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent} bg-opacity-15 text-slate-700`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
export default async function Page() {
  const stats = await getStats();
  const { recentStudents, recentLecturers } = await getRecentActivity();
  const departments = await getDepartmentBreakdown();

  const statCards = [
    {
      title: "Total Students",
      value: stats.students,
      icon: <GraduationCap className="h-5 w-5" />,
      accent: "bg-violet-500",
      border: "border-slate-200",
      description: "Enrolled across all departments",
    },
    {
      title: "Lecturers",
      value: stats.lecturers,
      icon: <Users className="h-5 w-5" />,
      accent: "bg-sky-500",
      border: "border-slate-200",
      description: "Active faculty members",
    },
    {
      title: "Departments",
      value: stats.departments,
      icon: <Building2 className="h-5 w-5" />,
      accent: "bg-emerald-500",
      border: "border-slate-200",
      description: "Academic departments",
    },
    {
      title: "Subjects",
      value: stats.subjects,
      icon: <BookOpen className="h-5 w-5" />,
      accent: "bg-amber-500",
      border: "border-slate-200",
      description: "Offered this semester",
    },
    {
      title: "Lecture Rooms",
      value: stats.lectureRooms,
      icon: <DoorOpen className="h-5 w-5" />,
      accent: "bg-rose-500",
      border: "border-slate-200",
      description: "Available classrooms",
    },
  ];

  const yearSemLabels: Record<number, string> = {
    11: "Year 1 — Sem 1",
    12: "Year 1 — Sem 2",
    21: "Year 2 — Sem 1",
    22: "Year 2 — Sem 2",
    31: "Year 3 — Sem 1",
    32: "Year 3 — Sem 2",
    41: "Year 4 — Sem 1",
    42: "Year 4 — Sem 2",
  };

  return (
    <div className="min-h-screen bg-white rounded-md p-4 m-2 md:p-8">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 md:text-3xl">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500">
            A snapshot of your institution's current state.
          </p>
        </div>

        {/* Stats */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
            At a Glance
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((card) => (
              <StatCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        {/* Department Table */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Department Breakdown
          </h2>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-white">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                    Department
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500">
                    Students
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500">
                    Lecturers
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500">
                    Subjects
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500">
                    Share
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {departments.map((dept) => {
                  const share =
                    stats.students > 0
                      ? Math.round(
                          (dept._count.students / stats.students) * 100,
                        )
                      : 0;

                  return (
                    <tr key={dept.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {dept.name}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600">
                        {dept._count.students}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600">
                        {dept._count.lecturers}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600">
                        {dept._count.subjects}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <div className="h-1.5 w-20 bg-slate-100 rounded-full">
                            <div
                              className="h-full bg-violet-500 rounded-full"
                              style={{ width: `${share}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500">
                            {share}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Recent Students */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">
                Recently Added Students
              </h2>
              <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-600">
                Last 5
              </span>
            </div>

            <ul className="divide-y">
              {recentStudents.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600 uppercase">
                    {s.name[0]}
                    {s.surname[0]}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {s.name} {s.surname}
                    </p>
                    <p className="text-xs text-slate-400">
                      {s.department.name}
                    </p>
                  </div>

                  <time className="text-xs text-slate-400">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </time>
                </li>
              ))}

              {recentStudents.length === 0 && (
                <li className="px-6 py-6 text-center text-sm text-slate-400">
                  No students yet
                </li>
              )}
            </ul>
          </div>

          {/* Recent Lecturers */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">
                Recently Added Lecturers
              </h2>
              <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-600">
                Last 5
              </span>
            </div>

            <ul className="divide-y">
              {recentLecturers.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-600 uppercase">
                    {l.name[0]}
                    {l.surname[0]}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {l.title} {l.name} {l.surname}
                    </p>
                    <p className="text-xs text-slate-400">
                      {l.department.name}
                    </p>
                  </div>

                  <time className="text-xs text-slate-400">
                    {new Date(l.createdAt).toLocaleDateString()}
                  </time>
                </li>
              ))}

              {recentLecturers.length === 0 && (
                <li className="px-6 py-6 text-center text-sm text-slate-400">
                  No lecturers yet
                </li>
              )}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
