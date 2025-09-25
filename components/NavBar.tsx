// import { UserButton } from "@clerk/nextjs";
// import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

const NavBar = async () => {
  // const user = await currentUser();

  // const role = user?.publicMetadata.role as string;

  return (
    <div className="flex items-center justify-between p-4">
      {/*Icons and Server*/}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="flex flex-col">
          <span className="text-sm leading-3 font-medium">John Doe</span>
          <span className="text-[10px] text-gray-500 text-right">Admin</span>
        </div>
        <Image
          src="/avatar.png"
          alt="Avatar"
          width={36}
          height={36}
          className="rounded-full"
        />
        {/* <UserButton /> */}
      </div>
    </div>
  );
};

export default NavBar;
