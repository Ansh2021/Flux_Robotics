import React, {
  useRef,
  useEffect,
  useState,
  UIEvent,
  SyntheticEvent,
} from "react";
import Image from "next/image";
import { Exo_2 } from "next/font/google";

//more items constants
const GAME_PIECE_PRICE_SCALING = 1.22;
const GAME_PIECE_EFFECT = 2; //in game pieces per second
const GAME_PIECE_STARTING_PRICE = 25; //in game pieces

const MOTOR_PRICE_SCALING = 1.24;
const MOTOR_EFFECT = 7;
const MOTOR_STARTING_PRICE = 100;

const CAMERA_PRICE_SCALING = 1.28;
const CAMERA_EFFECT = 20;
const CAMERA_STARTING_PRICE = 700;

const MENTOR_PRICE_SCALING = 1.29;
const MENTOR_EFFECT = 80;
const MENTOR_STARTING_PRICE = 2500;

const SPONSOR_PRICE_SCALING = 1.3;
const SPONSOR_EFFECT = 300;
const SPONSOR_STARTING_PRICE = 8000;

const PRINTER_PRICE_SCALING = 1.31;
const PRINTER_EFFECT = 1000;
const PRINTER_STARTING_PRICE = 23000;

const MACHINE_PRICE_SCALING = 1.33;
const MACHINE_EFFECT = 2800;
const MACHINE_STARTING_PRICE = 60000;

const ROBOT_PRICE_SCALING = 1.35;
const ROBOT_EFFECT = 7000;
const ROBOT_STARTING_PRICE = 250000;

//upgrade constants
const STRONGER_MOUSE_PRICE = 2000;
const STRONGER_MOUSE_MULTIPLIER = 2; //2x multiplier

const POWER_DRILL_PRICE = 50000;
const POWER_DRILL_MULTIPLIER = 2;
const POWER_DRILL_THRESHOLD = 500;

const AUTOCLICKER_PRICE = 1000000;
const AUTOCLICKER_MULTIPLIER = 2;
const AUTOCLICKER_THRESHOLD = 2000;

const SILVER_GAME_PIECE_PRICE = 5000;
const SILVER_GAME_PIECE_MULTIPLIER = 2;
const SILVER_GAME_PIECE_THRESHOLD = 10;

const GOLD_GAME_PIECE_PRICE = 50000;
const GOLD_GAME_PIECE_MULTIPLIER = 5;
const GOLD_GAME_PIECE_THRESHOLD = 20;

const DIAMOND_GAME_PIECE_PRICE = 300000;
const DIAMOND_GAME_PIECE_MULTIPLIER = 10;
const DIAMOND_GAME_PIECE_THRESHOLD = 30;

const NEOS_PRICE = 10000;
const NEOS_MULTIPLIER = 3;
const NEOS_THRESHOLD = 10;

const KRAKEN_X44_PRICE = 150000;
const KRAKEN_X44_MULTIPLIER = 5;
const KRAKEN_X44_THRESHOLD = 20;

const KRAKEN_X60_PRICE = 2000000;
const KRAKEN_X60_MULTIPLIER = 7;
const KRAKEN_X60_THRESHOLD = 30;

const ARDUCAM_PRICE = 50000;
const ARDUCAM_MULTIPLIER = 3;
const ARDUCAM_THRESHOLD = 8;

const THRIFTY_CAM_PRICE = 500000; //amazing thrift store find
const THRIFTY_CAM_MULTIPLIER = 5;
const THRIFTY_CAM_THRESHOLD = 15;

const LIMELIGHT_PRICE = 2500000;
const LIMELIGHT_MULTIPLIER = 7;
const LIMELIGHT_THRESHOLD = 20;

const SPACEX_ENGINEER_PRICE = 150000;
const SPACEX_ENGINEER_MULTIPLIER = 3;
const SPACEX_ENGINEER_THRESHOLD = 8;

const LOCKHEED_ENGINEER_PRICE = 2000000;
const LOCKHEED_ENGINEER_MULTIPLIER = 5;
const LOCKHEED_ENGINEER_THRESHOLD = 15;

const NASA_ENGINEER_PRICE = 8500000;
const NASA_ENGINEER_MULTIPLIER = 7;
const NASA_ENGINEER_THRESHOLD = 20;

const LOCAL_BUSINESS_PRICE = 500000;
const LOCAL_BUSINESS_MULTIPLIER = 3;
const LOCAL_BUSINESS_THRESHOLD = 8;

const REGIONAL_BUSINESS_PRICE = 6500000;
const REGIONAL_BUSINESS_MULTIPLIER = 5;
const REGIONAL_BUSINESS_THRESHOLD = 15;

const GLOBAL_CORPORATION_PRICE = 30000000;
const GLOBAL_CORPORATION_MULTIPLIER = 7;
const GLOBAL_CORPORATION_THRESHOLD = 20;

const ENDER3_PRICE = 1000000;
const ENDER3_MULTIPLIER = 3;
const ENDER3_THRESHOLD = 7;

const P1S_PRICE = 7000000;
const P1S_MULTIPLIER = 5;
const P1S_THRESHOLD = 12;

const H2C_PRICE = 55000000;
const H2C_MULTIPLIER = 7;
const H2C_THRESHOLD = 18;

const UpgradeOrder: { id: string; price: number }[] = [
  { id: "stronger mouse", price: STRONGER_MOUSE_PRICE },
  { id: "power drill", price: POWER_DRILL_PRICE },
  { id: "autoclicker", price: AUTOCLICKER_PRICE },
  { id: "silver game piece", price: SILVER_GAME_PIECE_PRICE },
  { id: "gold game piece", price: GOLD_GAME_PIECE_PRICE },
  { id: "diamond game piece", price: DIAMOND_GAME_PIECE_PRICE },
  { id: "neo", price: NEOS_PRICE },
  { id: "x44", price: KRAKEN_X44_PRICE },
  { id: "x60", price: KRAKEN_X60_PRICE },
  { id: "arducam", price: ARDUCAM_PRICE },
  { id: "thrifty cam", price: THRIFTY_CAM_PRICE },
  { id: "limelight", price: LIMELIGHT_PRICE },
  { id: "spacex engineer", price: SPACEX_ENGINEER_PRICE },
  { id: "lockheed engineer", price: LOCKHEED_ENGINEER_PRICE },
  { id: "nasa engineer", price: NASA_ENGINEER_PRICE },
  { id: "local business", price: LOCAL_BUSINESS_PRICE },
  { id: "regional business", price: REGIONAL_BUSINESS_PRICE },
  { id: "global corporation", price: GLOBAL_CORPORATION_PRICE },
  { id: "ender 3", price: ENDER3_PRICE },
  { id: "p1s", price: P1S_PRICE },
  { id: "h2c", price: H2C_PRICE },
];

//number formatter (oh yeah)
const numFormatter = new Intl.NumberFormat("en-us", {
  notation: "compact",
  compactDisplay: "long",
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

export default function FRCClicker() {
  //TODO: make this changeable by the user
  const [selectedGamePiece, setSelectedGamePiece] = useState("Fuel");

  const [total, setTotal] = useState<number>(0);
  const [gamePiecesPerSecond, setGamePiecesPerSecond] = useState<number>(0);
  const gamePiecesPerSecondRef = useRef<number>(0); //so i don't read a stale useState value
  const totalRef = useRef<number>(0); //same here
  useEffect(() => {
    gamePiecesPerSecondRef.current = gamePiecesPerSecond;
  }, [gamePiecesPerSecond]);
  useEffect(() => {
    totalRef.current = total;
  }, [total]);
  useEffect(() => {
    setTotal(totalRef.current);
  }, [totalRef.current]);

  const [clickMultiplier, setClickMultiplier] = useState<number>(1);

  //stopwatch to update total
  const intervalRef = useRef(null);
  const lastTimeFrameRef = useRef<number>(0);

  const updateTime = (time: number) => {
    if (lastTimeFrameRef.current === 0) {
      lastTimeFrameRef.current = time;
    }

    const delta = (time - lastTimeFrameRef.current) / 1000;
    lastTimeFrameRef.current = time;
    const cookiesGainedThisFrame = delta * gamePiecesPerSecondRef.current;

    totalRef.current += cookiesGainedThisFrame;
    setTotal(Math.floor(totalRef.current));

    intervalRef.current = requestAnimationFrame(updateTime);
  };

  useEffect(() => {
    if (gamePiecesPerSecond === 0) return;

    intervalRef.current = requestAnimationFrame(updateTime);
  }, [gamePiecesPerSecond]);

  //returns a clean up function stopping the stopwatch (conserves resources)
  useEffect(() => {
    return () => {
      if (intervalRef.current) cancelAnimationFrame(intervalRef.current);
    };
  }, []);

  //total effect of certain upgrades
  const [totalGamePieceEffect, setTotalGamePieceEffect] = useState<number>(0); //total effect of game pieces
  const [totalMotorEffect, setTotalMotorEffect] = useState<number>(0); //total effect of motors
  const [totalCameraEffect, setTotalCameraEffect] = useState<number>(0); //of cameras
  const [totalMentorEffect, setTotalMentorEffect] = useState<number>(0); //of mentors
  const [totalSponsorEffect, setTotalSponsorEffect] = useState<number>(0); //of sponsors
  const [totalPrinterEffect, setTotalPrinterEffect] = useState<number>(0); //of 3d printers
  const [totalMachineEffect, setTotalMachineEffect] = useState<number>(0); //of machines (manufacturing)
  const [totalRobotEffect, setTotalRobotEffect] = useState<number>(0); //of robots

  useEffect(() => {
    setGamePiecesPerSecond(
      totalGamePieceEffect +
        totalMotorEffect +
        totalCameraEffect +
        totalMentorEffect +
        totalSponsorEffect +
        totalPrinterEffect +
        totalMachineEffect +
        totalRobotEffect,
    );
  }, [
    totalGamePieceEffect,
    totalMotorEffect,
    totalCameraEffect,
    totalMentorEffect,
    totalSponsorEffect,
    totalPrinterEffect,
    totalMachineEffect,
    totalRobotEffect,
  ]);

  return (
    <main className="flex w-full items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="h-[calc(100dvh-4rem)] w-full flex flex-row items-center justify-center">
        <div className={`${selectedGamePiece === "Fuel" ? "flex" : "hidden"}`}>
          <RebuiltFuel
            totalRef={totalRef}
            total={total}
            setTotal={setTotal}
            perSecond={gamePiecesPerSecond}
            clickMultiplier={clickMultiplier}
          />
        </div>
        <SideCatalog
          totalRef={totalRef}
          selectedGamePiece={selectedGamePiece}
          setClickMultiplier={setClickMultiplier}
          setTotalGamePieceEffect={setTotalGamePieceEffect}
          setTotalMotorEffect={setTotalMotorEffect}
          setTotalCameraEffect={setTotalCameraEffect}
          setTotalMentorEffect={setTotalMentorEffect}
          setTotalSponsorEffect={setTotalSponsorEffect}
          setTotalPrinterEffect={setTotalPrinterEffect}
          setTotalMachineEffect={setTotalMachineEffect}
          setTotalRobotEffect={setTotalRobotEffect}
        />
      </div>
    </main>
  );
}

//TODO: decide if i need totalRef or total to keep first time clicking accurate
//(make sure the first click registers)
function RebuiltFuel({
  totalRef,
  total,
  setTotal,
  perSecond,
  clickMultiplier,
}: {
  totalRef: React.RefObject<number>;
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  perSecond: number;
  clickMultiplier: number;
}) {
  const [curHack, setCurHack] = useState<number>(0);

  const handleHacks = (event: React.SubmitEvent) => {
    event.preventDefault();
    setTotal((prev) => prev + curHack);
  };

  return (
    <div className="flex flex-col w-fit h-fit rounded-full gap-2 justify-center items-center">
      <div className="flex flex-col w-fit h-fit gap-1 justify-center items-center">
        <p className="font-bold text-2xl">
          {Math.floor(total) >= 1000000
            ? numFormatter.format(Math.floor(total))
            : Math.floor(total)}{" "}
          fuel
        </p>
        <p>
          {perSecond >= 1000000 ? numFormatter.format(perSecond) : perSecond}{" "}
          fuel per second
        </p>
        <form onSubmit={handleHacks}>
          <input
            value={curHack}
            onChange={(e) => setCurHack(Number(e.currentTarget.value))}
            placeholder="Hacks for testing purposes"
          ></input>
        </form>
      </div>
      <button
        onClick={() => {
          setTotal((prev) => prev + clickMultiplier);
          // console.log(totalRef.current, Math.floor(totalRef.current));
        }}
      >
        <Image
          src="/rebuilt-fuel.webp"
          width={300}
          height={300}
          alt="Fuel from the 2026 Rebuilt season"
          loading="eager"
          className="animate-jiggle object-cover w-full h-full transition-transform duration-250 ease-in-out active:scale-105"
        />
      </button>
    </div>
  );
}

function SideCatalog({
  totalRef,
  selectedGamePiece,
  setClickMultiplier,
  setTotalGamePieceEffect,
  setTotalMotorEffect,
  setTotalCameraEffect,
  setTotalMentorEffect,
  setTotalSponsorEffect,
  setTotalPrinterEffect,
  setTotalMachineEffect,
  setTotalRobotEffect,
}: {
  totalRef: React.RefObject<number>;
  selectedGamePiece: string;
  setClickMultiplier: React.Dispatch<React.SetStateAction<number>>;
  setTotalGamePieceEffect: React.Dispatch<React.SetStateAction<number>>;
  setTotalMotorEffect: React.Dispatch<React.SetStateAction<number>>;
  setTotalCameraEffect: React.Dispatch<React.SetStateAction<number>>;
  setTotalMentorEffect: React.Dispatch<React.SetStateAction<number>>;
  setTotalSponsorEffect: React.Dispatch<React.SetStateAction<number>>;
  setTotalPrinterEffect: React.Dispatch<React.SetStateAction<number>>;
  setTotalMachineEffect: React.Dispatch<React.SetStateAction<number>>;
  setTotalRobotEffect: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [scrollY, setScrollY] = useState<number>(0);
  const handleElementScroll = (event: UIEvent<HTMLDivElement>) => {
    setScrollY(event.currentTarget.scrollTop);
  };

  //more items
  const [gamePiecePrice, setGamePiecePrice] = useState<number>(
    GAME_PIECE_STARTING_PRICE,
  );
  const [numGamePieces, setNumGamePieces] = useState<number>(0);
  const [gamePieceMultiplier, setGamePieceMultiplier] = useState<number>(1);
  useEffect(() => {
    setGamePiecePrice(
      Math.floor(
        GAME_PIECE_STARTING_PRICE *
          Math.pow(GAME_PIECE_PRICE_SCALING, numGamePieces),
      ),
    );
    setTotalGamePieceEffect(
      numGamePieces * GAME_PIECE_EFFECT * gamePieceMultiplier,
    );
  }, [numGamePieces, gamePieceMultiplier]);

  const [motorPrice, setMotorPrice] = useState<number>(MOTOR_STARTING_PRICE);
  const [numMotors, setNumMotors] = useState<number>(0);
  const [motorMultiplier, setMotorMultiplier] = useState<number>(1);
  useEffect(() => {
    setMotorPrice(
      Math.floor(
        MOTOR_STARTING_PRICE * Math.pow(MOTOR_PRICE_SCALING, numMotors),
      ),
    );
    setTotalMotorEffect(numMotors * MOTOR_EFFECT * motorMultiplier);
  }, [numMotors, motorMultiplier]);

  const [cameraPrice, setCameraPrice] = useState<number>(CAMERA_STARTING_PRICE);
  const [numCameras, setNumCameras] = useState<number>(0);
  const [cameraMultiplier, setCameraMultiplier] = useState<number>(1);
  useEffect(() => {
    setCameraPrice(
      Math.floor(
        CAMERA_STARTING_PRICE * Math.pow(CAMERA_PRICE_SCALING, numCameras),
      ),
    );
    setTotalCameraEffect(numCameras * CAMERA_EFFECT * cameraMultiplier);
  }, [numCameras, cameraMultiplier]);

  const [mentorPrice, setMentorPrice] = useState<number>(MENTOR_STARTING_PRICE);
  const [numMentors, setNumMentors] = useState<number>(0);
  const [mentorMultiplier, setMentorMultiplier] = useState<number>(1);
  useEffect(() => {
    setMentorPrice(
      Math.floor(
        MENTOR_STARTING_PRICE * Math.pow(MENTOR_PRICE_SCALING, numMentors),
      ),
    );
    setTotalMentorEffect(numMentors * MENTOR_EFFECT * mentorMultiplier);
  }, [numMentors, mentorMultiplier]);

  const [sponsorPrice, setSponsorPrice] = useState<number>(
    SPONSOR_STARTING_PRICE,
  );
  const [numSponsors, setNumSponsors] = useState<number>(0);
  const [sponsorMultiplier, setSponsorMultiplier] = useState<number>(1);
  useEffect(() => {
    setSponsorPrice(
      Math.floor(
        SPONSOR_STARTING_PRICE * Math.pow(SPONSOR_PRICE_SCALING, numSponsors),
      ),
    );
    setTotalSponsorEffect(numSponsors * SPONSOR_EFFECT * sponsorMultiplier);
  }, [numSponsors, sponsorMultiplier]);

  const [printerPrice, setPrinterPrice] = useState<number>(
    PRINTER_STARTING_PRICE,
  );
  const [numPrinters, setNumPrinters] = useState<number>(0);
  const [printerMultiplier, setPrinterMultiplier] = useState<number>(1);
  useEffect(() => {
    setPrinterPrice(
      Math.floor(
        PRINTER_STARTING_PRICE * Math.pow(PRINTER_PRICE_SCALING, numPrinters),
      ),
    );
    setTotalPrinterEffect(numPrinters * PRINTER_EFFECT * printerMultiplier);
  }, [numPrinters, printerMultiplier]);

  const [machinePrice, setMachinePrice] = useState<number>(
    MACHINE_STARTING_PRICE,
  );
  const [numMachines, setNumMachines] = useState<number>(0);
  const [machineMultiplier, setMachineMultiplier] = useState<number>(1);
  useEffect(() => {
    setMachinePrice(
      Math.floor(
        MACHINE_STARTING_PRICE * Math.pow(MACHINE_PRICE_SCALING, numMachines),
      ),
    );
    setTotalMachineEffect(numMachines * MACHINE_EFFECT * machineMultiplier);
  }, [numMachines, machineMultiplier]);

  const [robotPrice, setRobotPrice] = useState<number>(ROBOT_STARTING_PRICE);
  const [numRobots, setNumRobots] = useState<number>(0);
  const [robotMultiplier, setRobotMultiplier] = useState<number>(1);
  useEffect(() => {
    setRobotPrice(
      Math.floor(
        ROBOT_STARTING_PRICE * Math.pow(ROBOT_PRICE_SCALING, numRobots),
      ),
    );
    setTotalRobotEffect(numRobots * ROBOT_EFFECT * robotMultiplier);
  }, [numRobots, robotMultiplier]);

  //upgrades
  const [strongerMouseUpgradeVisible, setStrongerMouseUpgradeVisible] =
    useState(true);

  return (
    <div className="flex flex-col h-fit w-[15dvw] min-w-20 max-w-100 max-h-105 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] absolute right-0 mr-5 rounded-xl p-[4px]">
      <div className="flex flex-col rounded-xl bg-black h-fit max-h-100 w-full justify-start items-center p-2 gap-3 overflow-y-auto no-scrollbar">
        <div className="flex flex-row rounded-full gap-2 bg-black border border-gray-900 h-fit min-h-10 w-full justify-start items-center overflow-x-auto no-scrollbar">
          <div className={`${strongerMouseUpgradeVisible ? "flex" : "hidden"}`}>
            <ToolTip
              name="Stronger Mouse"
              description="Can withstand your persistent clicking."
              effect={`${STRONGER_MOUSE_MULTIPLIER}x clicking multiplier`}
              cost={`${STRONGER_MOUSE_PRICE} ${selectedGamePiece}`}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < STRONGER_MOUSE_PRICE)
                    return;
                  setClickMultiplier((prev) => prev * 2);
                  setStrongerMouseUpgradeVisible(false);
                  totalRef.current -= STRONGER_MOUSE_PRICE;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-10 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= STRONGER_MOUSE_PRICE ? "shadow-xl shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= STRONGER_MOUSE_PRICE ? "bg-[#111111]" : "bg-black"}`}
                >
                  hi {/* placeholder */}
                </div>
              </button>
            </ToolTip>
          </div>
        </div>
        <div
          onScroll={handleElementScroll}
          className="flex flex-col rounded-xl bg-black h-fit max-h-90 w-full justify-start items-center p-2 gap-3 overflow-y-auto no-scrollbar"
        >
          {/* More game pieces */}
          <div className="flex flex-row w-full pr-2 pl-2 justify-around items-center">
            {/* TODO: make fuel name dynamic depending on whether it is silver/gold/diamond etc. */}
            <ToolTip
              name="Fuel"
              description={`More ${selectedGamePiece.toLowerCase()} for human matches.`}
              effect={`+${GAME_PIECE_EFFECT} ${selectedGamePiece.toLowerCase()} per second`}
              cost={`${gamePiecePrice >= 1000000 ? numFormatter.format(gamePiecePrice) : gamePiecePrice} ${selectedGamePiece.toLowerCase()}`}
              scroll={scrollY}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < gamePiecePrice) return;
                  setNumGamePieces((prev) => prev + 1);
                  totalRef.current -= gamePiecePrice;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-26 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= gamePiecePrice - 1 ? "shadow-lg shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full bg-black group-hover:bg-[#111111] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= gamePiecePrice - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  {selectedGamePiece}
                </div>
              </button>
            </ToolTip>
            <p className="flex font-semibold">{numGamePieces}</p>
          </div>
          {/* More motors */}
          <div
            className={`${numGamePieces >= 5 ? "flex flex-row" : "hidden"} w-full pr-2 pl-2 justify-around items-center`}
          >
            {/* TODO: make motor name dynamic depending on whether it is neo/kraken x44/x60 */}
            <ToolTip
              name="Motor"
              description="More motors could never hurt."
              effect={`+${MOTOR_EFFECT} ${selectedGamePiece.toLowerCase()} per second`}
              cost={`${motorPrice >= 1000000 ? numFormatter.format(motorPrice) : motorPrice} ${selectedGamePiece.toLowerCase()}`}
              scroll={scrollY}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < motorPrice) return;
                  setNumMotors((prev) => prev + 1);
                  totalRef.current -= motorPrice;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-26 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= motorPrice - 1 ? "shadow-lg shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full bg-black group-hover:bg-[#111111] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= motorPrice - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  Motor
                </div>
              </button>
            </ToolTip>
            <p className="flex font-semibold">{numMotors}</p>
          </div>
          <div
            className={`${numMotors >= 5 ? "flex flex-row" : "hidden"} w-full pr-2 pl-2 justify-around items-center`}
          >
            {/* TODO: make camera name dynamic */}
            <ToolTip
              name="Camera"
              description="See the world of AprilTags."
              effect={`+${CAMERA_EFFECT} ${selectedGamePiece.toLowerCase()} per second`}
              cost={`${cameraPrice >= 1000000 ? numFormatter.format(cameraPrice) : cameraPrice} ${selectedGamePiece.toLowerCase()}`}
              scroll={scrollY}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < cameraPrice) return;
                  setNumCameras((prev) => prev + 1);
                  totalRef.current -= cameraPrice;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-26 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= cameraPrice - 1 ? "shadow-lg shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full bg-black group-hover:bg-[#111111] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= cameraPrice - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  Camera
                </div>
              </button>
            </ToolTip>
            <p className="flex font-semibold">{numCameras}</p>
          </div>
          <div
            className={`${numCameras >= 5 ? "flex flex-row" : "hidden"} w-full pr-2 pl-2 justify-around items-center`}
          >
            {/* TODO: make mentor name dynamic */}
            <ToolTip
              name="Mentor"
              description="Robot-building geniuses."
              effect={`+${MENTOR_EFFECT} ${selectedGamePiece.toLowerCase()} per second`}
              cost={`${mentorPrice >= 1000000 ? numFormatter.format(mentorPrice) : mentorPrice} ${selectedGamePiece.toLowerCase()}`}
              scroll={scrollY}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < mentorPrice) return;
                  setNumMentors((prev) => prev + 1);
                  totalRef.current -= mentorPrice;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-26 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= mentorPrice - 1 ? "shadow-lg shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full bg-black group-hover:bg-[#111111] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= mentorPrice - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  Mentor
                </div>
              </button>
            </ToolTip>
            <p className="flex font-semibold">{numMentors}</p>
          </div>
          <div
            className={`${numMentors >= 5 ? "flex flex-row" : "hidden"} w-full pr-2 pl-2 justify-around items-center`}
          >
            {/* TODO: make mentor name dynamic */}
            <ToolTip
              name="Sponsor"
              description="Money, money, money!"
              effect={`+${SPONSOR_EFFECT} ${selectedGamePiece.toLowerCase()} per second`}
              cost={`${sponsorPrice >= 1000000 ? numFormatter.format(sponsorPrice) : sponsorPrice} ${selectedGamePiece.toLowerCase()}`}
              scroll={scrollY}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < sponsorPrice) return;
                  setNumSponsors((prev) => prev + 1);
                  totalRef.current -= sponsorPrice;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-26 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= sponsorPrice - 1 ? "shadow-lg shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full bg-black group-hover:bg-[#111111] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= sponsorPrice - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  Sponsor
                </div>
              </button>
            </ToolTip>
            <p className="flex font-semibold">{numSponsors}</p>
          </div>
          <div
            className={`${numSponsors >= 4 ? "flex flex-row" : "hidden"} w-full pr-2 pl-2 justify-around items-center`}
          >
            {/* TODO: make 3d printer name dynamic */}
            <ToolTip
              name="3D Printer"
              description="Print to your heart's content."
              effect={`+${PRINTER_EFFECT} ${selectedGamePiece.toLowerCase()} per second`}
              cost={`${printerPrice >= 1000000 ? numFormatter.format(printerPrice) : printerPrice} ${selectedGamePiece.toLowerCase()}`}
              scroll={scrollY}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < printerPrice) return;
                  setNumPrinters((prev) => prev + 1);
                  totalRef.current -= printerPrice;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-26 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= printerPrice - 1 ? "shadow-lg shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full bg-black group-hover:bg-[#111111] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= printerPrice - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  3D Printer
                </div>
              </button>
            </ToolTip>
            <p className="flex font-semibold">{numPrinters}</p>
          </div>
          <div
            className={`${numPrinters >= 3 ? "flex flex-row" : "hidden"} w-full pr-2 pl-2 justify-around items-center`}
          >
            {/* TODO: make machine name dynamic */}
            <ToolTip
              name="Machine"
              description="Furnish your machine shop."
              effect={`+${MACHINE_EFFECT} ${selectedGamePiece.toLowerCase()} per second`}
              cost={`${machinePrice >= 1000000 ? numFormatter.format(machinePrice) : machinePrice} ${selectedGamePiece.toLowerCase()}`}
              scroll={scrollY}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < machinePrice) return;
                  setNumMachines((prev) => prev + 1);
                  totalRef.current -= machinePrice;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-26 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= machinePrice - 1 ? "shadow-lg shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full bg-black group-hover:bg-[#111111] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= machinePrice - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  Machine
                </div>
              </button>
            </ToolTip>
            <p className="flex font-semibold">{numMachines}</p>
          </div>
          <div
            className={`${numMachines >= 3 ? "flex flex-row" : "hidden"} w-full pr-2 pl-2 justify-around items-center`}
          >
            {/* TODO: make robot name dynamic */}
            <ToolTip
              name="Robot"
              description="Vroom vroom."
              effect={`+${ROBOT_EFFECT} ${selectedGamePiece.toLowerCase()} per second`}
              cost={`${robotPrice >= 1000000 ? numFormatter.format(robotPrice) : robotPrice} ${selectedGamePiece.toLowerCase()}`}
              scroll={scrollY}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < robotPrice) return;
                  setNumRobots((prev) => prev + 1);
                  totalRef.current -= robotPrice;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-26 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= robotPrice - 1 ? "shadow-lg shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full bg-black group-hover:bg-[#111111] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= robotPrice - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  Robot
                </div>
              </button>
            </ToolTip>
            <p className="flex font-semibold">{numRobots}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolTip({
  name,
  description,
  cost,
  scroll,
  effect,
  children,
}: {
  name?: string;
  description: string;
  cost: string;
  scroll?: number;
  effect?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group inline-block">
      {children}
      <div
        className="pointer-events-none text-center absolute right-full -translate-y-[calc(42px+var(--scrollY))] -translate-x-5 w-full z-50 mb-2 scale-0 rounded bg-[#1e1e1e] px-3 py-1.5 text-xs text-white opacity-0 transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100"
        style={
          { "--scrollY": `${scroll ? scroll : 0}px` } as React.CSSProperties
        }
      >
        <p className={`${name ? "self-center" : "hidden"} font-bold`}>{name}</p>
        <p className="italic">{description}</p>
        <p className={`${effect ? "self-center" : "hidden"}`}>{effect}</p>
        <p className="font-semibold">Cost: {cost}</p>
      </div>
    </div>
  );
}
