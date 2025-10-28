// app/student/gpa/page.tsx
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";
import { auth } from "@clerk/nextjs/server";
import StudentGpaCalculator from "@/components/StudentGpaCalculator";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="p-8">
        <EmptyState
          title="Not signed in"
          description="Please sign in to view GPA."
          imageSrc="/no-data.gif"
        />
      </div>
    );
  }

  // Fetch subjects that the student is enrolled in
  const studentSubjects = await prisma.subject.findMany({
    where: {
      students: {
        some: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      code: true,
      name: true,
      credit: true,
    },
    orderBy: {
      code: "asc",
    },
  });

  return (
    <div className="p-4 md:p-8">
      <StudentGpaCalculator subjects={studentSubjects} />
    </div>
  );
}
