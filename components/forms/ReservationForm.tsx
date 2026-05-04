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
import CustomSelect from "../CustomSelect";

const fieldClass =
  "w-full min-w-0 ring-[1.5px] ring-gray-200 focus:ring-blue-300 p-2.5 rounded-lg text-sm outline-none transition bg-white";

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

  // ── Controlled states ──
  const initialLecRoomId = data?.lecRoomId || lecRooms?.[0]?.id || 0;

  const [lecRoomId, setLecRoomId] = useState<number>(initialLecRoomId);

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

  const [lecId, setLecId] = useState<string>(() => {
    if (role === "lecturer") return currentUserId || "";
    if (data?.lecturerId) return data.lecturerId;
    const first = lectures.find((lec: any) => lec.departmentId === depId);
    return first ? first.id : "";
  });

  const filteredLecturers = lectures.filter(
    (l: { id: string; departmentId: number }) => l.departmentId === depId,
  );

  const filteredSubjects = subjects.filter((s: any) =>
    s.lecturers.some((lec: any) => lec.id === lecId),
  );

  const [subjectId, setSubjectId] = useState<number>(
    data?.subjectId || filteredSubjects?.[0]?.id || 0,
  );

  // ── Sync ALL initial state values into RHF on mount ──
  // Without this, RHF fields are undefined even though the UI shows a value,
  // causing validation errors like "Lecture room is required!" on first submit.
  useEffect(() => {
    if (initialLecRoomId)
      setValue("lecRoomId", initialLecRoomId, { shouldValidate: false });
    if (lecId) setValue("lecturerId", lecId, { shouldValidate: false });
    if (subjectId) setValue("subjectId", subjectId, { shouldValidate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep subjectId in sync when lecturer changes
  useEffect(() => {
    if (filteredSubjects.length > 0) {
      const firstId = filteredSubjects[0].id;
      setSubjectId(firstId);
      setValue("subjectId", firstId);
    }
  }, [lecId, filteredSubjects, setValue]);

  // Keep lecId in sync when department changes
  const handleDepartmentChange = (val: string | number) => {
    const newDepId = val as number;
    setDepId(newDepId);
    const first = lectures.find((lec: any) => lec.departmentId === newDepId);
    const newLecId = first ? first.id : "";
    setLecId(newLecId);
    setValue("lecturerId", newLecId);
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 rounded-full bg-blue-400" />
        <h1 className="text-lg font-medium text-gray-800">
          {type === "create"
            ? "Create a new reservation"
            : "Update reservation"}
        </h1>
      </div>

      {/* ── Room & Schedule ── */}
      <section className="flex flex-col gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Room & Schedule
        </p>

        <CustomSelect
          label="Lecture Room"
          options={lecRooms.map((room: { id: number; name: string }) => ({
            value: room.id,
            label: room.name,
          }))}
          value={lecRoomId}
          onChange={(val) => {
            setLecRoomId(val as number);
            setValue("lecRoomId", val as number, { shouldValidate: true });
          }}
          error={errors.lecRoomId?.message?.toString()}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Start Time */}
          <div className="flex flex-col gap-1.5 w-full min-w-0">
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
                  className={fieldClass}
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

          {/* End Time */}
          <div className="flex flex-col gap-1.5 w-full min-w-0">
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
                    className={fieldClass}
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
      </section>

      <div className="border-t border-gray-100" />

      {/* ── Lecturer & Subject ── */}
      <section className="flex flex-col gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Lecturer & Subject
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {role !== "lecturer" && (
            <CustomSelect
              label="Department"
              options={departments.map((d: { id: number; name: string }) => ({
                value: d.id,
                label: d.name,
              }))}
              value={depId}
              onChange={handleDepartmentChange}
            />
          )}

          {role === "lecturer" ? (
            <input type="hidden" value={lecId} {...register("lecturerId")} />
          ) : (
            <CustomSelect
              label="Lecturer"
              options={filteredLecturers.map(
                (l: { id: string; name: string; surname: string }) => ({
                  value: l.id,
                  label: `${l.name.toUpperCase()} ${l.surname}`,
                }),
              )}
              value={lecId}
              onChange={(val) => {
                setLecId(val as string);
                setValue("lecturerId", val as string, { shouldValidate: true });
              }}
              error={errors.lecturerId?.message?.toString()}
            />
          )}

          <CustomSelect
            label="Subject"
            options={
              filteredSubjects.length > 0
                ? filteredSubjects.map((s: { id: number; code: string }) => ({
                    value: s.id,
                    label: s.code,
                  }))
                : [{ value: "", label: "No subjects for this lecturer" }]
            }
            value={subjectId}
            onChange={(val) => {
              if (!val) return;
              setSubjectId(val as number);
              setValue("subjectId", val as number, { shouldValidate: true });
            }}
            error={errors.subjectId?.message?.toString()}
          />
        </div>
      </section>

      {data && (
        <input
          type="hidden"
          value={data.id}
          {...register("id", { valueAsNumber: true })}
        />
      )}

      {state.error && (
        <span className="text-xs text-red-400">{state.message}</span>
      )}

      <button
        disabled={pending}
        className="w-full bg-blue-400 hover:bg-blue-500 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition cursor-pointer"
      >
        {pending
          ? type === "create"
            ? "Creating…"
            : "Updating…"
          : type === "create"
            ? "Create Reservation"
            : "Update Reservation"}
      </button>
    </form>
  );
};

export default ReservationForm;
