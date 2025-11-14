"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";

import { createLectureRoom, updateLectureRoom } from "@/lib/actions";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  lectureRoomSchema,
  LectureRoomSchema,
} from "@/lib/formValidationsSchemas";

const LectureRoomForm = ({
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
  } = useForm<LectureRoomSchema>({
    resolver: zodResolver(lectureRoomSchema),
  });

  const [state, action, pending] = useActionState(
    type === "create" ? createLectureRoom : updateLectureRoom,
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

  const { buildings } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new lecture room"
          : "Update the lecture room"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Lecture Room Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Max Capacity"
          name="maxCapacity"
          defaultValue={data?.maxCapacity}
          register={register}
          registerOptions={{ valueAsNumber: true }}
          error={errors?.maxCapacity}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Hall</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("hallId", { valueAsNumber: true })}
            defaultValue={data?.hallId}
          >
            {buildings.map((building: { id: number; name: string }) => (
              <option value={building.id} key={building.id}>
                {building.name}
              </option>
            ))}
          </select>
          {errors.hallId?.message && (
            <p className="text-xs text-red-400">
              {errors.hallId.message.toString()}
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
        className={`bg-blue-400 text-white p-2 rounded-md cursor-pointer ${
          pending ? "bg-gray-400 cursor-not-allowed" : ""
        }`}
      >
        {pending
          ? type === "create"
            ? "Creating..."
            : "Updating..."
          : type === "create"
          ? "Create"
          : "Update"}
      </button>
    </form>
  );
};

export default LectureRoomForm;
