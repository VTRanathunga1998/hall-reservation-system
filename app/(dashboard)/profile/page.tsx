"use client";

import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="flex-1 flex p-2">
      <UserProfile path="/profile" routing="path" />
    </div>
  );
}
