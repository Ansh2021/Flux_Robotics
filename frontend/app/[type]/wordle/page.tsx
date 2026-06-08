"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton,
} from "@headlessui/react";
import clsx from "clsx";
import {
  ChevronDownIcon,
  CheckIcon,
  Cog6ToothIcon,
} from "@heroicons/react/20/solid";
import { Bounce, toast } from "react-toastify";

//frc difficulty calc (for a certain season only; NOT history)
/* difficulty rating=total sum of award points rating + (norm epa calc + area rank calc)/2
Impact=10; EI=8; Rookie AS=8; Judged Team Awards=5; Non-Judged=0
Event Winner=10; Finalist=8
Norm EPA Calc=
10-((EPA Rank-1)/(Num Teams in Area-1)*9)
Area Rank Calc=
10-((Area Rank-1)/(Num Teams in Area-1)*9)
*/

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
  const [tableVisible, setTableVisible] = useState(false);
  const [forceUpdateTable, setForceUpdateTable] = useState(0);

  const [newTeamInfo, setNewTeamInfo] = useState<NewTeamRow>();

  useEffect(() => {
    async function getSingleFRCTeamData(teamNum: number) {
      try {
        console.log(
          `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/team?number=${teamNum}`,
        );
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/team?number=${teamNum}`,
        );

        if (!res.ok) {
          throw new Error(`Error status: ${res.status}`);
        }

        const data = await res.json();
        console.log(data);
        setNewTeamInfo(data);
        return data;
      } catch (error: any) {
        console.error(error);
        return;
      }
    }
    getSingleFRCTeamData(4414);
    setTimeout(() => {
      setFRCModalVisible(true);
    }, 1000);
  }, []);

  const [frcSelectedArea, setFRCSelectedArea] = useState<
    (typeof frcAreas)[number] | null
  >(null);
  const [frcSelectedDifficulty, setFRCSelectedDifficulty] = useState<
    (typeof frcDifficulties)[number] | null
  >(null);

  //Insufficient area/difficulty information
  const insufficientInfo = () => {
    toast.error("Please indicate a valid district/region and/or difficulty", {
      theme: "dark",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      transition: Bounce,
    });
  };

  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="h-[calc(100dvh-4rem)] flex flex-col items-center justify-center">
        <div className="flex flex-row items-center justify-center">
          <h1 className="text-3xl font-bold w-fit text-center p-4">
            Welcome to FRCdle
          </h1>
          {/* <button
          onClick={() => {
            setFRCModalVisible(true);
          }}
          className="group flex rounded-full items-center justify-center h-10 w-10 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300"
        >
          <div className="rounded-full bg-black group-hover:bg-[#111111] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300">
            <Cog6ToothIcon className="fill-white size-4" />
          </div>
        </button> */}
          <button
            onClick={() => {
              setFRCModalVisible(true);
            }}
            className="flex rounded-md items-center justify-center h-10 w-10 bg-black hover:bg-[#1E1E1E] transition ease-in-out duration-300 text-base"
          >
            <Cog6ToothIcon className="fill-white size-5" />
          </button>
        </div>
        {tableVisible && (
          <div className="flex flex-row items-center justify-center">
            <FRCdleTable
              forceUpdateTable={forceUpdateTable}
              frcSelectedArea={frcSelectedArea}
              newTeam={newTeamInfo}
            />
          </div>
        )}
      </div>
      <FRCModal frcModalVisible={frcModalVisible}>
        <div className="flex flex-col w-full h-full bg-black justify-center items-center rounded-lg p-10 gap-5">
          <h1 className="font-bold text-2xl">FRCdle</h1>
          <FRCModalAreaInput
            frcSelectedArea={frcSelectedArea}
            setFRCSelectedArea={setFRCSelectedArea}
          />
          <FRCModalDifficultyInput
            frcSelectedDifficulty={frcSelectedDifficulty}
            setFRCSelectedDifficulty={setFRCSelectedDifficulty}
          />
          <button
            onClick={() => {
              if (!(frcSelectedArea || frcSelectedDifficulty)) {
                insufficientInfo();
                return;
              }
              setFRCModalVisible(false);
              setTableVisible(true);
              setForceUpdateTable((cur) => cur + 1);
              console.log("Area: " + frcSelectedArea?.name);
              console.log("Difficulty: " + frcSelectedDifficulty?.type);
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
}: {
  children: React.ReactNode;
  frcModalVisible: boolean;
}) {
  return (
    <div
      className={`flex justify-center items-center fixed w-full h-[calc(100dvh-4rem)] transition-colors z-0 ${frcModalVisible ? "visible bg-black/80" : "invisible"}`}
    >
      <div
        className={`absolute transition-all transition-300 p-[3px] bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] rounded-lg h-[50dvh] w-[50dvw] portrait:min-w-60 portrait:min-h-10 portrait:max-w-100 portrait:max-h-100 landscape:min-h-60 landscape:min-w-10 landscape:max-h-100 landscape:max-w-100 ${frcModalVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
      >
        {children}
      </div>
    </div>
  );
}

//For all, I have to query every single district (and figure out how to include regionals)
//Districts: https://www.thebluealliance.com/api/v3/district/2026pch/rankings
//Regionals: https://www.thebluealliance.com/api/v3/regional_advancement/2026/rankings
/* I'm looking at rankings here because the better the team's rank, the higher their difficulty
rating will be (makes them easier to guess).
*/

//Took this directly from statbotics
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

function FRCModalAreaInput({
  frcSelectedArea,
  setFRCSelectedArea,
}: {
  frcSelectedArea: (typeof frcAreas)[number] | null;
  setFRCSelectedArea: React.Dispatch<
    React.SetStateAction<(typeof frcAreas)[number] | null>
  >;
}) {
  const [query, setQuery] = useState("");
  // const [frcSelectedArea, setFRCSelectedArea] = useState<(typeof frcAreas)[number] | null>(
  //   null,
  // );

  const filteredAreas =
    query === ""
      ? frcAreas
      : frcAreas.filter((area) => {
          return area.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div id="test" className="mx-auto h-10 w-full">
      <Combobox
        value={frcSelectedArea}
        onChange={(value) => setFRCSelectedArea(value)}
        onClose={() => setQuery("")}
      >
        <div className="relative items-center justify-center">
          <ComboboxInput
            className={clsx(
              "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
              "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-[#0c3c64]",
            )}
            key={frcSelectedArea ? frcSelectedArea.id : "empty"}
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

function FRCModalDifficultyInput({
  frcSelectedDifficulty,
  setFRCSelectedDifficulty,
}: {
  frcSelectedDifficulty: (typeof frcDifficulties)[number] | null;
  setFRCSelectedDifficulty: React.Dispatch<
    React.SetStateAction<(typeof frcDifficulties)[number] | null>
  >;
}) {
  const [query, setQuery] = useState("");
  // const [frcSelectedDifficulty, setFRCSelectedDifficulty] = useState<
  //   (typeof frcDifficulties)[number] | null
  // >(null);

  const filteredDifficulties =
    query === ""
      ? frcDifficulties
      : frcDifficulties.filter((diff) => {
          return diff.type.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div id="test" className="mx-auto h-10 w-full">
      <Combobox
        value={frcSelectedDifficulty}
        onChange={(value) => setFRCSelectedDifficulty(value)}
        onClose={() => setQuery("")}
      >
        <div className="relative items-center justify-center">
          <ComboboxInput
            className={clsx(
              "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
              "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-[#0c3c64]",
            )}
            key={frcSelectedDifficulty ? frcSelectedDifficulty.id : "empty"}
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

//team num (user/tba)
//team name (tba)
/*Area (when playing with all teams) (https://www.thebluealliance.com/api/v3/team/frc4188/districts 
take the last entry and if it is not of the cur year, they're in a regional)*/
//rookie year (tba works)
//years competing w/ first (blue alliance) (https://www.thebluealliance.com/api/v3/team/frc1833/years_participated)
//unitless epa (cur year) (statbotics)
//EPA (unitless/normal too) rank (cur year) (statbotics)
//Award Num? (blue alliance) (this year only just for consistency)

interface NewTeamRow {
  area: string;
  awardNum: number;
  epaRank: number;
  numYearsParticipating: number;
  rookieYear: number;
  teamName: string;
  teamNum: number;
  unitlessEPA: number;
}

function FRCdleTable({
  forceUpdateTable,
  frcSelectedArea,
  newTeam,
}: {
  forceUpdateTable: number;
  frcSelectedArea: (typeof frcAreas)[number] | null;
  newTeam: NewTeamRow | null;
}) {
  // console.log(frcSelectedArea?.name === "All");
  // console.log(frcSelectedArea?.name);

  return (
    <table key={forceUpdateTable} className="border-2 border-[#0c3c64]">
      <thead>
        <tr>
          <th className="border-2 border-[#0c3c64]">Team Number</th>
          <th className="border-2 border-[#0c3c64]">Team Name</th>
          {frcSelectedArea?.name === "All" && (
            <th className="border-2 border-[#0c3c64]">Area</th>
          )}
          <th className="border-2 border-[#0c3c64]">Rookie Year</th>
          <th className="border-2 border-[#0c3c64]">Years Competing</th>
          <th className="border-2 border-[#0c3c64]">Unitless EPA</th>
          <th className="border-2 border-[#0c3c64]">EPA Rank</th>
          <th className="border-2 border-[#0c3c64]">Award Amount</th>
        </tr>
      </thead>
      <tbody className="text-center">
        <tr>
          <td className="border-2 border-[#0c3c64]">{newTeam.teamNum}</td>
          <td className="border-2 border-[#0c3c64]">{newTeam.teamName}</td>
          {frcSelectedArea?.name === "All" && (
            <td className="border-2 border-[#0c3c64]">{newTeam.area}</td>
          )}
          <td className="border-2 border-[#0c3c64]">{newTeam.rookieYear}</td>
          <td className="border-2 border-[#0c3c64]">
            {newTeam.numYearsParticipating}
          </td>
          <td className="border-2 border-[#0c3c64]">{newTeam.unitlessEPA}</td>
          <td className="border-2 border-[#0c3c64]">{newTeam.epaRank}</td>
          <td className="border-2 border-[#0c3c64]">{newTeam.awardNum}</td>
        </tr>
      </tbody>
    </table>
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
