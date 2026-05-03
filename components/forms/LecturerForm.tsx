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
import { lecturerSchema, LecturerSchema } from "@/lib/formValidationsSchemas";
import { createLecturer, updateLecturer } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CustomSelect from "../CustomSelect";
import { X } from "lucide-react";

// ── SubjectPicker ─────────────────────────────────────────────────────────────
type SubjectOption = { id: number; code: string; name: string };

function SubjectPicker({
  subjects,
  selected,
  onChange,
  error,
}: {
  subjects: SubjectOption[];
  selected: number[];
  onChange: (next: number[]) => void;
  error?: string;
}) {
  function toggle(id: number) {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    );
  }

  function clearAll() {
    onChange([]);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-500">Subjects</label>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1 text-[11px] font-medium text-rose-400 hover:text-rose-600 transition-colors"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          )}
          <span className="text-[11px] font-medium text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full">
            {selected.length} selected
          </span>
        </div>
      </div>

      {subjects.length === 0 ? (
        <div className="flex items-center gap-2 rounded-lg ring-[1.5px] ring-gray-200 px-4 py-3 text-xs text-gray-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
          No subjects for this department
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 rounded-lg ring-[1.5px] ring-gray-200 p-3">
          {subjects.map((s) => {
            const isSelected = selected.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggle(s.id)}
                title={s.name}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-violet-400 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {isSelected && <X className="h-3 w-3 opacity-70" />}
                {s.code}
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ── LecturerForm ──────────────────────────────────────────────────────────────
const LecturerForm = ({
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
  } = useForm<LecturerSchema>({
    resolver: zodResolver(lecturerSchema),
  });

  const [state, action, pending] = useActionState(
    type === "create" ? createLecturer : updateLecturer,
    { success: false, error: false, message: "" },
  );

  const onSubmit = handleSubmit((data) => {
    startTransition(() => action(data));
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

  const { subjects, departments } = relatedData;

  const [depId, setDepId] = useState<number>(
    data?.departmentId || departments?.[0]?.id || 0,
  );

  const filteredSubjects: SubjectOption[] = subjects.filter(
    (s: { id: number; code: string; name: string; departmentId: number }) =>
      s.departmentId === depId,
  );

  const [sex, setSex] = useState<"MALE" | "FEMALE">(data?.sex || "MALE");
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>(
    data?.subjects?.map((s: { id: number }) => s.id) || [],
  );

  useEffect(() => {
    setValue("departmentId", depId);
    setValue("sex", sex);
  }, []);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 rounded-full bg-violet-400" />
        <h1 className="text-lg font-medium text-gray-800">
          {type === "create" ? "Create a new lecturer" : "Update lecturer"}
        </h1>
      </div>

      {/* Auth */}
      <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Authentication Information
        </span>
      </div>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField label="Username" name="username" defaultValue={data?.username} register={register} error={errors?.username} />
        <InputField label="Email" name="email" defaultValue={data?.email} register={register} error={errors?.email} />
        <InputField label="Password" name="password" type="password" defaultValue={data?.password} register={register} error={errors?.password} />
      </div>

      {/* Personal */}
      <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Personal Information
        </span>
      </div>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Title</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("title")}
            defaultValue={data?.title}
          >
            <option value="Prof">Prof</option>
            <option value="Dr">Dr</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
          </select>
          {errors.title?.message && (
            <p className="text-xs text-red-400">{errors.title.message.toString()}</p>
          )}
        </div>
        <InputField label="First Name" name="name" defaultValue={data?.name} register={register} error={errors.name} />
        <InputField label="Last Name" name="surname" defaultValue={data?.surname} register={register} error={errors.surname} />
        <InputField label="Phone" name="phone" defaultValue={data?.phone} register={register} error={errors.phone} />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <CustomSelect
            label="Sex"
            options={[
              { value: "MALE", label: "Male" },
              { value: "FEMALE", label: "Female" },
            ]}
            value={sex}
            onChange={(val) => {
              setSex(val as "MALE" | "FEMALE");
              setValue("sex", val as "MALE" | "FEMALE", { shouldValidate: true });
            }}
            error={errors.sex?.message?.toString()}
          />
        </div>

        <div className="flex flex-col gap-1.5 w-full min-w-0">
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
              setSelectedSubjects([]);
              setValue("subjects", undefined, { shouldValidate: true });
            }}
            error={errors.departmentId?.message?.toString()}
          />
        </div>
      </div>

      {/* Subjects — tag pill picker, no fixed height */}
      <SubjectPicker
        subjects={filteredSubjects}
        selected={selectedSubjects}
        onChange={(next) => {
          setSelectedSubjects(next);
          setValue("subjects", next.length > 0 ? next : undefined, { shouldValidate: true });
        }}
        error={errors.subjects?.message?.toString()}
      />

      {data && <input type="hidden" value={data.id} {...register("id")} />}
      {state.error && <span className="text-red-400">{state.message}</span>}

      <button
        disabled={pending}
        className="w-full bg-violet-400 hover:bg-violet-500 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition cursor-pointer"
      >
        {pending ? "Saving..." : type === "create" ? "Create Lecturer" : "Update Lecturer"}
      </button>
    </form>
  );
};

export default LecturerForm;