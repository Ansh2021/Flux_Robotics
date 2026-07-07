"use client";

import Link from "next/link";

export default function About() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          About Flux
        </h1>
        <p className="mt-6 text-lg leading-8 text-white/75">
          Flux was created by an aspiring web developer for Hackclub's
          Stardance. Built with the SERN full-stack variation
          (Supabase/PostgressSQL, Express, React/Next JS, and Node JS), it
          consists of three games that are meant to widen your knowledge of
          FIRST robotics (specifically FRC) and STEM.
          {/*I hope this place acts as
          a center to foster a love for STEM and robotics!*/}
        </p>
        <Link
          href="https://github.com/Ansh2021/Flux_Robotics"
          className="mt-6 text-lg leading-8 text-white/60 underline"
          target="blank"
        >
          Flux GitHub Repository
        </Link>
      </main>
    </div>
  );
}
