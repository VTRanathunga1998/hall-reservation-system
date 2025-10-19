import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  id: number;
  title: string;
  subject: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  lecturer: string;
  hallId: number;
  roomId: number;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  hallId,
  roomId,
  title,
  subject,
  startTime,
  endTime,
  lecturer,
}) => {
  // Convert to Date
  const start = new Date(startTime);
  const end = new Date(endTime);

  const month = start.toLocaleString("en-LK", {
    month: "short",
    timeZone: "Asia/Colombo",
  });
  const day = start.toLocaleString("en-LK", {
    day: "2-digit",
    timeZone: "Asia/Colombo",
  });

  const timeString = `${start.toLocaleTimeString("en-LK", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Colombo",
  })} - ${end.toLocaleTimeString("en-LK", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Colombo",
  })}`;

  return (
    <div className="flex flex-col md:flex-row items-stretch bg-[#C4C4C4] shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 w-full max-w-full md:max-w-3xl ">
      {/* Left Date Box */}
      <div className="flex flex-row-reverse md:flex-col justify-center items-center md:w-1/6 bg-[#FF8A8A] p-4 gap-2 md:gap-1">
        <span className="text-xl md:text-3xl font-bold">{day}</span>
        <span className="uppercase tracking-wide font-bold text-xl md:text-xl">
          {month}
        </span>
      </div>

      {/* Middle Content */}
      <div className="flex-1 px-4 py-3 flex flex-col justify-center gap-1 items-center md:items-start">
        <h2 className="text-lg font-semibold text-gray-800">{subject}</h2>
        <p className="text-sm text-gray-600">Time: {timeString}</p>
        <p className="text-sm text-gray-600">Lecturer: {lecturer}</p>
      </div>

      {/* Right Action */}
      <div className="flex items-center px-4 mx-auto mb-2 md:mb-0">
        <Link
          href={`/home/${hallId}/${roomId}`}
          className="flex items-center justify-center rounded-full cursor-pointer bg-[#C3EBFA] p-2"
        >
          <Image src="/view.png" alt="View" height={16} width={16} />
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
