"use client";

import Link from "next/link";
import { geistMono } from "@/app/ui/fonts";
import { useRouter, usePathname } from "next/navigation";
import ToggleSwitch from "../ui/toggleswitch";
import { useSwitchStore } from "../store/useSwitchStore";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Transition } from "@headlessui/react";

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

  //TODO: replace everything that gets hidden by a PIXEL amount to getting hidden by a REM amount
  const { isToggled, setIsToggled } = useSwitchStore();
  const [headerDrawerToggled, setHeaderDrawerToggled] = useState(false);

  return (
    <div className="flex h-16 w-full justify-center items-center bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] pb-[3px] sticky top-0 z-1">
      <header className="w-full h-full bg-black text-white flex items-center justify-center sticky top-0 z-1">
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
          <div className="bg-black px-4 py-2 rounded-md hover:bg-[#1E1E1E] transition ease-in-out duration:300 max-[400px]:hidden">
            <button onClick={(e) => handleScroll(e, "modes")}>
              <p className={`text-xl ${geistMono.className} antialiased`}>
                Modes
              </p>
            </button>
          </div>
          <div className="bg-black px-4 py-2 rounded-md hover:bg-[#1E1E1E] transition ease-in-out duration:300 max-[400px]:hidden">
            <Link href="/about">
              <p className={`text-xl ${geistMono.className} antialiased`}>
                About
              </p>
            </Link>
          </div>
        </nav>
        <div className="flex mr-10 h-full justify-center items-center gap-3 max-sm:hidden">
          <p className={`text-xl ${geistMono.className} antialiased`}>FTC</p>
          <ToggleSwitch checked={isToggled} onChange={setIsToggled} />
          <p className={`text-xl ${geistMono.className} antialiased`}>FRC</p>
        </div>
        <div
          className={`hidden max-sm:flex px-4 py-1 mr-4 rounded-md transition duration-300 ease-in-out ${headerDrawerToggled ? "bg-[#1E1E1E]" : "bg-black"}`}
        >
          <Bars3Icon
            className={`fill-white size-9`}
            onClick={() =>
              setHeaderDrawerToggled(
                (headerDrawerToggled) => !headerDrawerToggled,
              )
            }
          />
        </div>
        {/* drawer */}
      </header>
      <div
        className={`flex flex-col bg-black pl-3 pb-3 fixed top-0 left-0 w-full h-fit sm:hidden transition-all transition-discrete duration-150 ease-in-out z-0 justify-evenly gap-4 ${headerDrawerToggled ? "translate-y-16 visible opacity-100" : "translate-y-0 invisible opacity-0"}`}
      >
        <div className="flex flex-row">
          <div className="bg-black px-4 py-2 rounded-md hover:bg-[#1E1E1E] transition ease-in-out duration:300 min-[400px]:hidden">
            <button onClick={(e) => handleScroll(e, "modes")}>
              <p className={`text-xl ${geistMono.className} antialiased`}>
                Modes
              </p>
            </button>
          </div>
          <div className="bg-black px-4 py-2 rounded-md hover:bg-[#1E1E1E] transition ease-in-out duration:300 min-[400px]:hidden">
            <Link href="/about">
              <p className={`text-xl ${geistMono.className} antialiased`}>
                About
              </p>
            </Link>
          </div>
        </div>
        <div className="flex flex-row h-full justify-center items-center w-fit gap-3 px-4 sm:hidden">
          <p className={`text-xl ${geistMono.className} antialiased`}>FTC</p>
          <ToggleSwitch checked={isToggled} onChange={setIsToggled} />
          <p className={`text-xl ${geistMono.className} antialiased`}>FRC</p>
        </div>
      </div>
    </div>
  );
}
