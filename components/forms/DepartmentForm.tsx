"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  departmentSchema,
  DepartmentSchema,
} from "@/lib/formValidationsSchemas";
import { createDepartment, updateDepartment } from "@/lib/departments/actions";
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
    },
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
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 rounded-full bg-blue-400" />
        <h1 className="text-lg font-medium text-gray-800">
          {type === "create" ? "Create a new department" : "Update department"}
        </h1>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Department Name
        </label>
        <input
          type="text"
          className="ring-[1.5px] ring-gray-200 focus:ring-blue-300 p-2.5 rounded-lg text-sm w-full outline-none transition"
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
      {state.error && (
        <span className="text-xs text-red-400">{state.message}</span>
      )}

      <button
        disabled={pending}
        className="w-full bg-blue-400 hover:bg-blue-500 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition cursor-pointer"
      >
        {pending
          ? "Saving..."
          : type === "create"
            ? "Create Department"
            : "Update Department"}
      </button>
    </form>
  );
};

export default DepartmentForm;
