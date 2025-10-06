import { prisma } from "@/lib/prisma";
import FormModal from "./FormModal";

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
      case "lecture_room":
        const halls = await prisma.hall.findMany({
          select: {
            id: true,
            name: true,
          },
        });
        relatedDate = { buildings: halls };
        break;
      case "lecturer":
        const lecturerSubjects = await prisma.subject.findMany({
          select: {
            id: true,
            code: true,
            departmentId: true,
          },
        });
        const departments = await prisma.department.findMany({
          select: {
            id: true,
            name: true,
          },
        });
        relatedDate = {
          subjects: lecturerSubjects,
          departments: departments,
        };
        break;
      case "student":
        const studentSubjects = await prisma.subject.findMany({
          select: {
            id: true,
            code: true,
            departmentId: true,
          },
        });
        const studentDepartments = await prisma.department.findMany({
          select: {
            id: true,
            name: true,
          },
        });
        relatedDate = {
          subjects: studentSubjects,
          departments: studentDepartments,
        };
        break;
      case "subject":
        const subjectDepartments = await prisma.department.findMany({
          select: {
            id: true,
            name: true,
          },
        });

        relatedDate = {
          departments: subjectDepartments,
        };
        break;
      case "reservation":
        const reservationSubjects = await prisma.subject.findMany({
          select: {
            id: true,
            code: true,
            departmentId: true,
          },
        });
        const lecRooms = await prisma.lectureRoom.findMany({
          select: {
            id: true,
            name: true,
          },
        });
        const lectures = await prisma.lecturer.findMany({
          select: {
            id: true,
            name: true,
            departmentId: true,
          },
        });
        const reservationDepartments = await prisma.department.findMany({
          select: {
            id: true,
            name: true,
          },
        });
        relatedDate = {
          subjects: reservationSubjects,
          lecRooms: lecRooms,
          lectures: lectures,
          departments: reservationDepartments,
        };
        break;
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
