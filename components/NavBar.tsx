import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import UserMenu from "./UserMenu";

const NavBar = async () => {
  const user = await currentUser();

  const role = user?.publicMetadata.role as string;

  return (
    <div className="flex items-center justify-between p-4">
      {/*Icons and Server*/}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="flex flex-col">
          <span className="text-sm leading-3 font-medium">
            {user?.username || "User"}{" "}
          </span>
          <span className="text-[10px] text-gray-500 text-right">{role}</span>
        </div>
        {/* <UserButton />  */}
        <UserMenu />
      </div>
    </div>
  );
};

export default NavBar;
