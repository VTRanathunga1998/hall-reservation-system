"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { studentSchema, StudentSchema } from "@/lib/formValidationsSchemas";
import { createStudent, updateStudent } from "@/lib/students/actions";

const YEAR_SEM_OPTIONS = [
  { value: 11, label: "Year 1 — Sem 1" },
  { value: 12, label: "Year 1 — Sem 2" },
  { value: 21, label: "Year 2 — Sem 1" },
  { value: 22, label: "Year 2 — Sem 2" },
  { value: 31, label: "Year 3 — Sem 1" },
  { value: 32, label: "Year 3 — Sem 2" },
  { value: 41, label: "Year 4 — Sem 1" },
  { value: 42, label: "Year 4 — Sem 2" },
];

const StudentForm = ({
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
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      academicYearId: data?.academicYearId || undefined,
      yearSem: data?.yearSem || 11,
    },
  });

  const [state, action, pending] = useActionState(
    type === "create" ? createStudent : updateStudent,
    { success: false, error: false, message: "" },
  );

  const onSubmit = handleSubmit((formData) => {
    startTransition(() => action(formData));
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

  const { subjects, departments, academicYears } = relatedData;

  // Track selected department to filter subjects
  const [depId, setDepId] = useState<number>(
    data?.departmentId || departments?.[0]?.id || 0,
  );

  const filteredSubjects = subjects.filter(
    (s: { id: number; code: string; departmentId: number }) =>
      s.departmentId === depId,
  );

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new student" : "Update the student"}
      </h1>

      {/* ── Authentication ── */}
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>

      {/* ── Personal Information ── */}
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />

        {/* Sex */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>

        {/* Department */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Department</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("departmentId", { valueAsNumber: true })}
            value={depId}
            onChange={(e) => {
              const val = Number(e.target.value);
              setDepId(val);
              setValue("departmentId", val, { shouldValidate: true });
            }}
          >
            {departments.map((d: { id: number; name: string }) => (
              <option value={d.id} key={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {errors.departmentId?.message && (
            <p className="text-xs text-red-400">
              {errors.departmentId.message.toString()}
            </p>
          )}
        </div>

        {/* Academic Year */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Academic Year</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("academicYearId", { valueAsNumber: true })}
            defaultValue={data?.academicYearId || academicYears?.[0]?.id}
          >
            {academicYears.map((y: { id: number; name: string }) => (
              <option value={y.id} key={y.id}>
                {y.name}
              </option>
            ))}
          </select>
          {errors.academicYearId?.message && (
            <p className="text-xs text-red-400">
              {errors.academicYearId.message.toString()}
            </p>
          )}
        </div>

        {/* Year / Semester */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Year / Semester</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("yearSem", { valueAsNumber: true })}
            defaultValue={data?.yearSem || 11}
          >
            {YEAR_SEM_OPTIONS.map((o) => (
              <option value={o.value} key={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errors.yearSem?.message && (
            <p className="text-xs text-red-400">
              {errors.yearSem.message.toString()}
            </p>
          )}
        </div>

        {/* Subjects (filtered by selected department) */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subjects</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (option) =>
                Number(option.value),
              );
              setValue("subjects", selected.length > 0 ? selected : undefined, {
                shouldValidate: true,
              });
            }}
            defaultValue={data?.subjects?.map((s: { id: number }) =>
              s.id.toString(),
            )}
          >
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((s: { id: number; code: string }) => (
                <option value={s.id} key={s.id}>
                  {s.code}
                </option>
              ))
            ) : (
              <option disabled value="">
                No subjects for this department
              </option>
            )}
          </select>
          {errors.subjects?.message && (
            <p className="text-xs text-red-400">
              {errors.subjects.message.toString()}
            </p>
          )}
        </div>
      </div>

      {data && <input type="hidden" value={data.id} {...register("id")} />}
      {state.error && <span className="text-red-400">{state.message}</span>}

      <button
        disabled={pending}
        className="bg-blue-400 text-white p-2 rounded-md disabled:opacity-60"
      >
        {pending
          ? type === "create"
            ? "Creating…"
            : "Updating…"
          : type === "create"
            ? "Create"
            : "Update"}
      </button>
    </form>
  );
};

export default StudentForm;
