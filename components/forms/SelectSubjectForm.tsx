"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { selectSubject } from "@/lib/actions";
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
import {
  selectSubjectSchema,
  SelectSubjectSchema,
} from "@/lib/formValidationsSchemas";

interface Props {
  type: "select";
  data?: any;
  id?: number;
  userId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    subjects: { id: number; code: string; name: string }[];
  };
}

const SelectSubjectForm = ({
  type,
  data,
  id,
  userId,
  setOpen,
  relatedData,
}: Props) => {
  const existingEnrolledSubjects: number[] =
    data?.map((subject: { id: number }) => subject.id) || [];

  const subjects = relatedData?.subjects || [];

  const router = useRouter();

  const [selectedSubjects, setSelectedSubjects] = useState<number[]>(
    existingEnrolledSubjects
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SelectSubjectSchema>({
    resolver: zodResolver(selectSubjectSchema),
    defaultValues: {
      id: userId,
      subjectIds: existingEnrolledSubjects,
    },
  });

  const [state, action, pending] = useActionState(selectSubject, {
    success: false,
    error: false,
    message: "",
  });

  // Handle checkbox changes
  const handleCheckboxChange = (subjectId: number) => {
    setSelectedSubjects((prev) => {
      const isSelected = prev.includes(subjectId);
      const newSelection = isSelected
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId];

      setValue("subjectIds", newSelection);
      return newSelection;
    });
  };

  const onSubmit = handleSubmit((formData) => {
    startTransition(() => action(formData));
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state, router, setOpen]);

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold text-center">Select Subjects</h1>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500 font-medium">
          Available Subjects (Select multiple)
        </label>

        <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-md p-3">
          {subjects.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No subjects available
            </p>
          ) : (
            <div className="space-y-2">
              {subjects.map((subject) => (
                <label
                  key={subject.id}
                  className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subject.id)}
                    onChange={() => handleCheckboxChange(subject.id)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">
                      {subject.code}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      {subject.name}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {errors.subjectIds && (
          <p className="text-xs text-red-400">
            {errors.subjectIds.message?.toString()}
          </p>
        )}

        <p className="text-xs text-gray-500 mt-1">
          {selectedSubjects.length} subject(s) selected
        </p>
      </div>

      {state.error && (
        <p className="text-sm text-red-400 text-center">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-blue-500 text-white p-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        {pending ? "Processing..." : "Update Enrollment"}
      </button>
    </form>
  );
};

export default SelectSubjectForm;
