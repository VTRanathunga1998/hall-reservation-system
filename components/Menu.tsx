import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/home",
        visible: ["admin", "lecturer", "student"],
      },
      {
        icon: "/building.png",
        label: "Buildings",
        href: "/list/buildings",
        visible: ["admin"],
      },
      {
        icon: "/classroom.png",
        label: "Lecture Rooms",
        href: "/list/lecture_rooms",
        visible: ["admin"],
      },
      {
        icon: "/department.png",
        label: "Departments",
        href: "/list/departments",
        visible: ["admin"],
      },
      {
        icon: "/lecture.png",
        label: "Lecturers",
        href: "/list/lecturers",
        visible: ["admin", "lecturer", "student"],
      },
      {
        icon: "/classmates.png",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "lecturer"],
      },
      {
        icon: "/book.png",
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin", "lecturer", "student"],
      },
      {
        icon: "/calendar.png",
        label: "Reservations",
        href: "/list/reservations",
        visible: ["admin", "lecturer"],
      },
    ],
  },
];

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
