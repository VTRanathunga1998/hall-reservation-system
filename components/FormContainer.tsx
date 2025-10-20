import { prisma } from "@/lib/prisma";
import FormModal from "./FormModal";

// Department short codes
const departmentsShortCode = [
  { id: 1, short: "DES" }, // Department of Economics & Statistics
  { id: 2, short: "DELT" }, // Department of English Language Teaching
  { id: 3, short: "DGM" }, // Department of Geography & Environmental Management
  { id: 4, short: "DIT" }, // Department of Information Technology
  { id: 5, short: "DL" }, // Department of Languages
  { id: 6, short: "DSS" }, // Department of Social Sciences
];

// Utility to clean subject codes (remove short code prefix)
function cleanSubjectCodes(subjects: any[], departmentsShortCode: any[]) {
  return subjects.map((subject) => {
    const dept = departmentsShortCode.find(
      (d) => d.id === subject.departmentId
    );
    if (!dept) return subject;

    const short = dept.short;
    const regex = new RegExp(`^${short}[-\\s]+`, "i");
    const newCode = subject.code.replace(regex, "").trim();

    return { ...subject, code: newCode };
  });
}

export type FormContainerProps = {
  table:
    | "building"
    | "student"
    | "lecture_room"
    | "department"
    | "lecturer"
    | "reservation"
    | "subject";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedDate = {};

  if (type !== "delete") {
    switch (table) {
      // Lecture Room
      case "lecture_room": {
        const halls = await prisma.hall.findMany({
          select: { id: true, name: true },
        });
        relatedDate = { buildings: halls };
        break;
      }

      // Lecturer
      case "lecturer": {
        let lecturerSubjects = await prisma.subject.findMany({
          select: { id: true, code: true, departmentId: true },
        });

        // Clean subject codes
        lecturerSubjects = cleanSubjectCodes(
          lecturerSubjects,
          departmentsShortCode
        );

        const departments = await prisma.department.findMany({
          select: { id: true, name: true },
        });

        relatedDate = {
          subjects: lecturerSubjects,
          departments,
        };
        break;
      }

      // Student
      case "student": {
        let studentSubjects = await prisma.subject.findMany({
          select: { id: true, code: true, departmentId: true },
        });

        // Clean subject codes
        studentSubjects = cleanSubjectCodes(
          studentSubjects,
          departmentsShortCode
        );

        const studentDepartments = await prisma.department.findMany({
          select: { id: true, name: true },
        });

        relatedDate = {
          subjects: studentSubjects,
          departments: studentDepartments,
        };
        break;
      }

      // Subject
      case "subject": {
        const subjectDepartments = await prisma.department.findMany({
          select: { id: true, name: true },
        });
        relatedDate = { departments: subjectDepartments };
        break;
      }

      // Reservation
      case "reservation": {
        let reservationSubjects = await prisma.subject.findMany({
          select: {
            id: true,
            code: true,
            departmentId: true,
            lecturers: {
              select: {
                id: true,
                name: true,
                departmentId: true,
              },
            },
          },
        });

        // Clean subject codes
        reservationSubjects = cleanSubjectCodes(
          reservationSubjects,
          departmentsShortCode
        );

        const lecRooms = await prisma.lectureRoom.findMany({
          select: { id: true, name: true, hallId: true },
        });

        const lectures = await prisma.lecturer.findMany({
          select: {
            id: true,
            name: true,
            surname: true,
            departmentId: true,
          },
        });

        const reservationDepartments = await prisma.department.findMany({
          select: { id: true, name: true },
        });

        const lecHalls = await prisma.hall.findMany({
          select: { id: true, name: true },
        });

        relatedDate = {
          subjects: reservationSubjects,
          lecHalls,
          lecRooms,
          lectures,
          departments: reservationDepartments,
        };
        break;
      }
    }
  }

  return (
    <FormModal
      table={table}
      type={type}
      data={data}
      id={id}
      relatedData={relatedDate}
    />
  );
};

export default FormContainer;
