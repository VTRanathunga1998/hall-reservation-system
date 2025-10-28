import { prisma } from "@/lib/prisma";
import SubjectFormModal from "./SubjectFormModal";

export type SubjectFormContainerProps = {
  type: "select" | "remove";
  data?: any;
  id?: number;
  userId?: string;
};

const SubjectFormContainer = async ({
  type,
  data,
  id,
  userId,
}: SubjectFormContainerProps) => {
  let relatedDate = {};

  if (type === "select") {
    const subjects = await prisma.subject.findMany({
      select: { id: true, code: true, name: true },
    });
    relatedDate = { subjects: subjects };
  }

  return (
    <SubjectFormModal
      type={type}
      data={data}
      id={id}
      userId={userId}
      relatedData={relatedDate}
    />
  );
};

export default SubjectFormContainer;
