"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { subjectSchema, SubjectSchema } from "@/lib/formValidationsSchemas";
import { createSubject, updateSubject } from "@/lib/actions";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CustomSelect from "../CustomSelect";

const SubjectForm = ({
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
    setValue,
    formState: { errors },
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
  });

  const [state, action, pending] = useActionState(
    type === "create" ? createSubject : updateSubject,
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

  const { departments } = relatedData;

  const [departmentId, setDepartmentId] = useState<number>(
    data?.departmentId || departments?.[0]?.id || 0,
  );

  useEffect(() => {
    setValue("departmentId", data?.departmentId || departments?.[0]?.id || 0, {
      shouldValidate: true,
    });
  }, []);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 rounded-full bg-emerald-400" />
        <h1 className="text-lg font-medium text-gray-800">
          {type === "create" ? "Create a new subject" : "Update subject"}
        </h1>
      </div>

      <div className="border-t border-gray-100" />

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Subject Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <CustomSelect
          label="Department"
          options={departments.map((d: { id: number; name: string }) => ({
            value: d.id,
            label: d.name,
          }))}
          value={departmentId}
          onChange={(val) => {
            setDepartmentId(val as number);
            setValue("departmentId", val as number, { shouldValidate: true });
          }}
          error={errors.departmentId?.message?.toString()}
        />
        <InputField
          label="Subject Code"
          name="code"
          defaultValue={data?.code}
          register={register}
          error={errors?.code}
        />
        <InputField
          label="Credit"
          name="credit"
          defaultValue={data?.credit}
          register={register}
          registerOptions={{ valueAsNumber: true }}
          error={errors?.credit}
        />
        {data && (
          <input
            type="hidden"
            value={data.id}
            {...register("id", { valueAsNumber: true })}
          />
        )}
      </div>
      {state.error && (
        <span className="text-xs text-red-400">{state.message}</span>
      )}

      <button
        disabled={pending}
        className="w-full bg-emerald-400 hover:bg-emerald-500 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition cursor-pointer"
      >
        {pending
          ? "Saving…"
          : type === "create"
            ? "Create Subject"
            : "Update Subject"}
      </button>
    </form>
  );
};

export default SubjectForm;
