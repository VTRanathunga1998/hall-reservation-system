import Menu from "@/components/Menu";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full scrollbar-hidden">
      {/*LEFT*/}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 h-screen overflow-y-scroll scrollbar-hidden">
        <Link
          href="/"
          className="flex items-center gap-2 no-underline text-inherit"
        >
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block">SUSL</span>
        </Link>

        <Menu />
      </div>
      {/*RIGHT*/}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-y-scroll scrollbar-hidden flex flex-col">
        <NavBar />
        {children}
      </div>
    </div>
  );
}
