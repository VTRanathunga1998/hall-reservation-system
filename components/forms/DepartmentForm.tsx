"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  departmentSchema,
  DepartmentSchema,
} from "@/lib/formValidationsSchemas";
import { createDepartment, updateDepartment } from "@/lib/actions";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const DepartmentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentSchema>({
    resolver: zodResolver(departmentSchema),
  });

  const [state, action, pending] = useActionState(
    type === "create" ? createDepartment : updateDepartment,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  const onSubmit = handleSubmit((data) => {
    startTransition(() => {
      action(data);
    });
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

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new department" : "Update the department"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Department Name</label>
          <input
            type="text"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.name}
            {...register("name")}
          />
          {errors.name?.message && (
            <p className="text-xs text-red-400">
              {errors.name.message.toString()}
            </p>
          )}
        </div>
        {data && (
          <input
            type="hidden"
            value={data.id}
            {...register("id", { valueAsNumber: true })}
          />
        )}
      </div>
      {state.error && <span className="text-red-400">{state.message}</span>}

      <button
        disabled={pending}
        className="bg-blue-400 text-white p-2 rounded-md cursor-pointer"
      >
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default DepartmentForm;
