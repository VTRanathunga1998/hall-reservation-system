import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  id: number;
  title: string;
  subject: string;
  startTime: Date;
  endTime: Date;
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
  const month = startTime.toLocaleString("en-US", { month: "short" });
  const day = startTime.getDate();

  const timeString = `${startTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${endTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  return (
    <div className="flex flex-col md:flex-row items-stretch bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 w-full max-w-full md:max-w-3xl ">
      {/* Left Date Box */}
      <div className="flex flex-row-reverse md:flex-col justify-center items-center md:w-1/4 bg-[#636363] text-white p-4 gap-2 md:gap-1">
        {/* Day */}
        <span className="text-xl md:text-3xl font-bold">{day}</span>
        {/* Month */}
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
