import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { reservationsData, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Reservation = {
  id: number;
  reservationId: string;
  hall: string;
  room: string;
  reservedBy: string;
  startTime: Date;
  endTime: Date;
};

const ReservationsListPage = () => {
  const columns = [
    {
      header: "Reservation ID",
      accessor: "reservationId",
      className: "hidden md:table-cell",
    },
    { header: "Hall", accessor: "hall" },
    { header: "Room", accessor: "room", className: "hidden md:table-cell" },
    {
      header: "Reserved By",
      accessor: "reservedBy",
      className: "hidden md:table-cell",
    },
    {
      header: "Start Time",
      accessor: "startTime",
    },
    {
      header: "End Time",
      accessor: "endTime",
    },
    { header: "Actions", accessor: "actions" },
  ];

  const renderRow = (item: Reservation) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]"
    >
      <td className="hidden md:table-cell">{item.reservationId}</td>
      <td>{item.hall}</td>
      <td className="hidden md:table-cell">{item.room}</td>
      <td className="hidden md:table-cell">{item.reservedBy}</td>
      <td>{new Date(item.startTime).toLocaleString()}</td>
      <td>{new Date(item.endTime).toLocaleString()}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/reservations/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#C3EBFA] cursor-pointer">
              <Image src="/view.png" alt="View" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <>
              <FormModal table="reservation" type="update" data={item} />
              <FormModal table="reservation" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex-1 bg-white rounded-md p-4 m-2 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Reservations
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C] cursor-pointer">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C] cursor-pointer">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormModal table="reservation" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={reservationsData} />

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default ReservationsListPage;
