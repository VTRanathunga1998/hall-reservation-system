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
