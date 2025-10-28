"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { removeSubject } from "@/lib/actions";
import { SubjectFormContainerProps } from "./SubjectFormContainer";

const SelectSubjectForm = dynamic(() => import("./forms/SelectSubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});

const SubjectFormModal = ({
  type,
  data,
  id,
  userId,
  relatedData,
}: SubjectFormContainerProps & { relatedData?: any }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const Form = () => {
    const [state, action, pending] = useActionState(removeSubject, {
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
    }, [state, router]);

    return type === "remove" && id ? (
      <form action={action} className="p-4 flex flex-col gap-4">
        <input type="hidden" name="id" defaultValue={id} />
        <input type="hidden" name="userId" defaultValue={userId} />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to remove this subject?
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
          {pending ? "Removing..." : "Remove"}
        </button>
      </form>
    ) : type === "select" ? (
      <SelectSubjectForm
        type="select"
        data={data}
        id={id}
        userId={userId!}
        setOpen={setOpen}
        relatedData={relatedData}
      />
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#CFCEFF] cursor-pointer"
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

export default SubjectFormModal;
