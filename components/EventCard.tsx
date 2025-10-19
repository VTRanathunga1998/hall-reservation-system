// components/EventCard.tsx
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  id: number;
  title: string;
  subject: string;
  // accept either a Date or an ISO string
  startTime: Date | string;
  endTime: Date | string;
  lecturer: string;
  hallId: number;
  hallName: string;
  roomId: number;
  roomName: string;
}

const TZ = "Asia/Colombo";
const LOCALE = "en-LK";

const EventCard: React.FC<EventCardProps> = ({
  id,
  hallId,
  hallName,
  roomId,
  roomName,
  title,
  subject,
  startTime,
  endTime,
  lecturer,
}) => {
  // Normalize to Date objects (handles both Date and ISO string)
  const start = startTime instanceof Date ? startTime : new Date(startTime);
  const end = endTime instanceof Date ? endTime : new Date(endTime);

  // Date parts using Asia/Colombo timezone so server timezone doesn't matter
  const month = start.toLocaleString(LOCALE, { month: "short", timeZone: TZ });
  const day = start.toLocaleString(LOCALE, { day: "2-digit", timeZone: TZ });

  const dateLabel = start.toLocaleDateString(LOCALE, {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: TZ,
  });

  const timeString = `${start.toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  })} — ${end.toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  })}`;

  return (
    <article
      aria-labelledby={`event-${id}-title`}
      className="flex flex-col md:flex-row items-stretch bg-white shadow-sm hover:shadow-md overflow-hidden border border-gray-200 rounded-md w-full"
    >
      {/* Left date badge */}
      <div className="flex flex-row-reverse md:flex-col items-center justify-center md:w-20 bg-gradient-to-b from-rose-400 to-rose-300 p-3 text-center">
        <span className="text-2xl md:text-3xl font-bold text-white leading-none">
          {day}
        </span>
        <span className="uppercase tracking-wide font-semibold text-sm text-white">
          {month}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="min-w-0">
          <h3
            id={`event-${id}-title`}
            className="text-lg font-semibold text-gray-900 truncate"
          >
            {title}
          </h3>
          <p className="text-sm text-gray-600">{subject}</p>
          <p className="text-sm text-gray-600 mt-1">
            Time: <span className="font-medium">{timeString}</span>
          </p>
          <p className="text-sm text-gray-600">Lecturer: {lecturer}</p>
          <p className="text-sm text-gray-500 mt-1">
            Location: {hallName} — {roomName}
          </p>
        </div>

        {/* Action */}
        <div className="flex items-center justify-center md:items-start md:ml-4">
          <Link
            href={`/home/${hallId}/${roomId}`}
            aria-label={`View room ${roomId} in hall ${hallId}`}
            className="flex items-center justify-center rounded-full cursor-pointer bg-[#C3EBFA] p-2"
          >
            <Image src="/view.png" alt="View" width={16} height={16} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
