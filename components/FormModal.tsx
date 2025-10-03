"use client";

import { deleteBuilding } from "@/lib/actions";
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

const deleteActionMap = {
  building: deleteBuilding,
  subject: deleteBuilding,
  lecturer: deleteBuilding,
  reservation: deleteBuilding,
  student: deleteBuilding,
  lecture_room: deleteBuilding,
  department: deleteBuilding,
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

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any
  ) => ReactNode;
} = {
  building: (setOpen, type, data) => (
    <BuildingForm type={type} data={data} setOpen={setOpen} />
  ),
  lecturer: (setOpen, type, data) => (
    <LecturerForm type={type} data={data} setOpen={setOpen} />
  ),
  student: (setOpen, type, data) => (
    <StudentForm type={type} data={data} setOpen={setOpen} />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
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
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-[#FAE27C]"
      : type === "update"
      ? "bg-[#C3EBFA]"
      : "bg-[#CFCEFF]";

  const [open, setOpen] = useState(false);

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
      }
    }, [state, router, setOpen]);

    return type === "delete" && id ? (
      <form action={action} className="p-4 flex flex-col gap-4">
        <input type="hidden" name="id" defaultValue={id} />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center cursor-pointer">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](setOpen, type, data)
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
        <div className="w-screen h-screen absolute left-0 top-0 bg-black/60 z-[150] flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer "
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
