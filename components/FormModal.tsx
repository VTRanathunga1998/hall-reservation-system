"use client";

import {
  deleteLecturer,
  deleteReservation,
  deleteSubject,
} from "@/lib/actions";
import { deleteLectureRoom } from "@/lib/lecture_rooms/actions";
import { deleteStudent } from "@/lib/students/actions";
import { deleteDepartment } from "@/lib/departments/actions";
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
    relatedData?: any,
  ) => ReactNode;
} = {
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
      <form action={action} className="flex flex-col items-center gap-6 p-2">
        <input type="hidden" name="id" defaultValue={id} />

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center shrink-0">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <h2 className="text-base font-semibold text-gray-800">
            Delete {table}?
          </h2>
          <p className="text-sm text-gray-500 max-w-xs">
            This action cannot be undone. All data associated with this{" "}
            <span className="font-medium text-gray-700">{table}</span> will be
            permanently removed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 py-2.5 rounded-lg ring-[1.5px] ring-gray-200 text-sm font-medium text-gray-600 hover:ring-gray-300 hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium transition cursor-pointer"
          >
            {pending ? "Deleting…" : "Yes, delete"}
          </button>
        </div>
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
        <div
          id="datepicker-portal"
          className="fixed inset-0 bg-black/60 z-[150] flex items-center justify-center"
        >
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[50%] max-h-[90vh] overflow-y-auto scrollbar-hidden">
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
