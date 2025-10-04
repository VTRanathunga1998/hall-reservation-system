"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  reservationSchema,
  ReservationSchema,
} from "@/lib/formValidationsSchemas";
import { createReservation, updateReservation } from "@/lib/actions";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ReservationForm = ({
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
  } = useForm<ReservationSchema>({
    resolver: zodResolver(reservationSchema),
  });

  const [state, action, pending] = useActionState(
    type === "create" ? createReservation : updateReservation,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log(data);
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
    }
  }, [state, router, setOpen]);

  function toDatetimeLocalString(dateString?: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Adjust to local time and strip seconds/millis
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - tzOffset)
      .toISOString()
      .slice(0, 16);
    return localISOTime;
  }

  const { subjects, lecRooms, lectures } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new reservation"
          : "Update the reservation"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Lecture Room</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lecRoomId", { valueAsNumber: true })}
            defaultValue={data?.hallId}
          >
            {lecRooms.map((lecRoom: { id: number; name: string }) => (
              <option value={lecRoom.id} key={lecRoom.id}>
                {lecRoom.name}
              </option>
            ))}
          </select>
          {errors.lecRoomId?.message && (
            <p className="text-xs text-red-400">
              {errors.lecRoomId.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subject</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subjectId", { valueAsNumber: true })}
            defaultValue={data?.code}
          >
            {subjects.map((s: { id: number; code: string }) => (
              <option value={s.id} key={s.id}>
                {s.code}
              </option>
            ))}
          </select>
          {errors.subjectId?.message && (
            <p className="text-xs text-red-400">
              {errors.subjectId.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Lecturer</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lecturerId")}
            defaultValue={data?.lecturer}
          >
            {lectures.map((lecturer: { id: number; name: string }) => (
              <option value={lecturer.id} key={lecturer.id}>
                {lecturer.name}
              </option>
            ))}
          </select>
          {errors.lecturerId?.message && (
            <p className="text-xs text-red-400">
              {errors.lecturerId.message.toString()}
            </p>
          )}
        </div>

        <InputField
          label="Start Time"
          name="startTime"
          type="datetime-local"
          register={register}
          registerOptions={{
            setValueAs: (val: any) => (val ? new Date(val) : undefined),
          }}
          defaultValue={toDatetimeLocalString(data?.startTime)}
        />
        <InputField
          label="End Time"
          name="endTime"
          type="datetime-local"
          register={register}
          registerOptions={{
            setValueAs: (val: any) => (val ? new Date(val) : undefined),
          }}
          defaultValue={toDatetimeLocalString(data?.endTime)}
        />
        {data && (
          <input
            type="hidden"
            value={data.id}
            {...register("id", { valueAsNumber: true })}
          />
        )}
      </div>
      {state.error && <span className="text-red-400">{state.message}</span>}

      <button className="bg-blue-400 text-white p-2 rounded-md cursor-pointer">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ReservationForm;
