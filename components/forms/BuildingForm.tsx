"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { buildingSchema, BuildingSchema } from "@/lib/formValidationsSchemas";
import { createBuilding, updateBuilding } from "@/lib/actions";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const BuildingForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuildingSchema>({
    resolver: zodResolver(buildingSchema),
  });

  const [state, action, pending] = useActionState(
    type === "create" ? createBuilding : updateBuilding,
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
    }
  }, [state, router, setOpen]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new builing" : "Update the building"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Building Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
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

export default BuildingForm;
