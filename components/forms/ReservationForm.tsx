"use client";

import { useAuth } from "@clerk/nextjs";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
import { setHours, setMinutes } from "date-fns";

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

  const { subjects, lecRooms, lecHalls, lectures, departments } = relatedData;

  const defaultStartTime = data?.startTime
    ? new Date(data.startTime)
    : undefined;
  const defaultEndTime = data?.endTime ? new Date(data.endTime) : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
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

  // Hall State
  const [hallId, setHallId] = useState<number>(
    data?.lectureRoom.hall.id || lecHalls?.[0]?.id || 0
  );

  // Department State
  const [depId, setDepId] = useState<number>(
    role === "lecturer"
      ? lectures.find(
          (lec: { id: string; name: string; departmentId: number }) =>
            lec.id === currentUserId
        )?.departmentId
      : data?.subject.departmentId || departments?.[0]?.id || 0
  );

  // Lecturer State
  const [lecId, setLecId] = useState<string>(() => {
    if (role === "lecturer") {
      return currentUserId || "";
    } else {
      const firstLecturer = lectures.find(
        (lec: any) => lec.departmentId === depId
      );
      return firstLecturer ? firstLecturer.id : "";
    }
  });

  // Filtered subjects
  const filteredSubjects = subjects.filter((subject: any) =>
    subject.lecturers.some((lec: any) => lec.id === lecId)
  );

  // Filtered lecturers
  const filteredLecturers = lectures.filter(
    (s: { id: string; code: string; departmentId: number }) =>
      s.departmentId === depId
  );

  // Filtered lecture rooms
  const filteredLectureRooms = lecRooms.filter(
    (s: { id: number; name: string; hallId: number }) => s.hallId === hallId
  );
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
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Building</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            value={hallId}
            onChange={(e) => setHallId(Number(e.target.value))}
          >
            {lecHalls.map((d: { id: number; name: string }) => (
              <option value={d.id} key={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Lecture Room</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lecRoomId", { valueAsNumber: true })}
            defaultValue={data?.hallId}
          >
            {filteredLectureRooms.map(
              (lecRoom: { id: number; name: string }) => (
                <option value={lecRoom.id} key={lecRoom.id}>
                  {lecRoom.name}
                </option>
              )
            )}
          </select>
          {errors.lecRoomId?.message && (
            <p className="text-xs text-red-400">
              {errors.lecRoomId.message.toString()}
            </p>
          )}
        </div>

        {role !== "lecturer" && (
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Department</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              value={depId}
              onChange={(e) => {
                const newDepId = Number(e.target.value);
                setDepId(newDepId);

                // Automatically select the first lecturer from the new department
                const firstLecturer = lectures.find(
                  (lec: any) => lec.departmentId === newDepId
                );
                setLecId(firstLecturer ? firstLecturer.id : "");
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

        {role === "lecturer" ? (
          <>
            {/* Hidden input ensures value is submitted */}
            <input type="hidden" value={lecId} {...register("lecturerId")} />
          </>
        ) : (
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Lecturer</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("lecturerId")}
              value={lecId}
              onChange={(e) => setLecId(e.target.value)}
            >
              {filteredLecturers.map((s: { id: string; name: string }) => (
                <option value={s.id} key={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.lecturerId?.message && (
              <p className="text-xs text-red-400">
                {errors.lecturerId.message.toString()}
              </p>
            )}
          </div>
        )}

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

        <div className="flex flex-wrap gap-4 w-full">
          {/* Start Time */}
          <div className="flex flex-col gap-2 w-full md:w-1/3">
            <label className="text-xs text-gray-500">Start Time</label>

            <Controller
              control={control}
              name="startTime"
              render={({ field }) => (
                <DatePicker
                  selected={field.value} // this must be a Date object
                  onChange={(date) => field.onChange(date)}
                  showTimeSelect
                  timeIntervals={15}
                  dateFormat="Pp"
                  placeholderText="Select start time"
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                  minDate={new Date()}
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

          {/* End Time */}
          <div className="flex flex-col gap-2 w-full md:w-1/3">
            <label className="text-xs text-gray-500">End Time</label>

            <Controller
              control={control}
              name="endTime"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  showTimeSelect
                  timeIntervals={15}
                  dateFormat="Pp"
                  placeholderText="Select end time"
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                  minDate={watch("startTime") ?? new Date()}
                  minTime={setHours(setMinutes(new Date(), 0), 8)}
                  maxTime={setHours(setMinutes(new Date(), 0), 20)}
                />
              )}
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
        className="bg-blue-400 text-white p-2 rounded-md cursor-pointer"
      >
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ReservationForm;
