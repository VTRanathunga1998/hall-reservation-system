import EmailComposer from "@/components/email/EmailComposer";
import { getRecipients } from "@/lib/emails/actions";

import { Mail } from "lucide-react";

export default async function EmailPage() {
  const recipients = await getRecipients();

  const studentCount = recipients.filter((r) => r.type === "student").length;
  const lecturerCount = recipients.filter((r) => r.type === "lecturer").length;

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 m-4 rounded-lg">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            Send Email
          </h1>
          <p className="text-sm text-slate-500">
            Send to individual users, filtered groups, or everyone at once.
          </p>
        </div>

        {/* Quick stats */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5">
            <Mail className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-800">
              {recipients.length}
            </span>
            <span className="text-sm text-slate-500">total with email</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-2.5">
            <span className="text-sm font-semibold text-violet-700">
              {studentCount}
            </span>
            <span className="text-sm text-violet-500">students</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-2.5">
            <span className="text-sm font-semibold text-sky-700">
              {lecturerCount}
            </span>
            <span className="text-sm text-sky-500">lecturers</span>
          </div>
        </div>

        {/* Composer */}
        <EmailComposer recipients={recipients} />
      </div>
    </div>
  );
}
