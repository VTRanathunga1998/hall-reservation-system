"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { SignOutButton, useUser } from "@clerk/nextjs";

const UserMenu = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null; // ✅ after hooks

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 focus:outline-none cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
          <Image
            src={user.imageUrl || "/noAvatar.png"}
            alt="user avatar"
            width={32}
            height={32}
            className="object-cover w-full h-full"
          />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-50 rounded-md shadow-lg z-50">
          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile
          </a>
          <SignOutButton>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
              Logout
            </button>
          </SignOutButton>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
