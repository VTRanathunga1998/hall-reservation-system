"use client";

import {
  deleteBuilding,
  deleteDepartment,
  deleteLecturer,
  deleteLectureRoom,
  deleteReservation,
  deleteStudent,
  deleteSubject,
} from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
} from "react";
import { ReactNode } from "react";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";

const deleteActionMap = {
  building: deleteBuilding,
  subject: deleteSubject,
  lecturer: deleteLecturer,
  reservation: deleteReservation,
  student: deleteStudent,
  lecture_room: deleteLectureRoom,
  department: deleteDepartment,
};

const LecturerForm = dynamic(() => import("./forms/LecturerForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const BuildingForm = dynamic(() => import("./forms/BuildingForm"), {
  loading: () => <h1>Loading...</h1>,
});
const LectureRoomForm = dynamic(() => import("./forms/LectureRoomForm"), {
  loading: () => <h1>Loading...</h1>,
});
const DepartmentForm = dynamic(() => import("./forms/DepartmentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ReservationForm = dynamic(() => import("./forms/ReservationForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => ReactNode;
} = {
  building: (setOpen, type, data, relatedData) => (
    <BuildingForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  lecturer: (setOpen, type, data, relatedData) => (
    <LecturerForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  student: (setOpen, type, data, relatedData) => (
    <StudentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  lecture_room: (setOpen, type, data, relatedData) => (
    <LectureRoomForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  department: (setOpen, type, data, relatedData) => (
    <DepartmentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  subject: (setOpen, type, data, relatedData) => (
    <SubjectForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  reservation: (setOpen, type, data, relatedData) => (
    <ReservationForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-[#FAE27C]"
      : type === "update"
      ? "bg-[#C3EBFA]"
      : "bg-[#CFCEFF]";

  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const Form = () => {
    const [state, action, pending] = useActionState(deleteActionMap[table], {
      success: false,
      error: false,
      message: "",
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(state.message);
        setOpen(false);
        router.refresh();
      } else if (state.error) {
        toast.error(state.message);
      }
    }, [state, router, setOpen]);

    return type === "delete" && id ? (
      <form action={action} className="p-4 flex flex-col gap-4">
        <input type="hidden" name="id" defaultValue={id} />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>

        <button
          type="submit"
          disabled={pending}
          className={`py-2 px-4 rounded-md border-none w-max self-center cursor-pointer text-white transition-all ${
            pending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-700 hover:bg-red-800"
          }`}
        >
          {pending ? "Deleting..." : "Delete"}
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](setOpen, type, data, relatedData)
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor} cursor-pointer`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" height={16} width={16} />
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-[150] flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90vh] overflow-y-auto scrollbar-hidden">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="close" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
