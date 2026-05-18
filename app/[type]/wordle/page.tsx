"use client";

import { use } from "react";
import { notFound } from "next/navigation";

export default function Wordle({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);
  if (!(type.toLowerCase() === "frc" || type.toLowerCase() === "ftc")) {
    notFound();
  }

  if (type.toLowerCase() === "frc") {
    return (
      <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="h-[calc(100dvh-4rem)] flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold w-fit text-center p-4">
            Welcome to FRC Wordle
          </h1>
        </div>
        {/* make the modal actually appear above the content instead of below*/}
        <div id="frc-wordle-modal" className="z-1 shadow-2xl">
          <p>hi</p>
        </div>
      </main>
    );
  }

  if (type.toLowerCase() === "ftc") {
    return <p>still under construction</p>;
  }
}
