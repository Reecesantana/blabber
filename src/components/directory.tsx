import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { FaHome, FaSearch, FaUser } from "react-icons/fa";

export const DirectoryLayout = (props: PropsWithChildren) => {
  const { user } = useUser();

  return (
    <main className="float-left flex h-screen">
      <div className="flex h-full flex-col overflow-y-scroll border-x border-slate-800">
        <div className="flex flex-col text-3xl">
          <Link
            href={"/"}
            className="flex gap-2 p-5 hover:bg-slate-200 hover:text-slate-900"
          >
            <FaHome />
            Home
          </Link>
          <Link
            href={"/"}
            className="flex gap-2 p-5 hover:bg-slate-200 hover:text-slate-900"
          >
            <FaSearch />
            Search
          </Link>
          <Link
            href={"/profile"}
            className="flex gap-2 p-5 hover:bg-slate-200 hover:text-slate-900"
          >
            <FaUser />
            Profile
          </Link>
        </div>
        <div>
          <div>{props.children}</div>
        </div>
      </div>
    </main>
  );
};
