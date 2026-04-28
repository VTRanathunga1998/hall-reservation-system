import { prisma } from "@/lib/prisma";
import FormModal from "./FormModal";

export type FormContainerProps = {
  table:
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
  let relatedData = {};

  if (type !== "delete") {
    switch (table) {
      case "lecture_room": {
        relatedData = {};
        break;
      }

      // Lecturer
      case "lecturer": {
        const lecturerSubjects = await prisma.subject.findMany({
          select: { id: true, code: true, departmentId: true },
        });

        const departments = await prisma.department.findMany({
          select: { id: true, name: true },
        });

        relatedData = {
          subjects: lecturerSubjects,
          departments,
        };
        break;
      }

      // Student
      case "student": {
        const studentSubjects = await prisma.subject.findMany({
          select: { id: true, code: true, departmentId: true },
        });

        const studentDepartments = await prisma.department.findMany({
          select: { id: true, name: true },
        });

        const academicYears = await prisma.academicYear.findMany({
          select: { id: true, name: true },
        });

        relatedData = {
          subjects: studentSubjects,
          departments: studentDepartments,
          academicYears,
        };
        break;
      }

      // Subject
      case "subject": {
        const subjectDepartments = await prisma.department.findMany({
          select: { id: true, name: true },
        });

        relatedData = { departments: subjectDepartments };
        break;
      }

      //Reservation
      case "reservation": {
        const reservationSubjects = await prisma.subject.findMany({
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

        const lecRooms = await prisma.lectureRoom.findMany({
          select: { id: true, name: true },
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

        relatedData = {
          subjects: reservationSubjects,
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
      relatedData={relatedData}
    />
  );
};

export default FormContainer;
