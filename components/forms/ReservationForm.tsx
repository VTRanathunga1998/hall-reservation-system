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
  useState,
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

  const { subjects, lecRooms, lectures, departments } = relatedData;

  // Department State
  const [depId, setDepId] = useState<number>(
    data?.departmentId || departments?.[0]?.id || 0
  );

  // Filtered subjects
  const filteredSubjects = subjects.filter(
    (s: { id: number; code: string; departmentId: number }) =>
      s.departmentId === depId
  );

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
          <label className="text-xs text-gray-500">Department</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            value={depId}
            onChange={(e) => setDepId(Number(e.target.value))}
          >
            {departments.map((d: { id: number; name: string }) => (
              <option value={d.id} key={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subject</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subjectId", { valueAsNumber: true })}
            defaultValue={data?.subjectId}
          >
            {filteredSubjects.map((s: { id: number; code: string }) => (
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

        <div className="flex flex-wrap gap-4 w-full">
          {/* Start Time */}
          <div className="flex flex-col gap-2 w-full md:w-1/3">
            <label className="text-xs text-gray-500">Start Time</label>
            <input
              type="datetime-local"
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              defaultValue={toDatetimeLocalString(data?.startTime)}
              {...register("startTime", {
                setValueAs: (val: any) => (val ? new Date(val) : undefined),
              })}
            />
            {errors.startTime?.message && (
              <p className="text-xs text-red-400">
                {errors.startTime.message.toString()}
              </p>
            )}
          </div>

          {/* End Time */}
          <div className="flex flex-col gap-2 w-full md:w-1/3">
            <label className="text-xs text-gray-500">End Time</label>
            <input
              type="datetime-local"
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              defaultValue={toDatetimeLocalString(data?.endTime)}
              {...register("endTime", {
                setValueAs: (val: any) => (val ? new Date(val) : undefined),
              })}
            />
            {errors.endTime?.message && (
              <p className="text-xs text-red-400">
                {errors.endTime.message.toString()}
              </p>
            )}
          </div>
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

      <button className="bg-blue-400 text-white p-2 rounded-md cursor-pointer">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ReservationForm;
