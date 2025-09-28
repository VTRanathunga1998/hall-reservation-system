import BigCalendar from "@/components/BigCalendar";

const LectureCalendar = () => {
  return (
    <div className="flex-1 mb-10 ml-1 mr-1  bg-white rounded-sm p-2">
      <h1 className="w-full p-1 font-bold">Hall A</h1>
      <BigCalendar />
    </div>
  );
};

export default LectureCalendar;
