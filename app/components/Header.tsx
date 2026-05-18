"use client";

import Link from "next/link";
import { geistMono } from "@/app/ui/fonts";
import { useRouter, usePathname } from "next/navigation";
import ToggleSwitch from "../ui/toggleswitch";

export function Header() {
  const path = usePathname();
  const router = useRouter();

  const handleScroll = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();

    if (path === "/") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    } else {
      router.push("/");

      //remove hardcoded timeout
      //change to execute when window is fully loaded
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        }
      }, 500);
    }
  };
  //bg-[#1E1E1E]
  return (
    <div className="flex justify-center items-center bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] pb-[3px]">
      <header className="w-full h-16 bg-black text-white flex items-center justify-center sticky top-0 z-1">
        <nav className="w-full  flex flex-row items-center px-4">
          <div className="bg-black px-4 py-2 rounded-md">
            <Link href="/">
              <h1
                className={`text-xl font-bold ${geistMono.className} antialiased`}
              >
                Flux
              </h1>
            </Link>
          </div>
          <div className="bg-black px-4 py-2 rounded-md hover:bg-[#1E1E1E] transition ease-in-out duration:300">
            <button onClick={(e) => handleScroll(e, "modes")}>
              <p className={`text-xl ${geistMono.className} antialiased`}>
                Modes
              </p>
            </button>
          </div>
          <div className="bg-black px-4 py-2 rounded-md hover:bg-[#1E1E1E] transition ease-in-out duration:300">
            <Link href="/about">
              <p className={`text-xl ${geistMono.className} antialiased`}>
                About
              </p>
            </Link>
          </div>
        </nav>
        {/* <div>
        <ToggleSwitch />
      </div> */}
      </header>
    </div>
  );
}
