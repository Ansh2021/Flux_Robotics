import { useState, useEffect, useRef } from "react";
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
  ArrowPathIcon,
} from "@heroicons/react/20/solid";
import { Bounce, toast } from "react-toastify";

//frc difficulty calc (for a certain season only; NOT history)
//will probably let the user choose a season later
/*
difficulty calc = (norm epa calc + area rank calc)/2
Norm EPA Calc=
10-((EPA Rank-1)/(Num Teams in Area-1)*9)
Area Rank Calc=
10-((Area Rank-1)/(Num Teams in Area-1)*9)
*/

export default function FRCWordle() {
  const [frcModalVisible, setFRCModalVisible] = useState(false);
  const [frcSuccessModalVisible, setFRCSuccessModalVisible] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [forceUpdateTable, setForceUpdateTable] = useState(0);
  const [resetTable, setResetTable] = useState(0);

  const [correctTeamMessage, setCorrectTeamMessage] = useState("");

  const [updateFRCAreaForTable, setUpdateFRCAreaForTable] = useState(0);

  useEffect(() => {
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
    toast.error("Please indicate a valid area and/or difficulty", {
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
          <h1 className="text-3xl font-bold w-fit text-center p-4">FRCdle</h1>
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
              frcSelectedDifficulty={frcSelectedDifficulty}
              updateArea={updateFRCAreaForTable}
              isModalVisible={frcModalVisible}
              showSuccessModal={() =>
                setFRCSuccessModalVisible(!frcSuccessModalVisible)
              }
              isSuccessModalVisible={frcSuccessModalVisible}
              successMessage={setCorrectTeamMessage}
              resetTable={resetTable}
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
              if (!frcSelectedArea || !frcSelectedDifficulty) {
                insufficientInfo();
                return;
              }
              setFRCModalVisible(false);
              setTableVisible(true);
              setForceUpdateTable((cur) => cur + 1);
              setUpdateFRCAreaForTable((cur) => cur + 1);
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
      <FRCModalSuccess frcSuccessModalVisible={frcSuccessModalVisible}>
        <div className="flex flex-col w-full h-full bg-black justify-center items-center rounded-lg p-10 gap-5">
          <h1 className="font-bold text-2xl">{correctTeamMessage}</h1>
          <div className="flex flex-row w-full justify-around items-center">
            <button
              onClick={() => {
                setFRCSuccessModalVisible(false);
                setResetTable((prev) => prev + 1);
              }}
              className="flex rounded-md items-center justify-center h-10 w-10 bg-black hover:bg-[#1E1E1E] transition ease-in-out duration-300 text-base"
            >
              <ArrowPathIcon className="fill-white size-5" />
            </button>
            <button
              onClick={() => {
                setFRCSuccessModalVisible(false);
                setFRCModalVisible(true);
              }}
              className="flex rounded-md items-center justify-center h-10 w-10 bg-black hover:bg-[#1E1E1E] transition ease-in-out duration-300 text-base"
            >
              <Cog6ToothIcon className="fill-white size-5" />
            </button>
          </div>
        </div>
      </FRCModalSuccess>
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

function FRCModalSuccess({
  children,
  frcSuccessModalVisible,
}: {
  children: React.ReactNode;
  frcSuccessModalVisible: boolean;
}) {
  return (
    <div
      className={`flex justify-center items-center fixed w-full h-[calc(100dvh-4rem)] transition-colors z-0 ${frcSuccessModalVisible ? "visible bg-black/80" : "invisible"}`}
    >
      <div
        className={`absolute transition-all transition-300 p-[3px] bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] rounded-lg h-[50dvh] w-[50dvw] portrait:min-w-60 portrait:min-h-10 portrait:max-w-100 portrait:max-h-100 landscape:min-h-60 landscape:min-w-10 landscape:max-h-100 landscape:max-w-100 ${frcSuccessModalVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
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

interface NewTeam {
  area: string;
  areaRank: number;
  awardNum: number;
  epaRank: number;
  totalNumTeams: number;
  numYearsParticipating: number;
  rookieYear: number;
  teamName: string;
  teamNum: number;
  unitlessEPA: number;
  worldEPARank: number;
}

interface GuessResults {
  area: boolean;
  areaRank: number;
  awardNum: number;
  epaRank: number;
  numYearsParticipating: number;
  rookieYear: number;
  teamName: boolean;
  teamNum: number;
  unitlessEPA: number;
  worldEPARank: number;
}

interface AreaData {
  teamNum: number;
  teamName: string;
  rookieYear: number;
  unitlessEPA: number;
  epaRank: number;
  worldEPARank: number;
  areaRank: number;
  totalNumTeams: number;
}

interface AreaDictionary {
  [key: string]: string;
}

const AreaCodeLookUp: AreaDictionary = {
  All: "all",
  California: "ca",
  Chesapeake: "fch",
  Michigan: "fim",
  Texas: "fit",
  Indiana: "fin",
  "Mid-Atlantic": "fma",
  "North Carolina": "fnc",
  "South Carolina": "fsc",
  Wisconsin: "win",
  "New England": "ne",
  Peachtree: "pch",
  "Pacific Northwest": "pnw",
  Ontario: "ont",
  Israel: "isr",
  Regionals: "regionals",
};

function FRCdleTable({
  forceUpdateTable,
  frcSelectedArea,
  frcSelectedDifficulty,
  updateArea,
  isModalVisible,
  showSuccessModal,
  isSuccessModalVisible,
  successMessage,
  resetTable,
}: {
  forceUpdateTable: number;
  frcSelectedArea: (typeof frcAreas)[number] | null;
  frcSelectedDifficulty: (typeof frcDifficulties)[number] | null;
  updateArea: number;
  isModalVisible: boolean;
  showSuccessModal: () => void;
  isSuccessModalVisible: boolean;
  successMessage: (message: string) => void;
  resetTable: number;
}) {
  //TODO: implement input filtering based on selected area
  const [guessInput, setGuessInput] = useState("");
  const [updateTableWithClick, setUpdateTableWithClick] = useState(0);

  const [frcAreaData, setFRCAreaData] = useState<AreaData[][]>([]);
  const [allFRCAreaData, setAllFRCAreaData] = useState<AreaData[]>([]);
  const [regionalFRCAreaData, setRegionalFRCAreaData] = useState<AreaData[]>(
    [],
  );
  const [lastRequestedArea, setLastRequestedArea] = useState<String[]>([]);
  const [lastRequestedDifficulty, setLastRequestedDifficulty] = useState("");
  const [isAreaRequestLoading, setIsAreaRequestLoading] = useState(false);
  const canGetAreaData = useRef(false);

  const [areaRequestFailed, setAreaRequestFailed] = useState<Boolean[]>([]);

  const [randomTeam, setRandomTeam] = useState<NewTeam>();
  const [allRequestedTeams, setAllRequestedTeams] = useState<number[]>([]);
  const [guessResults, setGuessResults] = useState<GuessResults[]>([]);
  const [guessAmount, setGuessAmount] = useState(0);

  const [tableRows, setTableRows] = useState<NewTeam[]>([]);

  useEffect(() => {
    // async function getSingleFRCTeamData(teamNum: number) {
    //   try {
    //     if (isAreaRequestLoading) {
    //       errorToast("Please wait for the area data to load");
    //       setGuessAmount(prev => prev + 1);
    //       return;
    //     }
    //     if (allRequestedTeams.includes(teamNum)) {
    //       throw new Error("This team has already been guessed");
    //     }
    //     const res = await fetch(
    //       `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/team?number=${teamNum}`,
    //     );

    //     if (!res.ok) {
    //       throw new Error(`Error status: ${res.status}`);
    //     }

    //     const data = (await res.json()) as NewTeam;
    //     console.log(data);
    //     setTableRows([...tableRows, data]);
    //     setAllRequestedTeams([...allRequestedTeams, teamNum]);
    //   } catch (error: any) {
    //     console.error(error);
    //     throw new Error(error);
    //     // errorToast(
    //     //   "Internal server error. Make sure you inputted a valid team.",
    //     // );
    //   } finally {
    //     setGuessInput("");
    //   }
    // }

    async function getSingleFRCTeamData(teamNum: number) {
      if (allRequestedTeams.includes(teamNum)) {
        throw new Error("Team has already been guessed");
      }
      setGuessAmount((prev) => prev + 1);

      const data: NewTeam[] = [];
      if (teamNum === 4188) {
        data.push({
          area: "Peachtree",
          areaRank: 5,
          awardNum: 7,
          epaRank: 7,
          totalNumTeams: 74,
          numYearsParticipating: 15,
          rookieYear: 2012,
          teamName: "Columbus Space Program",
          teamNum: 4188,
          unitlessEPA: 1727,
          worldEPARank: 352,
        });
      } else if (teamNum === 1771) {
        data.push({
          area: "Peachtree",
          areaRank: 2,
          awardNum: 5,
          epaRank: 3,
          totalNumTeams: 74,
          numYearsParticipating: 20,
          rookieYear: 2006,
          teamName: "North Gwinnett Robotics",
          teamNum: 1771,
          unitlessEPA: 1881,
          worldEPARank: 121,
        });
      } else if (teamNum === 1833) {
        data.push({
          area: "Peachtree",
          areaRank: 1,
          awardNum: 7,
          epaRank: 1,
          totalNumTeams: 74,
          numYearsParticipating: 2,
          rookieYear: 2006,
          teamName: "Team BEAN",
          teamNum: 1833,
          unitlessEPA: 2006,
          worldEPARank: 35,
        });
      } else if (teamNum === 1002) {
        data.push({
          area: "Peachtree",
          areaRank: 4,
          awardNum: 6,
          epaRank: 2,
          totalNumTeams: 74,
          numYearsParticipating: 24,
          rookieYear: 2003,
          teamName: "CircuitRunners Robotics",
          teamNum: 1002,
          unitlessEPA: 1890,
          worldEPARank: 112,
        });
      } else if (teamNum === 6919) {
        data.push({
          area: "Peachtree",
          areaRank: 3,
          awardNum: 6,
          epaRank: 5,
          totalNumTeams: 74,
          numYearsParticipating: 9,
          rookieYear: 2018,
          teamName: "The Commodores",
          teamNum: 6919,
          unitlessEPA: 1783,
          worldEPARank: 250,
        });
      } else if (teamNum === 1261) {
        data.push({
          area: "Peachtree",
          areaRank: 8,
          awardNum: 2,
          epaRank: 4,
          totalNumTeams: 74,
          numYearsParticipating: 23,
          rookieYear: 2004,
          teamName: "Robo Lions Team1261",
          teamNum: 1261,
          unitlessEPA: 1833,
          worldEPARank: 179,
        });
      } else if (teamNum === 2974) {
        data.push({
          area: "Peachtree",
          areaRank: 6,
          awardNum: 7,
          epaRank: 6,
          totalNumTeams: 74,
          numYearsParticipating: 19,
          rookieYear: 2009,
          teamName: "Walton Robotics",
          teamNum: 2974,
          unitlessEPA: 1775,
          worldEPARank: 265,
        });
      } else if (teamNum === 4189) {
        data.push({
          area: "Peachtree",
          areaRank: 7,
          awardNum: 2,
          epaRank: 8,
          totalNumTeams: 74,
          numYearsParticipating: 15,
          rookieYear: 2012,
          teamName: "Chargers",
          teamNum: 4189,
          unitlessEPA: 1718,
          worldEPARank: 376,
        });
      }

      setTableRows([...tableRows, data[0]]);
      setAllRequestedTeams([...allRequestedTeams, teamNum]);
    }

    if (guessInput) {
      toast.promise(
        getSingleFRCTeamData(parseInt(guessInput)),
        {
          pending: "Fetching team data...",
          success: "Team fetched successfully",
          error: `${!allRequestedTeams.includes(parseInt(guessInput)) ? "Team data failed to fetch" : "Team has already been guessed"}`,
        },
        {
          theme: "dark",
          hideProgressBar: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          transition: Bounce,
          autoClose: 1000,
        },
      );
    }
  }, [updateTableWithClick]);

  useEffect(() => {
    //Negative values mean you have to go up, positive means go down
    if (tableRows.length > 0) {
      const results: GuessResults = {
        area: tableRows[tableRows.length - 1]?.area === randomTeam?.area,
        areaRank:
          tableRows[tableRows.length - 1]?.areaRank - randomTeam?.areaRank,
        awardNum:
          tableRows[tableRows.length - 1]?.awardNum - randomTeam?.awardNum,
        epaRank: tableRows[tableRows.length - 1]?.epaRank - randomTeam?.epaRank,
        numYearsParticipating:
          tableRows[tableRows.length - 1]?.numYearsParticipating -
          randomTeam?.numYearsParticipating,
        rookieYear:
          tableRows[tableRows.length - 1]?.rookieYear - randomTeam?.rookieYear,
        teamName:
          tableRows[tableRows.length - 1]?.teamName === randomTeam?.teamName,
        teamNum: tableRows[tableRows.length - 1]?.teamNum - randomTeam?.teamNum,
        unitlessEPA:
          tableRows[tableRows.length - 1]?.unitlessEPA -
          randomTeam?.unitlessEPA,
        worldEPARank:
          tableRows[tableRows.length - 1]?.worldEPARank -
          randomTeam?.worldEPARank,
      };
      setGuessResults([...guessResults, results]);
      // console.log("table rows", tableRows);
    }
  }, [tableRows]);

  useEffect(() => {
    //TODO: uncomment the function below pls
    // async function getAreaFRCData(area: string) {
    //   try {
    //     // if (
    //     //   frcSelectedDifficulty.type === lastRequestedDifficulty ||
    //     //   frcSelectedArea.name ===
    //     //     lastRequestedArea[lastRequestedArea.length - 1]
    //     // ) {
    //     // throw new Error("Tried unnecessarily refetching area");

    //     setAreaRequestFailed([...areaRequestFailed, false]);
    //     setIsAreaRequestLoading(true);
    //     if (area !== "all") {
    //       if (
    //         (area === "regionals" && regionalFRCAreaData.length === 0) ||
    //         area !== "regionals"
    //       ) {
    //         const res = await fetch(
    //           `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/multiple?district=${area}`,
    //         );

    //         if (!res.ok) {
    //           throw new Error(`Error status: ${res.status}`);
    //         }

    //         const data = (await res.json()) as AreaData[];
    //         console.log(data);
    //         if (area === "regionals") {
    //           setRegionalFRCAreaData(data);
    //           return;
    //         } else {
    //           setFRCAreaData((previousData) => [...previousData, data]);
    //           return;
    //         }
    //       } else {
    //         return;
    //       }
    //     } else if (allFRCAreaData.length === 0) {
    //       let resCA;
    //       if (!lastRequestedArea.includes("ca")) {
    //         resCA = await fetch(
    //           `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/multiple?district=ca`,
    //         );

    //         if (!resCA.ok) {
    //           throw new Error(`Error status: ${resCA.status}`);
    //         }
    //       }

    //       const dataCA = !lastRequestedArea.includes("ca")
    //         ? await resCA.json()
    //         : frcAreaData[lastRequestedArea.indexOf("ca")];

    //       let resFCH;
    //       if (!lastRequestedArea.includes("fch")) {
    //         resFCH = await fetch(
    //           `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/multiple?district=fch`,
    //         );

    //         if (!resFCH.ok) {
    //           throw new Error(`Error status: ${resFCH.status}`);
    //         }
    //       }

    //       const dataFCH = !lastRequestedArea.includes("fch")
    //         ? await resFCH.json()
    //         : frcAreaData[lastRequestedArea.indexOf("fch")];

    //       let resFIM;
    //       if (!lastRequestedArea.includes("fim")) {
    //         resFIM = await fetch(
    //           `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/multiple?district=fim`,
    //         );

    //         if (!resFIM.ok) {
    //           throw new Error(`Error status: ${resFIM.status}`);
    //         }
    //       }

    //       const dataFIM = !lastRequestedArea.includes("fim")
    //         ? await resFIM.json()
    //         : frcAreaData[lastRequestedArea.indexOf("fim")];

    //       let resFIN;
    //       if (!lastRequestedArea.includes("fin")) {
    //         resFIN = await fetch(
    //           `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/multiple?district=fin`,
    //         );

    //         if (!resFIN.ok) {
    //           throw new Error(`Error status: ${resFIN.status}`);
    //         }
    //       }

    //       const dataFIN = !lastRequestedArea.includes("fin")
    //         ? await resFIN.json()
    //         : frcAreaData[lastRequestedArea.indexOf("fin")];

    //       let resFIT;
    //       if (!lastRequestedArea.includes("fit")) {
    //         resFIT = await fetch(
    //           `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/multiple?district=fit`,
    //         );

    //         if (!resFIT.ok) {
    //           throw new Error(`Error status: ${resFIT.status}`);
    //         }
    //       }

    //       const dataFIT = !lastRequestedArea.includes("fit")
    //         ? await resFIT.json()
    //         : frcAreaData[lastRequestedArea.indexOf("fit")];

    //       let resFMA;
    //       if (!lastRequestedArea.includes("fma")) {
    //         resFMA = await fetch(
    //           `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/multiple?district=fma`,
    //         );

    //         if (!resFMA.ok) {
    //           throw new Error(`Error status: ${resFMA.status}`);
    //         }
    //       }

    //       const dataFMA = !lastRequestedArea.includes("fma")
    //         ? await resFMA.json()
    //         : frcAreaData[lastRequestedArea.indexOf("fma")];

    //       let resFNC;
    //       if (!lastRequestedArea.includes("fnc")) {
    //         resFNC = await fetch(
    //           `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/multiple?district=fnc`,
    //         );

    //         if (!resFNC.ok) {
    //           throw new Error(`Error status: ${resFNC.status}`);
    //         }
    //       }

    //       const dataFNC = !lastRequestedArea.includes("fnc")
    //         ? await resFNC.json()
    //         : frcAreaData[lastRequestedArea.indexOf("fnc")];

    //       let resFSC;
    //       if (!lastRequestedArea.includes("fsc")) {
    //         resFSC = await fetch(
    //           `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/multiple?district=fsc`,
    //         );

    //         if (!resFSC.ok) {
    //           throw new Error(`Error status: ${resFSC.status}`);
    //         }
    //       }

    //       const dataFSC = !lastRequestedArea.includes("fsc")
    //         ? await resFSC.json()
    //         : frcAreaData[lastRequestedArea.indexOf("fsc")];

    //       let resISR;
    //       if (!lastRequestedArea.includes("isr")) {
    //         resISR = await fetch(
    //           `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/multiple?district=isr`,
    //         );

    //         if (!resISR.ok) {
    //           throw new Error(`Error status: ${resISR.status}`);
    //         }
    //       }

    //       const dataISR = !lastRequestedArea.includes("isr")
    //         ? await resISR.json()
    //         : frcAreaData[lastRequestedArea.indexOf("isr")];

    //       let resNE;
    //       if (!lastRequestedArea.includes("ne")) {
    //         resNE = await fetch(
    //           `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/multiple?district=ne`,
    //         );

    //         if (!resNE.ok) {
    //           throw new Error(`Error status: ${resNE.status}`);
    //         }
    //       }

    //       const dataNE = !lastRequestedArea.includes("ne")
    //         ? await resNE.json()
    //         : frcAreaData[lastRequestedArea.indexOf("ne")];

    //       let resONT;
    //       if (!lastRequestedArea.includes("ont")) {
    //         resONT = await fetch(
    //           `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/multiple?district=ont`,
    //         );

    //         if (!resONT.ok) {
    //           throw new Error(`Error status: ${resONT.status}`);
    //         }
    //       }

    //       const dataONT = !lastRequestedArea.includes("ont")
    //         ? await resONT.json()
    //         : frcAreaData[lastRequestedArea.indexOf("ont")];

    //       let resPCH;
    //       if (!lastRequestedArea.includes("pch")) {
    //         resPCH = await fetch(
    //           `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/multiple?district=pch`,
    //         );

    //         if (!resPCH.ok) {
    //           throw new Error(`Error status: ${resPCH.status}`);
    //         }
    //       }

    //       const dataPCH = !lastRequestedArea.includes("pch")
    //         ? await resPCH.json()
    //         : frcAreaData[lastRequestedArea.indexOf("pch")];

    //       let resPNW;
    //       if (!lastRequestedArea.includes("pnw")) {
    //         resPNW = await fetch(
    //           `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/multiple?district=pnw`,
    //         );

    //         if (!resPNW.ok) {
    //           throw new Error(`Error status: ${resPNW.status}`);
    //         }
    //       }

    //       const dataPNW = !lastRequestedArea.includes("pnw")
    //         ? await resPNW.json()
    //         : frcAreaData[lastRequestedArea.indexOf("pnw")];

    //       let resWIN;
    //       if (!lastRequestedArea.includes("win")) {
    //         resWIN = await fetch(
    //           `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/multiple?district=win`,
    //         );

    //         if (!resWIN.ok) {
    //           throw new Error(`Error status: ${resWIN.status}`);
    //         }
    //       }

    //       const dataWIN = !lastRequestedArea.includes("win")
    //         ? await resWIN.json()
    //         : frcAreaData[lastRequestedArea.indexOf("win")];

    //       let resRegionals;
    //       if (!lastRequestedArea.includes("regionals")) {
    //         resRegionals = await fetch(
    //           `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/multiple?district=regionals`,
    //         );

    //         if (!resRegionals.ok) {
    //           throw new Error(`Error status: ${resRegionals.status}`);
    //         }
    //       }

    //       const dataRegionals = !lastRequestedArea.includes("regionals")
    //         ? await resRegionals.json()
    //         : regionalFRCAreaData;

    //       const allData = [
    //         ...dataCA,
    //         ...dataFCH,
    //         ...dataFIM,
    //         ...dataFIN,
    //         ...dataFIT,
    //         ...dataFMA,
    //         ...dataFNC,
    //         ...dataFSC,
    //         ...dataISR,
    //         ...dataNE,
    //         ...dataONT,
    //         ...dataPCH,
    //         ...dataPNW,
    //         ...dataWIN,
    //         ...dataRegionals,
    //       ];

    //       const useableData = allData.sort((a, b) => a.teamNum - b.teamNum);
    //       setAllFRCAreaData(useableData);
    //       console.log(useableData);
    //     }
    //     // }
    //   } catch (error: any) {
    //     console.error(error);
    //     setAreaRequestFailed((oldRequestStatusArray) => {
    //       const newRequestStatusArray = [...oldRequestStatusArray];
    //       newRequestStatusArray[newRequestStatusArray.length - 1] = true;
    //       return newRequestStatusArray;
    //     });
    //     throw new Error(error);
    //     // errorToast("Internal server error.");
    //   } finally {
    //     setIsAreaRequestLoading(false);
    //   }
    // }

    if (!canGetAreaData.current) {
      canGetAreaData.current = true;

      if (lastRequestedDifficulty !== frcSelectedDifficulty.type) {
        setLastRequestedDifficulty(frcSelectedDifficulty.type);
      }

      if (
        lastRequestedArea[lastRequestedArea.length - 1] !==
          frcSelectedArea.name ||
        lastRequestedDifficulty !== frcSelectedDifficulty.type
      ) {
        setTableRows([]);
        setAllRequestedTeams([]);
        setGuessResults([]);
        setGuessInput("");
      }

      // if (!lastRequestedArea.includes(AreaCodeLookUp[frcSelectedArea.name])) {
      //   toast.promise(
      //     getAreaFRCData(AreaCodeLookUp[frcSelectedArea.name]),
      //     {
      //       pending: "Fetching area data...",
      //       success: "Area fetched successfully",
      //       error: "Area data failed to fetch",
      //     },
      //     {
      //       theme: "dark",
      //       hideProgressBar: false,
      //       pauseOnHover: false,
      //       draggable: true,
      //       progress: undefined,
      //       transition: Bounce,
      //       autoClose: 2000,
      //     },
      //   );

      //   if (!areaRequestFailed[areaRequestFailed.length - 1]) {
      //     setLastRequestedArea([
      //       ...lastRequestedArea,
      //       AreaCodeLookUp[frcSelectedArea.name],
      //     ]);
      //   }
      // } else {
      //   console.log("I will not be refetching the same district.");
      //   console.log("Stop trying to flag my TBA API key.");
      // }

      //TODO: remove this hardcoded data function
      async function getRandomTeamData(teamNum: number) {
        const data: NewTeam[] = [];
        if (teamNum === 4188) {
          data.push({
            area: "Peachtree",
            areaRank: 5,
            awardNum: 7,
            epaRank: 7,
            totalNumTeams: 74,
            numYearsParticipating: 15,
            rookieYear: 2012,
            teamName: "Columbus Space Program",
            teamNum: 4188,
            unitlessEPA: 1727,
            worldEPARank: 352,
          });
        } else if (teamNum === 1771) {
          data.push({
            area: "Peachtree",
            areaRank: 2,
            awardNum: 5,
            epaRank: 3,
            totalNumTeams: 74,
            numYearsParticipating: 20,
            rookieYear: 2006,
            teamName: "North Gwinnett Robotics",
            teamNum: 1771,
            unitlessEPA: 1881,
            worldEPARank: 121,
          });
        } else if (teamNum === 1833) {
          data.push({
            area: "Peachtree",
            areaRank: 1,
            awardNum: 7,
            epaRank: 1,
            totalNumTeams: 74,
            numYearsParticipating: 2,
            rookieYear: 2006,
            teamName: "Team BEAN",
            teamNum: 1833,
            unitlessEPA: 2006,
            worldEPARank: 35,
          });
        } else if (teamNum === 1002) {
          data.push({
            area: "Peachtree",
            areaRank: 4,
            awardNum: 6,
            epaRank: 2,
            totalNumTeams: 74,
            numYearsParticipating: 24,
            rookieYear: 2003,
            teamName: "CircuitRunners Robotics",
            teamNum: 1002,
            unitlessEPA: 1890,
            worldEPARank: 112,
          });
        } else if (teamNum === 6919) {
          data.push({
            area: "Peachtree",
            areaRank: 3,
            awardNum: 6,
            epaRank: 5,
            totalNumTeams: 74,
            numYearsParticipating: 9,
            rookieYear: 2018,
            teamName: "The Commodores",
            teamNum: 6919,
            unitlessEPA: 1783,
            worldEPARank: 250,
          });
        } else if (teamNum === 1261) {
          data.push({
            area: "Peachtree",
            areaRank: 8,
            awardNum: 2,
            epaRank: 4,
            totalNumTeams: 74,
            numYearsParticipating: 23,
            rookieYear: 2004,
            teamName: "Robo Lions Team1261",
            teamNum: 1261,
            unitlessEPA: 1833,
            worldEPARank: 179,
          });
        } else if (teamNum === 2974) {
          data.push({
            area: "Peachtree",
            areaRank: 6,
            awardNum: 7,
            epaRank: 6,
            totalNumTeams: 74,
            numYearsParticipating: 19,
            rookieYear: 2009,
            teamName: "Walton Robotics",
            teamNum: 2974,
            unitlessEPA: 1775,
            worldEPARank: 265,
          });
        } else if (teamNum === 4189) {
          data.push({
            area: "Peachtree",
            areaRank: 7,
            awardNum: 2,
            epaRank: 8,
            totalNumTeams: 74,
            numYearsParticipating: 15,
            rookieYear: 2012,
            teamName: "Chargers",
            teamNum: 4189,
            unitlessEPA: 1718,
            worldEPARank: 376,
          });
        }

        setRandomTeam(data[0]);
        // console.log("random team", data[0]);
      }

      const valTeams = [4188, 1261, 1771, 1833, 2974, 1002, 4189, 6919];
      getRandomTeamData(valTeams[Math.floor(Math.random() * valTeams.length)]);
      setGuessAmount(0);
    }
    //TODO: remove resetTable from the array if it breaks with the actual getArea function uncommented
  }, [updateArea]);

  useEffect(() => {
    setTableRows([]);
    setAllRequestedTeams([]);
    setGuessResults([]);
    setGuessInput("");
    async function getRandomTeamData(teamNum: number) {
      const data: NewTeam[] = [];
      if (teamNum === 4188) {
        data.push({
          area: "Peachtree",
          areaRank: 5,
          awardNum: 7,
          epaRank: 7,
          totalNumTeams: 74,
          numYearsParticipating: 15,
          rookieYear: 2012,
          teamName: "Columbus Space Program",
          teamNum: 4188,
          unitlessEPA: 1727,
          worldEPARank: 352,
        });
      } else if (teamNum === 1771) {
        data.push({
          area: "Peachtree",
          areaRank: 2,
          awardNum: 5,
          epaRank: 3,
          totalNumTeams: 74,
          numYearsParticipating: 20,
          rookieYear: 2006,
          teamName: "North Gwinnett Robotics",
          teamNum: 1771,
          unitlessEPA: 1881,
          worldEPARank: 121,
        });
      } else if (teamNum === 1833) {
        data.push({
          area: "Peachtree",
          areaRank: 1,
          awardNum: 7,
          epaRank: 1,
          totalNumTeams: 74,
          numYearsParticipating: 2,
          rookieYear: 2006,
          teamName: "Team BEAN",
          teamNum: 1833,
          unitlessEPA: 2006,
          worldEPARank: 35,
        });
      } else if (teamNum === 1002) {
        data.push({
          area: "Peachtree",
          areaRank: 4,
          awardNum: 6,
          epaRank: 2,
          totalNumTeams: 74,
          numYearsParticipating: 24,
          rookieYear: 2003,
          teamName: "CircuitRunners Robotics",
          teamNum: 1002,
          unitlessEPA: 1890,
          worldEPARank: 112,
        });
      } else if (teamNum === 6919) {
        data.push({
          area: "Peachtree",
          areaRank: 3,
          awardNum: 6,
          epaRank: 5,
          totalNumTeams: 74,
          numYearsParticipating: 9,
          rookieYear: 2018,
          teamName: "The Commodores",
          teamNum: 6919,
          unitlessEPA: 1783,
          worldEPARank: 250,
        });
      } else if (teamNum === 1261) {
        data.push({
          area: "Peachtree",
          areaRank: 8,
          awardNum: 2,
          epaRank: 4,
          totalNumTeams: 74,
          numYearsParticipating: 23,
          rookieYear: 2004,
          teamName: "Robo Lions Team1261",
          teamNum: 1261,
          unitlessEPA: 1833,
          worldEPARank: 179,
        });
      } else if (teamNum === 2974) {
        data.push({
          area: "Peachtree",
          areaRank: 6,
          awardNum: 7,
          epaRank: 6,
          totalNumTeams: 74,
          numYearsParticipating: 19,
          rookieYear: 2009,
          teamName: "Walton Robotics",
          teamNum: 2974,
          unitlessEPA: 1775,
          worldEPARank: 265,
        });
      } else if (teamNum === 4189) {
        data.push({
          area: "Peachtree",
          areaRank: 7,
          awardNum: 2,
          epaRank: 8,
          totalNumTeams: 74,
          numYearsParticipating: 15,
          rookieYear: 2012,
          teamName: "Chargers",
          teamNum: 4189,
          unitlessEPA: 1718,
          worldEPARank: 376,
        });
      }

      setRandomTeam(data[0]);
      // console.log("random team", data[0]);
    }

    const valTeams = [4188, 1261, 1771, 1833, 2974, 1002, 4189, 6919];
    getRandomTeamData(valTeams[Math.floor(Math.random() * valTeams.length)]);
    console.log("New random team generated.");
  }, [resetTable]);

  useEffect(() => {
    if (
      (frcAreaData &&
        frcAreaData.length > 0 &&
        AreaCodeLookUp[frcSelectedArea.name] !== "all" &&
        AreaCodeLookUp[frcSelectedArea.name] !== "regionals") ||
      (allFRCAreaData &&
        allFRCAreaData.length > 0 &&
        AreaCodeLookUp[frcSelectedArea.name] === "all") ||
      (regionalFRCAreaData &&
        regionalFRCAreaData.length > 0 &&
        AreaCodeLookUp[frcSelectedArea.name] === "regionals")
    ) {
      const difficultyCalculations: {
        teamNum: number;
        difficultyCalc: number;
        highestValue: number;
      }[] = [];

      if (AreaCodeLookUp[frcSelectedArea.name] === "all") {
        for (let i = 0; i < allFRCAreaData.length; i++) {
          const difficultyCalc =
            allFRCAreaData.length - (allFRCAreaData[i].worldEPARank - 1);
          difficultyCalculations.push({
            teamNum: allFRCAreaData[i].teamNum,
            difficultyCalc: difficultyCalc,
            highestValue: allFRCAreaData.length,
          });
        }
      } else if (AreaCodeLookUp[frcSelectedArea.name] === "regionals") {
        for (let i = 0; i < regionalFRCAreaData.length; i++) {
          const difficultyCalc =
            (regionalFRCAreaData.length -
              (regionalFRCAreaData[i].epaRank - 1) +
              (regionalFRCAreaData.length -
                (regionalFRCAreaData[i].areaRank - 1))) /
            2;
          difficultyCalculations.push({
            teamNum: regionalFRCAreaData[i].teamNum,
            difficultyCalc: difficultyCalc,
            highestValue: regionalFRCAreaData.length,
          });
        }
      } else {
        for (let i = 0; i < frcAreaData[frcAreaData.length - 1].length; i++) {
          const difficultyCalc =
            (frcAreaData[frcAreaData.length - 1].length -
              (frcAreaData[frcAreaData.length - 1][i].epaRank - 1) +
              (frcAreaData[frcAreaData.length - 1].length -
                (frcAreaData[frcAreaData.length - 1][i].areaRank - 1))) /
            2;
          difficultyCalculations.push({
            teamNum: frcAreaData[frcAreaData.length - 1][i].teamNum,
            difficultyCalc: difficultyCalc,
            highestValue: frcAreaData[frcAreaData.length - 1].length,
          });
        }
      }

      const validTeams: number[] = [];
      for (let i = 0; i < difficultyCalculations.length; i++) {
        const difficultyCalc = difficultyCalculations[i].difficultyCalc;
        const highestValue = difficultyCalculations[i].highestValue;
        if (
          frcSelectedDifficulty.type === "Easy" &&
          difficultyCalc > Math.floor(highestValue * 0.9)
        ) {
          validTeams.push(difficultyCalculations[i].teamNum);
        } else if (
          frcSelectedDifficulty.type === "Medium" &&
          difficultyCalc > Math.ceil(highestValue * 0.45) &&
          difficultyCalc < Math.floor(highestValue * 0.9)
        ) {
          validTeams.push(difficultyCalculations[i].teamNum);
        } else if (
          frcSelectedDifficulty.type === "Hard" &&
          difficultyCalc < Math.ceil(highestValue * 0.45)
        ) {
          validTeams.push(difficultyCalculations[i].teamNum);
        }
      }

      //TODO: uncomment this function below this comment
      // async function getRandomTeamData(teamNum: number) {
      //   try {
      //     const res = await fetch(
      //       `${process.env.NEXT_PUBLIC_API_URL}/frc/wordle/team?number=${teamNum}`,
      //     );

      //     if (!res.ok) {
      //       throw new Error(`Error status: ${res.status}`);
      //     }

      //     const data = await res.json();
      //     console.log(data);
      //     setRandomTeam(data);
      //   } catch (error: any) {
      //     console.error(error);
      //   }
      // }

      //   if (validTeams.length !== 0 && !isAreaRequestLoading) {
      //     toast.promise(
      //       getRandomTeamData(
      //         validTeams[Math.floor(Math.random() * validTeams.length)],
      //       ),
      //       {
      //         pending: "Fetching random team data...",
      //         success: "Random team fetched successfully",
      //         error: "Failed to fetch random team",
      //       },
      //       {
      //         theme: "dark",
      //         hideProgressBar: false,
      //         pauseOnHover: false,
      //         draggable: true,
      //         progress: undefined,
      //         transition: Bounce,
      //         autoClose: 1000,
      //       },
      //     );
      //   } else {
      //     // errorToast("Failed to fetch guessable team");
      //     console.log("diff calc", difficultyCalculations);
      //     console.log("valid teams", validTeams);
      //   }
    }
    setGuessAmount(0);
  }, [
    frcAreaData,
    regionalFRCAreaData,
    allFRCAreaData,
    lastRequestedDifficulty,
    resetTable,
  ]);

  useEffect(() => {
    if (guessResults.length > 0) {
      if (guessResults[guessResults.length - 1].teamNum === 0) {
        showSuccessModal();
        successMessage("That's correct!");
        return;
      }

      //TODO: make max guess amount scale with total num teams for a region
      if (AreaCodeLookUp[frcSelectedArea.name] === "all" && guessAmount >= 15) {
        showSuccessModal();
        successMessage(
          `The correct team was ${randomTeam.teamNum}: ${randomTeam.teamName}`,
        );
      } else if (
        AreaCodeLookUp[frcSelectedArea.name] === "regionals" &&
        guessAmount >= 10
      ) {
        showSuccessModal();
        successMessage(
          `The correct team was ${randomTeam.teamNum}: ${randomTeam.teamName}`,
        );
      } else if (
        AreaCodeLookUp[frcSelectedArea.name] !== "all" &&
        AreaCodeLookUp[frcSelectedArea.name] !== "regionals" &&
        guessAmount >= 5
      ) {
        showSuccessModal();
        successMessage(
          `The correct team was ${randomTeam.teamNum}: ${randomTeam.teamName}`,
        );
      }
    }
  }, [guessResults]);

  // useEffect(() => {}, [resetTable]);

  useEffect(() => {
    if (isModalVisible) {
      canGetAreaData.current = false;
    }
  }, [isModalVisible]);

  const handleGuessInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setGuessInput(event.target.value);
  };

  const errorToast = (message: string) => {
    toast.error(message, {
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
    <div className="flex flex-col w-fit items-center justify-center gap-4">
      <div className="flex flex-row w-full items-center justify-center gap-4">
        <input
          value={guessInput}
          onChange={handleGuessInputChange}
          placeholder="Input a team number"
          className="flex w-auto"
        ></input>
        <button
          onClick={() => {
            setUpdateTableWithClick((prev) => prev + 1);
            // console.log("cur guess", guessResults[guessResults.length - 1]);
            // console.log("what's in random team", randomTeam);
          }}
          className="group flex rounded-full items-center justify-center h-10 w-20 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300"
        >
          <div className="rounded-full bg-black group-hover:bg-[#111111] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300">
            Guess
          </div>
        </button>{" "}
      </div>
      <div className="flex items-center w-fit pb-2 min-w-0 overflow-x-auto justify-start landscape:justify-center portrait:w-[90dvw]">
        <table key={forceUpdateTable} id="frcdle-table" className="w-[80dvw]">
          <thead>
            <tr>
              <th className="border-2 border-black p-1 max-sm:text-sm bg-[#111111]">
                Team Number
              </th>
              <th className="border-2 border-black p-1 max-sm:text-sm bg-[#111111]">
                Team Name
              </th>
              {frcSelectedArea?.name === "All" && (
                <th className="border-2 border-black p-1 max-sm:text-sm bg-[#111111]">
                  Area
                </th>
              )}
              {frcSelectedArea?.name !== "All" && (
                <th className="border-2 border-black p-1 max-sm:text-sm bg-[#111111]">
                  Area Rank
                </th>
              )}
              <th className="border-2 border-black p-1 max-sm:text-sm bg-[#111111]">
                Rookie Year
              </th>
              <th className="border-2 border-black p-1 max-sm:text-sm bg-[#111111]">
                Years Competing
              </th>
              <th className="border-2 border-black p-1 max-sm:text-sm bg-[#111111]">
                Unitless EPA
              </th>
              <th className="border-2 border-black p-1 max-sm:text-sm bg-[#111111]">
                EPA Rank
              </th>
              <th className="border-2 border-black p-1 max-sm:text-sm bg-[#111111]">
                Award Amount
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {tableRows &&
              tableRows.map((row, index) => (
                <tr key={index}>
                  <td
                    className={`border-2 border-black p-1 max-sm:text-sm ${guessResults[index]?.teamNum === 0 ? "bg-[#2d4d29]" : Math.abs(guessResults[index]?.teamNum) < 2000 ? "bg-[#857835]" : "bg-[#111111]"}`}
                  >
                    {row.teamNum}{" "}
                    {guessResults[index]?.teamNum < 0
                      ? "↑"
                      : guessResults[index]?.teamNum > 0
                        ? "↓"
                        : ""}
                  </td>
                  <td
                    className={`border-2 border-black p-1 max-sm:text-sm ${guessResults[index]?.teamName ? "bg-[#2d4d29]" : "bg-[#111111]"}`}
                  >
                    {row.teamName}
                  </td>
                  {frcSelectedArea?.name === "All" && (
                    <td
                      className={`border-2 border-black p-1 max-sm:text-sm ${guessResults[index]?.area ? "bg-[#2d4d29]" : "bg-[#111111]"}`}
                    >
                      {row.area}
                    </td>
                  )}
                  {frcSelectedArea?.name !== "All" && (
                    <td
                      className={`border-2 border-black p-1 max-sm:text-sm ${guessResults[index]?.areaRank === 0 ? "bg-[#2d4d29]" : Math.abs(guessResults[index]?.areaRank) < Math.floor(0.2 * row.totalNumTeams) ? "bg-[#857835]" : "bg-[#111111]"}`}
                    >
                      {row.areaRank}/{row.totalNumTeams}{" "}
                      {guessResults[index]?.areaRank < 0
                        ? "↓"
                        : guessResults[index]?.areaRank > 0
                          ? "↑"
                          : ""}
                    </td>
                  )}
                  <td
                    className={`border-2 border-black p-1 max-sm:text-sm ${guessResults[index]?.rookieYear === 0 ? "bg-[#2d4d29]" : Math.abs(guessResults[index]?.rookieYear) < 7 ? "bg-[#857835]" : "bg-[#111111]"}`}
                  >
                    {row.rookieYear}{" "}
                    {guessResults[index]?.rookieYear < 0
                      ? "↑"
                      : guessResults[index]?.rookieYear > 0
                        ? "↓"
                        : ""}
                  </td>
                  <td
                    className={`border-2 border-black p-1 max-sm:text-sm ${guessResults[index]?.numYearsParticipating === 0 ? "bg-[#2d4d29]" : Math.abs(guessResults[index]?.numYearsParticipating) < 4 ? "bg-[#857835]" : "bg-[#111111]"}`}
                  >
                    {row.numYearsParticipating}{" "}
                    {guessResults[index]?.numYearsParticipating < 0
                      ? "↑"
                      : guessResults[index]?.numYearsParticipating > 0
                        ? "↓"
                        : ""}
                  </td>
                  <td
                    className={`border-2 border-black p-1 max-sm:text-sm ${guessResults[index]?.unitlessEPA === 0 ? "bg-[#2d4d29]" : Math.abs(guessResults[index]?.unitlessEPA) < 500 ? "bg-[#857835]" : "bg-[#111111]"}`}
                  >
                    {row.unitlessEPA}{" "}
                    {guessResults[index]?.unitlessEPA < 0
                      ? "↑"
                      : guessResults[index]?.unitlessEPA > 0
                        ? "↓"
                        : ""}
                  </td>
                  <td
                    className={`border-2 border-black p-1 max-sm:text-sm ${AreaCodeLookUp[frcSelectedArea.name] !== "all" ? (guessResults[index]?.epaRank === 0 ? "bg-[#2d4d29]" : Math.abs(guessResults[index]?.epaRank) < 0.2 * row.totalNumTeams ? "bg-[#857835]" : "bg-[#111111]") : guessResults[index]?.worldEPARank === 0 ? "bg-[#2d4d29]" : Math.abs(guessResults[index]?.worldEPARank) < 0.2 * allFRCAreaData.length ? "bg-[#857835]" : "bg-[#111111]"}`}
                  >
                    {AreaCodeLookUp[frcSelectedArea.name] !== "all"
                      ? `${row.epaRank}/${row.totalNumTeams} ${
                          guessResults[index]?.epaRank < 0
                            ? "↓"
                            : guessResults[index]?.epaRank > 0
                              ? "↑"
                              : ""
                        }`
                      : `${row.worldEPARank}/${allFRCAreaData.length} ${
                          guessResults[index]?.worldEPARank < 0
                            ? "↓"
                            : guessResults[index]?.worldEPARank > 0
                              ? "↑"
                              : ""
                        }`}
                  </td>
                  <td
                    className={`border-2 border-black p-1 max-sm:text-sm ${guessResults[index]?.awardNum === 0 ? "bg-[#2d4d29]" : Math.abs(guessResults[index]?.awardNum) < 3 ? "bg-[#857835]" : "bg-[#111111]"}`}
                  >
                    {row.awardNum}{" "}
                    {guessResults[index]?.awardNum < 0
                      ? "↑"
                      : guessResults[index]?.awardNum > 0
                        ? "↓"
                        : ""}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
