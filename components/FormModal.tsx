import Image from "next/image";

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table: "student" | "lecturer" | "reservation" | "subject";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-[#FAE27C]"
      : type === "update"
      ? "bg-[#C3EBFA]"
      : "bg-[#CFCEFF]";
  return (
    <button
      className={`${size} flex items-center justify-center rounded-full ${bgColor} cursor-pointer`}
    >
      <Image src={`/${type}.png`} alt="" height={16} width={16} />
    </button>
  );
};

export default FormModal;
