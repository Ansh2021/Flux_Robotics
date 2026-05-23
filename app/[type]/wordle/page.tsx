"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";

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
    return <FRCWordle />;
  }

  if (type.toLowerCase() === "ftc") {
    return <FTCWordle />;
  }
}

function FRCWordle() {
  const [frcModalVisible, setFRCModalVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setFRCModalVisible(true);
    }, 1000);
  }, []);

  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="h-[calc(100dvh-4rem)] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold w-fit text-center p-4">
          Welcome to FRCdle
        </h1>
      </div>
      <FRCModal
        frcModalVisible={frcModalVisible}
        setFRCModalVisible={setFRCModalVisible}
      >
        <div className="flex flex-col w-full h-full bg-black justify-center items-center rounded-lg p-10 gap-5">
          <h1 className="font-bold text-2xl">FRCdle</h1>
          <FRCModalAreaInput />
          <FRCModalDifficultyInput />
          <button
            onClick={() => {
              setFRCModalVisible(false);
            }}
            className="group flex rounded-full items-center justify-center h-12 w-30 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300"
          >
            <div className="rounded-full bg-black group-hover:bg-[#111111] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300">
              Confirm
            </div>
          </button>
        </div>
      </FRCModal>
    </main>
  );
}

function FRCModal({
  children,
  frcModalVisible,
  setFRCModalVisible,
}: {
  children: React.ReactNode;
  frcModalVisible: boolean;
  setFRCModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      className={`flex justify-center items-center fixed w-full h-[calc(100dvh-4rem)] transition-colors z-0 ${frcModalVisible ? "visible bg-black/80" : "invisible"}`}
    >
      <div
        className={`absolute transition-all transition-300 p-[3px] bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] rounded-lg h-[50dvh] w-[50dvw] min-w-60 min-h-10 max-w-100 max-h-100 ${frcModalVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
      >
        {children}
      </div>
    </div>
  );
}

const frcAreas = [
  { id: 1, name: "All" },
  { id: 2, name: "California" },
  { id: 3, name: "Chesapeake" },
  { id: 4, name: "Michigan" },
  { id: 5, name: "Texas" },
  { id: 6, name: "Indiana" },
  { id: 7, name: "Mid-Atlantic" },
  { id: 8, name: "North Carolina" },
  { id: 9, name: "South Carolina" },
  { id: 10, name: "Wisconsin" },
  { id: 11, name: "New England" },
  { id: 12, name: "Peachtree" },
  { id: 13, name: "Pacific Northwest" },
  { id: 14, name: "Ontario" },
  { id: 15, name: "Israel" },
  { id: 16, name: "Regionals" },
];

export function FRCModalAreaInput() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(typeof frcAreas)[number] | null>(
    null,
  );

  const filteredAreas =
    query === ""
      ? frcAreas
      : frcAreas.filter((area) => {
          return area.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div id="test" className="mx-auto h-10 w-full">
      <Combobox
        value={selected}
        onChange={(value) => setSelected(value)}
        onClose={() => setQuery("")}
      >
        <div className="relative items-center justify-center">
          <ComboboxInput
            className={clsx(
              "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
              "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-[#0c3c64]",
            )}
            key={selected ? selected.id : "empty"}
            displayValue={(area: (typeof frcAreas)[number] | null) =>
              area?.name ?? ""
            }
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Select an area"
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
          </ComboboxButton>
        </div>

        <ComboboxOptions
          anchor="bottom"
          transition
          className={clsx(
            "w-(--input-width) rounded-xl border border-black bg-[#1E1E1E] p-1 [--anchor-gap:--spacing(1)] empty:invisible",
            "transition duration-100 ease-in data-leave:data-closed:opacity-0 z-2 h-[18dvh] max-h-10 no-scrollbar",
          )}
        >
          {filteredAreas.map((area) => (
            <ComboboxOption
              key={area.id}
              value={area}
              className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
            >
              <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
              <div className="text-sm/6 text-white">{area.name}</div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}

//Should I add more difficulties?
const frcDifficulties = [
  { id: 1, type: "Easy" },
  { id: 2, type: "Medium" },
  { id: 3, type: "Hard" },
];

function FRCModalDifficultyInput() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<
    (typeof frcDifficulties)[number] | null
  >(null);

  const filteredDifficulties =
    query === ""
      ? frcDifficulties
      : frcDifficulties.filter((diff) => {
          return diff.type.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div id="test" className="mx-auto h-10 w-full">
      <Combobox
        value={selected}
        onChange={(value) => setSelected(value)}
        onClose={() => setQuery("")}
      >
        <div className="relative items-center justify-center">
          <ComboboxInput
            className={clsx(
              "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
              "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-[#0c3c64]",
            )}
            key={selected ? selected.id : "empty"}
            displayValue={(diff: (typeof frcDifficulties)[number] | null) =>
              diff?.type ?? ""
            }
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Select a difficulty"
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
          </ComboboxButton>
        </div>

        <ComboboxOptions
          anchor="bottom"
          transition
          className={clsx(
            "w-(--input-width) rounded-xl border border-black bg-[#1E1E1E] p-1 [--anchor-gap:--spacing(1)] empty:invisible",
            "transition duration-100 ease-in data-leave:data-closed:opacity-0 z-2 h-[15dvh] no-scrollbar",
          )}
        >
          {filteredDifficulties.map((diff) => (
            <ComboboxOption
              key={diff.id}
              value={diff}
              className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
            >
              <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
              <div className="text-sm/6 text-white">{diff.type}</div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}

function FTCWordle() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="h-[calc(100dvh-4rem)] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold w-fit text-center p-4">
          Welcome to FTCdle
        </h1>
      </div>
      {/* make the modal actually appear above the content instead of below*/}

      {/* <div id="frc-wordle-modal">
          <p>hi</p>
        </div> */}
    </main>
  );
}
