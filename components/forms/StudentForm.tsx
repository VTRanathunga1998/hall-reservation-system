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
import CustomSelect from "../CustomSelect";

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

  const [sex, setSex] = useState<"MALE" | "FEMALE">(data?.sex || "MALE");
  const [yearSem, setYearSem] = useState<number>(data?.yearSem || 11);
  const [academicYearId, setAcademicYearId] = useState<number>(
    data?.academicYearId || academicYears?.[0]?.id || 0,
  );

  useEffect(() => {
    setValue("departmentId", depId);
    setValue("sex", sex);
    setValue("yearSem", yearSem);
    setValue("academicYearId", academicYearId);
  }, []);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 rounded-full bg-emerald-400" />
        <h1 className="text-lg font-medium text-gray-800">
          {type === "create" ? "Create a new student" : "Update the student"}
        </h1>
      </div>

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
          <CustomSelect
            label="Sex"
            options={[
              { value: "MALE", label: "Male" },
              { value: "FEMALE", label: "Female" },
            ]}
            value={sex}
            onChange={(val) => {
              setSex(val as "MALE" | "FEMALE"); // ← cast here
              setValue("sex", val as "MALE" | "FEMALE", {
                shouldValidate: true,
              });
            }}
            error={errors.sex?.message?.toString()}
          />
        </div>

        {/* Academic Year */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <CustomSelect
            label="Academic Year"
            options={academicYears.map((y: { id: number; name: string }) => ({
              value: y.id,
              label: y.name,
            }))}
            value={academicYearId}
            onChange={(val) => {
              setAcademicYearId(val as number);
              setValue("academicYearId", val as number, {
                shouldValidate: true,
              });
            }}
            error={errors.academicYearId?.message?.toString()}
          />
        </div>

        {/* Year / Semester */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <CustomSelect
            label="Year / Semester"
            options={YEAR_SEM_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
            value={yearSem}
            onChange={(val) => {
              setYearSem(val as number);
              setValue("yearSem", val as number, { shouldValidate: true });
            }}
            error={errors.yearSem?.message?.toString()}
          />
        </div>

        {/* Department */}
        <div className="flex flex-col gap-2 w-full md:w-full">
          <CustomSelect
            label="Department"
            options={departments.map((d: { id: number; name: string }) => ({
              value: d.id,
              label: d.name,
            }))}
            value={depId}
            onChange={(val) => {
              setDepId(val as number);
              setValue("departmentId", val as number, { shouldValidate: true });
            }}
            error={errors.departmentId?.message?.toString()}
          />
        </div>

        {/* Subjects (filtered by selected department) */}
        <div className="flex flex-col gap-2 w-full md:w-full">
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
              filteredSubjects.map(
                (s: { id: number; name: string; code: string }) => (
                  <option value={s.id} key={s.id}>
                    {s.code} - {s.name}
                  </option>
                ),
              )
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
        className="w-full bg-emerald-400 hover:bg-emerald-500 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition cursor-pointer"
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
