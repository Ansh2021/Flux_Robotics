"use client";

import { useRef } from "react";
import Link from "next/link";
import { geistMono } from "./ui/fonts";
import { useSwitchStore } from "./store/useSwitchStore";

export default function Home() {
  const modesRef = useRef<HTMLDivElement | null>(null);
  const isToggled = useSwitchStore((state) => state.isToggled);

  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="h-[calc(100dvh-4rem)] flex flex-col items-center justify-center gap-2">
        <h1
          className={`text-4xl font-bold w-fit text-center p-4 ${geistMono.className} antialiased`}
        >
          Welcome to Flux
        </h1>
        <button
          onClick={() => {
            modesRef.current?.scrollIntoView();
          }}
          className="group flex rounded-full items-center justify-center h-12 w-40 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300"
        >
          <div className="rounded-full bg-black group-hover:bg-[#111111] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300">
            Jump to Modes
          </div>
        </button>
      </div>
      <div
        ref={modesRef}
        id="modes"
        className="mt-[dvh] flex flex-col p-5 justify-between gap-8"
      >
        <div className="w-fit flex flex-row">
          <Link href={`/${isToggled ? "frc" : "ftc"}/wordle`}>
            <div
              id="wordle"
              className="group h-[20dvh] max-h-20 min-h-20 w-[45dvw] max-w-85 min-w-15 flex justify-center items-center rounded-full bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] mr-3 hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300"
            >
              <div className="rounded-full bg-black group-hover:bg-[#111111] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300">
                <p className="text-2xl w-fit">Wordle</p>
              </div>
            </div>
          </Link>
          <Link href={`/${isToggled ? "frc" : "ftc"}/trivia`}>
            <div
              id="trivia"
              className="group h-[20dvh] max-h-20 min-h-20 w-[45dvw] max-w-85 min-w-15 flex justify-center items-center rounded-full bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] ml-3 hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300"
            >
              <div className="rounded-full bg-black group-hover:bg-[#111111] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300">
                <p className="text-2xl w-fit">Trivia</p>
              </div>
            </div>
          </Link>
        </div>
        <Link href={`/${isToggled ? "frc" : "ftc"}/clicker`}>
          <div className="w-full flex flex-row">
            <div
              id="clicker"
              className="group h-[20dvh] max-h-20 min-h-20 w-full min-w-15 flex justify-center items-center rounded-full bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300"
            >
              <div className="rounded-full bg-black group-hover:bg-[#111111] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300">
                <p className="text-2xl w-fit">Clicker</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
}
