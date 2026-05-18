"use client";

import { useRef } from "react";
import Link from "next/link";
import { geistMono } from "./ui/fonts";

export default function Home() {
  const modesRef = useRef<HTMLDivElement | null>(null);

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
          <div className="rounded-full bg-[#1E1E1E] group-hover:bg-[#121212] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300">
            Jump to Modes
          </div>
        </button>
      </div>
      <div
        ref={modesRef}
        id="modes"
        className="mt-[dvh] flex flex-col p-5 justify-between"
      >
        <div className="w-fit flex flex-row">
          <div
            id="wordle"
            className="group h-[20dvh] max-h-20 min-h-20 w-[45dvw] max-w-85 min-w-15 flex justify-center items-center rounded-full ml-2 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] mr-2 hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300"
          >
            <div className="rounded-full bg-[#1E1E1E] group-hover:bg-[#121212] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300">
              <Link href="/frc/wordle">
                <p className="text-2xl w-fit">Wordle</p>
              </Link>
            </div>
          </div>
          <div
            id="trivia"
            className="group h-[20dvh] max-h-20 min-h-20 w-[45dvw] max-w-85 min-w-15 flex justify-center items-center rounded-full ml-2 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] ml-2 hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300"
          >
            <div className="rounded-full bg-[#1E1E1E] group-hover:bg-[#121212] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300">
              <Link href="/frc/trivia">
                <p className="text-2xl w-fit">Trivia</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
