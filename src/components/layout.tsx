import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen">
      <div className="flex h-full w-full flex-col overflow-y-scroll border-x border-slate-800 ">
        <div className="">
          <div>{props.children}</div>
        </div>
      </div>
    </main>
  );
};
