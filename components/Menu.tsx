import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import {
  Home,
  LayoutDashboard,
  CalendarClock,
  DoorOpen,
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Mail,
  Calculator,
} from "lucide-react";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: Home,
        label: "Home",
        href: "/home",
        visible: ["admin", "lecturer"],
      },
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard",
        visible: ["admin"],
      },
      {
        icon: CalendarClock,
        label: "Upcoming",
        href: "/upcoming",
        visible: ["student"],
      },
      {
        icon: DoorOpen,
        label: "Lecture Rooms",
        href: "/list/lecture_rooms",
        visible: ["admin"],
      },
      {
        icon: Building2,
        label: "Departments",
        href: "/list/departments",
        visible: ["admin"],
      },
      {
        icon: Users,
        label: "Lecturers",
        href: "/list/lecturers",
        visible: ["admin", "lecturer"],
      },
      {
        icon: GraduationCap,
        label: "Students",
        href: "/list/students",
        visible: ["admin", "lecturer"],
      },
      {
        icon: BookOpen,
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin", "lecturer", "student"],
      },
      {
        icon: CalendarDays,
        label: "Reservations",
        href: "/list/reservations",
        visible: ["admin", "lecturer"],
      },
      {
        icon: Mail,
        label: "Email",
        href: "/email",
        visible: ["admin"],
      },
      {
        icon: Calculator,
        label: "GPA Calculator",
        href: "/gpa",
        visible: ["student"],
      },
    ],
  },
];

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;

  return (
    <nav className="flex flex-col gap-1 px-2 py-4">
      {menuItems.map((section) => {
        const visibleItems = section.items.filter((item) =>
          item.visible.includes(role)
        );

        if (visibleItems.length === 0) return null;

        return (
          <div key={section.title} className="flex flex-col gap-0.5">
            {/* Section label */}
            <span className="hidden lg:block text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 pt-4 pb-2 select-none">
              {section.title}
            </span>

            {/* Items */}
            {visibleItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="group flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-150"
                >
                  {/* Icon container */}
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all duration-150">
                    <Icon className="w-4 h-4" strokeWidth={1.8} />
                  </span>

                  {/* Label — hidden on collapsed sidebar */}
                  <span className="hidden lg:block text-sm font-medium leading-none">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
};

export default Menu;
