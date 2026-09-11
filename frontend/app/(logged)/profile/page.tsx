import ProfileInfoField from "@/app/components/ui/ProfileInfoField";
import React from "react";

export default function page() {
  return (
    <section className="bg-[#F7F9F7] dark:bg-black flex justify-center items-start w-full min-h-screen p-6">
      <div className="w-full max-h-7xl flex flex-col bg-[#FDFDFC]  p-10 rounded-2xl dark:bg-neutral-900 ">
        <ProfileInfoField />
      </div>
    </section>
  );
}
