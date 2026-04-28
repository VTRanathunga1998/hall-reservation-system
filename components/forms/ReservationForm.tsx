"use client";

import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useWatch, useForm } from "react-hook-form";
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
import DatePicker from "react-datepicker";
import { setHours, setMinutes, isSameDay } from "date-fns";

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
  const { userId, sessionClaims } = useAuth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  // Hall is removed — lecHalls no longer exists in relatedData
  const { subjects, lecRooms, lectures, departments } = relatedData;

  const defaultStartTime = data?.startTime
    ? new Date(data.startTime)
    : undefined;
  const defaultEndTime = data?.endTime ? new Date(data.endTime) : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<ReservationSchema>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      startTime: defaultStartTime,
      endTime: defaultEndTime,
    },
  });

  const [state, action, pending] = useActionState(
    type === "create" ? createReservation : updateReservation,
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

  // Department State
  const [depId, setDepId] = useState<number>(
    role === "lecturer"
      ? (lectures.find(
          (lec: { id: string; departmentId: number }) =>
            lec.id === currentUserId,
        )?.departmentId ??
          departments?.[0]?.id ??
          0)
      : data?.subject?.departmentId || departments?.[0]?.id || 0,
  );

  // Lecturer State
  const [lecId, setLecId] = useState<string>(() => {
    if (role === "lecturer") return currentUserId || "";
    if (data?.lecturerId) return data.lecturerId;
    const first = lectures.find((lec: any) => lec.departmentId === depId);
    return first ? first.id : "";
  });

  // Filtered lecturers by department
  const filteredLecturers = lectures.filter(
    (l: { id: string; departmentId: number }) => l.departmentId === depId,
  );

  // Filtered subjects by selected lecturer
  const filteredSubjects = subjects.filter((s: any) =>
    s.lecturers.some((lec: any) => lec.id === lecId),
  );

  // All lecture rooms — no hall filter needed anymore
  // lecRooms is the full list from relatedData
  const allLectureRooms = lecRooms;

  useEffect(() => {
    if (filteredSubjects.length > 0) {
      setValue("subjectId", filteredSubjects[0].id);
    }
  }, [lecId, filteredSubjects, setValue]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new reservation"
          : "Update the reservation"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        {/* Lecture Room — all rooms, no hall grouping */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Lecture Room</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lecRoomId", { valueAsNumber: true })}
            defaultValue={data?.lecRoomId}
          >
            {allLectureRooms.map((room: { id: number; name: string }) => (
              <option value={room.id} key={room.id}>
                {room.name}
              </option>
            ))}
          </select>
          {errors.lecRoomId?.message && (
            <p className="text-xs text-red-400">
              {errors.lecRoomId.message.toString()}
            </p>
          )}
        </div>

        {/* Department (hidden for lecturer role) */}
        {role !== "lecturer" && (
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Department</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              value={depId}
              onChange={(e) => {
                const newDepId = Number(e.target.value);
                setDepId(newDepId);
                const first = lectures.find(
                  (lec: any) => lec.departmentId === newDepId,
                );
                setLecId(first ? first.id : "");
              }}
            >
              {departments.map((d: { id: number; name: string }) => (
                <option value={d.id} key={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Lecturer */}
        {role === "lecturer" ? (
          <input type="hidden" value={lecId} {...register("lecturerId")} />
        ) : (
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Lecturer</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("lecturerId")}
              value={lecId}
              onChange={(e) => setLecId(e.target.value)}
            >
              {filteredLecturers.map(
                (l: { id: string; name: string; surname: string }) => (
                  <option value={l.id} key={l.id}>
                    {l.name.toUpperCase()} {l.surname}
                  </option>
                ),
              )}
            </select>
            {errors.lecturerId?.message && (
              <p className="text-xs text-red-400">
                {errors.lecturerId.message.toString()}
              </p>
            )}
          </div>
        )}

        {/* Subject (filtered by lecturer) */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subject</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subjectId", { valueAsNumber: true })}
            defaultValue={data?.subjectId}
          >
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((s: { id: number; code: string }) => (
                <option value={s.id} key={s.id}>
                  {s.code}
                </option>
              ))
            ) : (
              <option disabled value="">
                No subjects for this lecturer
              </option>
            )}
          </select>
          {errors.subjectId?.message && (
            <p className="text-xs text-red-400">
              {errors.subjectId.message.toString()}
            </p>
          )}
        </div>

        {/* Start / End Time */}
        <div className="flex flex-wrap gap-4 w-full">
          <div className="flex flex-col gap-2 w-full md:w-1/3">
            <label className="text-xs text-gray-500">Start Time</label>
            <Controller
              control={control}
              name="startTime"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  showTimeSelect
                  timeIntervals={15}
                  dateFormat="Pp"
                  placeholderText="Select start time"
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                  portalId="datepicker-portal"
                  minDate={new Date()}
                  filterDate={(date) => {
                    const day = date.getDay();
                    return day !== 0 && day !== 6;
                  }}
                  minTime={setHours(setMinutes(new Date(), 0), 8)}
                  maxTime={setHours(setMinutes(new Date(), 0), 20)}
                />
              )}
            />
            {errors.startTime?.message && (
              <p className="text-xs text-red-400">
                {errors.startTime.message.toString()}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full md:w-1/3">
            <label className="text-xs text-gray-500">End Time</label>
            <Controller
              control={control}
              name="endTime"
              render={({ field }) => {
                const startTime = useWatch({ control, name: "startTime" });
                return (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    showTimeSelect
                    timeIntervals={15}
                    dateFormat="Pp"
                    placeholderText="Select end time"
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    portalId="datepicker-portal"
                    minDate={startTime || new Date()}
                    filterDate={(date) => {
                      const day = date.getDay();
                      return day !== 0 && day !== 6;
                    }}
                    minTime={
                      startTime &&
                      isSameDay(startTime, field.value || startTime)
                        ? startTime
                        : setHours(setMinutes(new Date(), 0), 8)
                    }
                    maxTime={setHours(setMinutes(new Date(), 0), 20)}
                  />
                );
              }}
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

      <button
        disabled={pending}
        className="bg-blue-400 text-white p-2 rounded-md cursor-pointer disabled:opacity-60"
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

export default ReservationForm;
