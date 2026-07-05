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

const MENTORED_TEAM_PRICE_SCALING = 1.36;
const MENTORED_TEAM_EFFECT = 25000;
const MENTORED_TEAM_STARTING_PRICE = 1500000;

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

const LATHE_PRICE = 2000000;
const LATHE_MULTIPLIER = 3;
const LATHE_THRESHOLD = 6;

const BANDSAW_PRICE = 10500000;
const BANDSAW_MULTIPLIER = 5;
const BANDSAW_THRESHOLD = 10;

const CNC_PRICE = 65000000;
const CNC_MULTIPLIER = 7;
const CNC_THRESHOLD = 15;

const JITB_PRICE = 5500000;
const JITB_MULTIPLIER = 3;
const JITB_THRESHOLD = 5;

const MADTOWN_PRICE = 50000000;
const MADTOWN_MULTIPLIER = 5;
const MADTOWN_THRESHOLD = 10;

const POOFS_PRICE = 340000000;
const POOFS_MULTIPLIER = 7;
const POOFS_THRESHOLD = 15;

const FLL_TEAM_PRICE = 35000000;
const FLL_TEAM_MULTIPLIER = 3;
const FLL_TEAM_THRESHOLD = 5;

const FTC_TEAM_PRICE = 330000000;
const FTC_TEAM_MULTIPLIER = 5;
const FTC_TEAM_THRESHOLD = 10;

const FRC_TEAM_PRICE = 2500000000;
const FRC_TEAM_MULTIPLIER = 7;
const FRC_TEAM_THRESHOLD = 15;

//might not need this (unless i decide to rescale prices)
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
  { id: "lathe", price: LATHE_PRICE },
  { id: "bandsaw", price: BANDSAW_PRICE },
  { id: "cnc", price: CNC_PRICE },
  { id: "jitb", price: JITB_PRICE },
  { id: "madtown", price: MADTOWN_PRICE },
  { id: "poofs", price: POOFS_PRICE },
  { id: "fll", price: FLL_TEAM_PRICE },
  { id: "ftc", price: FTC_TEAM_PRICE },
  { id: "frc", price: FRC_TEAM_PRICE },
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
  const [totalMentoredTeamEffect, setTotalMentoredTeamEffect] =
    useState<number>(0); //of mentored teams obv

  useEffect(() => {
    setGamePiecesPerSecond(
      totalGamePieceEffect +
        totalMotorEffect +
        totalCameraEffect +
        totalMentorEffect +
        totalSponsorEffect +
        totalPrinterEffect +
        totalMachineEffect +
        totalRobotEffect +
        totalMentoredTeamEffect,
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
    totalMentoredTeamEffect,
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
          setTotalMentoredTeamEffect={setTotalMentoredTeamEffect}
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
  setTotalMentoredTeamEffect,
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
  setTotalMentoredTeamEffect: React.Dispatch<React.SetStateAction<number>>;
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

  const [mentoredTeamPrice, setMentoredTeamPrice] = useState<number>(
    MENTORED_TEAM_STARTING_PRICE,
  );
  const [numMentoredTeams, setNumMentoredTeams] = useState<number>(0);
  const [mentoredTeamMultiplier, setMentoredTeamMultiplier] =
    useState<number>(1);
  useEffect(() => {
    setMentoredTeamPrice(
      Math.floor(
        MENTORED_TEAM_STARTING_PRICE *
          Math.pow(MENTORED_TEAM_PRICE_SCALING, numMentoredTeams),
      ),
    );
    setTotalMentoredTeamEffect(
      numMentoredTeams * MENTORED_TEAM_EFFECT * mentoredTeamMultiplier,
    );
  }, [numMentoredTeams, mentoredTeamMultiplier]);

  //upgrades
  const [strongerMouseUpgradeVisible, setStrongerMouseUpgradeVisible] =
    useState(true);
  const strongerMouseBought = useRef(false);
  //TODO: get these two to be visible based on the total number of clicks
  const [powerDrillUpgradeVisible, setPowerDrillUpgradeVisible] =
    useState(false);
  const powerDrillBought = useRef(false);
  const [autoClickerUpgradeVisible, setAutoclickerUpgradeVisible] =
    useState(false);
  const autoClickerBought = useRef(false);

  const [silverGamePieceUpgradeVisible, setSilverGamePieceUpgradeVisible] =
    useState(false);
  const silverGamePieceBought = useRef(false);
  const [goldGamePieceUpgradeVisible, setGoldGamePieceUpgradeVisible] =
    useState(false);
  const goldGamePieceBought = useRef(false);
  const [diamondGamePieceUpgradeVisible, setDiamondGamePieceUpgradeVisible] =
    useState(false);
  const diamondGamePieceBought = useRef(false);

  const [neoUpgradeVisible, setNeoUpgradeVisible] = useState(false);
  const neoBought = useRef(false);
  const [krakenX44UpgradeVisible, setKrakenX44UpgradeVisible] = useState(false);
  const krakenX44Bought = useRef(false);
  const [krakenX60UpgradeVisible, setKrakenX60UpgradeVisible] = useState(false);
  const krakenX60Bought = useRef(false);

  const [arducamUpgradeVisible, setArducamUpgradeVisible] = useState(false);
  const arducamBought = useRef(false);
  const [thriftyCamUpgradeVisible, setThriftyCamUpgradeVisible] =
    useState(false);
  const thriftyCamBought = useRef(false);
  const [limelightUpgradeVisible, setLimelightUpgradeVisible] = useState(false);
  const limelightBought = useRef(false);

  const [spacexEngineerUpgradeVisible, setSpacexEngineerUpgradeVisible] =
    useState(false);
  const spacexEngineerBought = useRef(false);
  const [lockheedEngineerUpgradeVisible, setLockheedEngineerUpgradeVisible] =
    useState(false);
  const lockheedEngineerBought = useRef(false);
  const [nasaEngineerUpgradeVisible, setNasaEngineerUpgradeVisible] =
    useState(false);
  const nasaEngineerBought = useRef(false);

  const [localBusinessUpgradeVisible, setLocalBusinessUpgradeVisible] =
    useState(false);
  const localBusinessBought = useRef(false);
  const [regionalBusinessUpgradeVisible, setRegionalBusinessUpgradeVisible] =
    useState(false);
  const regionalBusinessBought = useRef(false);
  const [globalCorporationUpgradeVisible, setGlobalCorporationUpgradeVisible] =
    useState(false);
  const globalCorporationBought = useRef(false);

  const [ender3UpgradeVisible, setEnder3UpgradeVisible] = useState(false);
  const ender3Bought = useRef(false);
  const [p1sUpgradeVisible, setP1sUpgradeVisible] = useState(false);
  const p1sBought = useRef(false);
  const [h2cUpgradeVisible, setH2cUpgradeVisible] = useState(false);
  const h2cBought = useRef(false);

  const [latheUpgradeVisible, setLatheUpgradeVisible] = useState(false);
  const latheBought = useRef(false);
  const [bandsawUpgradeVisible, setBandsawUpgradeVisible] = useState(false);
  const bandsawBought = useRef(false);
  const [cncUpgradeVisible, setCncUpgradeVisible] = useState(false);
  const cncBought = useRef(false);

  const [jitbUpgradeVisible, setJitbUpgradeVisible] = useState(false);
  const jitbBought = useRef(false);
  const [madtownUpgradeVisible, setMadtownUpgradeVisible] = useState(false);
  const madtownBought = useRef(false);
  const [poofsUpgradeVisible, setPoofsUpgradeVisible] = useState(false);
  const poofsBought = useRef(false);

  const [fllTeamUpgradeVisible, setFllTeamUpgradeVisible] = useState(false);
  const fllTeamBought = useRef(false);
  const [ftcTeamUpgradeVisible, setFtcTeamUpgradeVisible] = useState(false);
  const ftcTeamBought = useRef(false);
  const [frcTeamUpgradeVisible, setFrcTeamUpgradeVisible] = useState(false);
  const frcTeamBought = useRef(false);

  useEffect(() => {
    if (
      numGamePieces >= SILVER_GAME_PIECE_THRESHOLD &&
      silverGamePieceBought.current === false
    ) {
      setSilverGamePieceUpgradeVisible(true);
    }

    if (
      numGamePieces >= GOLD_GAME_PIECE_THRESHOLD &&
      goldGamePieceBought.current === false
    ) {
      setGoldGamePieceUpgradeVisible(true);
    }

    if (
      numGamePieces >= DIAMOND_GAME_PIECE_THRESHOLD &&
      diamondGamePieceBought.current === false
    ) {
      setDiamondGamePieceUpgradeVisible(true);
    }

    if (numMotors >= NEOS_THRESHOLD && neoBought.current === false) {
      setNeoUpgradeVisible(true);
    }

    if (
      numMotors >= KRAKEN_X44_THRESHOLD &&
      krakenX44Bought.current === false
    ) {
      setKrakenX44UpgradeVisible(true);
    }

    if (
      numMotors >= KRAKEN_X60_THRESHOLD &&
      krakenX60Bought.current === false
    ) {
      setKrakenX60UpgradeVisible(true);
    }

    if (numCameras >= ARDUCAM_THRESHOLD && arducamBought.current === false) {
      setArducamUpgradeVisible(true);
    }

    if (
      numCameras >= THRIFTY_CAM_THRESHOLD &&
      thriftyCamBought.current === false
    ) {
      setThriftyCamUpgradeVisible(true);
    }

    if (
      numCameras >= LIMELIGHT_THRESHOLD &&
      limelightBought.current === false
    ) {
      setLimelightUpgradeVisible(true);
    }

    if (
      numMentors >= SPACEX_ENGINEER_THRESHOLD &&
      spacexEngineerBought.current === false
    ) {
      setSpacexEngineerUpgradeVisible(true);
    }

    if (
      numMentors >= LOCKHEED_ENGINEER_THRESHOLD &&
      lockheedEngineerBought.current === false
    ) {
      setLockheedEngineerUpgradeVisible(true);
    }

    if (
      numMentors >= NASA_ENGINEER_THRESHOLD &&
      nasaEngineerBought.current === false
    ) {
      setNasaEngineerUpgradeVisible(true);
    }

    if (
      numSponsors >= LOCAL_BUSINESS_THRESHOLD &&
      localBusinessBought.current === false
    ) {
      setLocalBusinessUpgradeVisible(true);
    }

    if (
      numSponsors >= REGIONAL_BUSINESS_THRESHOLD &&
      regionalBusinessBought.current === false
    ) {
      setRegionalBusinessUpgradeVisible(true);
    }

    if (
      numSponsors >= GLOBAL_CORPORATION_THRESHOLD &&
      globalCorporationBought.current === false
    ) {
      setGlobalCorporationUpgradeVisible(true);
    }

    if (numPrinters >= ENDER3_THRESHOLD && ender3Bought.current === false) {
      setEnder3UpgradeVisible(true);
    }

    if (numPrinters >= P1S_THRESHOLD && p1sBought.current === false) {
      setP1sUpgradeVisible(true);
    }

    if (numPrinters >= H2C_THRESHOLD && h2cBought.current === false) {
      setH2cUpgradeVisible(true);
    }

    if (numMachines >= LATHE_THRESHOLD && latheBought.current === false) {
      setLatheUpgradeVisible(true);
    }

    if (numMachines >= BANDSAW_THRESHOLD && bandsawBought.current === false) {
      setBandsawUpgradeVisible(true);
    }

    if (numMachines >= CNC_THRESHOLD && cncBought.current === false) {
      setCncUpgradeVisible(true);
    }

    if (numRobots >= JITB_THRESHOLD && jitbBought.current === false) {
      setJitbUpgradeVisible(true);
    }

    if (numRobots >= MADTOWN_THRESHOLD && madtownBought.current === false) {
      setMadtownUpgradeVisible(true);
    }

    if (numRobots >= POOFS_THRESHOLD && poofsBought.current === false) {
      setPoofsUpgradeVisible(true);
    }

    if (
      numMentoredTeams >= FLL_TEAM_THRESHOLD &&
      fllTeamBought.current === false
    ) {
      setFllTeamUpgradeVisible(true);
    }

    if (
      numMentoredTeams >= FTC_TEAM_THRESHOLD &&
      ftcTeamBought.current === false
    ) {
      setFtcTeamUpgradeVisible(true);
    }

    if (
      numMentoredTeams >= FRC_TEAM_THRESHOLD &&
      frcTeamBought.current === false
    ) {
      setFrcTeamUpgradeVisible(true);
    }
  }, [
    numGamePieces,
    numMotors,
    numCameras,
    numMentors,
    numSponsors,
    numPrinters,
    numMachines,
    numRobots,
    numMentoredTeams,
  ]);

  return (
    <div className="flex flex-col h-fit w-[15dvw] min-w-20 max-w-100 max-h-105 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] absolute right-0 mr-5 rounded-xl p-[4px]">
      <div className="flex flex-col rounded-xl bg-black h-fit max-h-100 w-full justify-start items-center p-2 gap-3 overflow-y-auto no-scrollbar">
        <div className="flex flex-row rounded-full gap-2 bg-black border border-gray-900 h-fit min-h-10 w-full justify-start items-center overflow-x-auto no-scrollbar">
          <div
            className={`${strongerMouseUpgradeVisible ? "flex" : "hidden"}`}
            style={{ order: STRONGER_MOUSE_PRICE }}
          >
            <ToolTip
              name="Stronger Mouse"
              description="Can withstand your persistent clicking."
              effect={`${STRONGER_MOUSE_MULTIPLIER}x clicking multiplier`}
              cost={`${STRONGER_MOUSE_PRICE >= 1000000 ? numFormatter.format(STRONGER_MOUSE_PRICE) : STRONGER_MOUSE_PRICE} ${selectedGamePiece}`}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < STRONGER_MOUSE_PRICE)
                    return;
                  setClickMultiplier(
                    (prev) => prev * STRONGER_MOUSE_MULTIPLIER,
                  );
                  setStrongerMouseUpgradeVisible(false);
                  strongerMouseBought.current = true;
                  totalRef.current -= STRONGER_MOUSE_PRICE;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-10 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= STRONGER_MOUSE_PRICE - 1 ? "shadow-xl shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= STRONGER_MOUSE_PRICE - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  1 {/* placeholder */}
                </div>
              </button>
            </ToolTip>
          </div>
          <div
            className={`${powerDrillUpgradeVisible ? "flex" : "hidden"}`}
            style={{ order: POWER_DRILL_PRICE }}
          >
            <ToolTip
              name="Power Drill"
              description="How do you even click with this?"
              effect={`${POWER_DRILL_MULTIPLIER}x clicking multiplier`}
              cost={`${POWER_DRILL_PRICE >= 1000000 ? numFormatter.format(POWER_DRILL_PRICE) : POWER_DRILL_PRICE} ${selectedGamePiece}`}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < POWER_DRILL_PRICE) return;
                  setClickMultiplier((prev) => prev * POWER_DRILL_MULTIPLIER);
                  setPowerDrillUpgradeVisible(false);
                  powerDrillBought.current = true;
                  totalRef.current -= POWER_DRILL_PRICE;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-10 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= POWER_DRILL_PRICE - 1 ? "shadow-xl shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= POWER_DRILL_PRICE - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  2 {/* placeholder */}
                </div>
              </button>
            </ToolTip>
          </div>
          <div
            className={`${autoClickerUpgradeVisible ? "flex" : "hidden"}`}
            style={{ order: AUTOCLICKER_PRICE }}
          >
            <ToolTip
              name="Auto Clicker"
              description="How do you even click with this?"
              effect={`${AUTOCLICKER_MULTIPLIER}x clicking multiplier`}
              cost={`${AUTOCLICKER_PRICE >= 1000000 ? numFormatter.format(AUTOCLICKER_PRICE) : AUTOCLICKER_PRICE} ${selectedGamePiece}`}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < AUTOCLICKER_PRICE) return;
                  setClickMultiplier((prev) => prev * AUTOCLICKER_MULTIPLIER);
                  setAutoclickerUpgradeVisible(false);
                  autoClickerBought.current = true;
                  totalRef.current -= AUTOCLICKER_PRICE;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-10 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= AUTOCLICKER_PRICE - 1 ? "shadow-xl shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= AUTOCLICKER_PRICE - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  3 {/* placeholder */}
                </div>
              </button>
            </ToolTip>
          </div>
          <div
            className={`${silverGamePieceUpgradeVisible ? "flex" : "hidden"}`}
            style={{ order: SILVER_GAME_PIECE_PRICE }}
          >
            <ToolTip
              name="Silver Game Piece"
              description="That's one heavy game piece."
              effect={`${SILVER_GAME_PIECE_MULTIPLIER}x game piece multiplier`}
              cost={`${SILVER_GAME_PIECE_PRICE >= 1000000 ? numFormatter.format(SILVER_GAME_PIECE_PRICE) : SILVER_GAME_PIECE_PRICE} ${selectedGamePiece}`}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < SILVER_GAME_PIECE_PRICE)
                    return;
                  setGamePieceMultiplier(
                    (prev) => prev * SILVER_GAME_PIECE_MULTIPLIER,
                  );
                  setSilverGamePieceUpgradeVisible(false);
                  silverGamePieceBought.current = true;
                  totalRef.current -= SILVER_GAME_PIECE_PRICE;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-10 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= SILVER_GAME_PIECE_PRICE - 1 ? "shadow-xl shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= SILVER_GAME_PIECE_PRICE - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  4 {/* placeholder */}
                </div>
              </button>
            </ToolTip>
          </div>
          <div
            className={`${goldGamePieceUpgradeVisible ? "flex" : "hidden"}`}
            style={{ order: GOLD_GAME_PIECE_PRICE }}
          >
            <ToolTip
              name="Gold Game Piece"
              description="Ooh shiny"
              effect={`${GOLD_GAME_PIECE_MULTIPLIER}x game piece multiplier`}
              cost={`${GOLD_GAME_PIECE_PRICE >= 1000000 ? numFormatter.format(GOLD_GAME_PIECE_PRICE) : GOLD_GAME_PIECE_PRICE} ${selectedGamePiece}`}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < GOLD_GAME_PIECE_PRICE)
                    return;
                  setGamePieceMultiplier(
                    (prev) => prev * GOLD_GAME_PIECE_MULTIPLIER,
                  );
                  setGoldGamePieceUpgradeVisible(false);
                  goldGamePieceBought.current = true;
                  totalRef.current -= GOLD_GAME_PIECE_PRICE;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-10 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= GOLD_GAME_PIECE_PRICE - 1 ? "shadow-xl shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= GOLD_GAME_PIECE_PRICE - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  5 {/* placeholder */}
                </div>
              </button>
            </ToolTip>
          </div>
          <div
            className={`${diamondGamePieceUpgradeVisible ? "flex" : "hidden"}`}
            style={{ order: DIAMOND_GAME_PIECE_PRICE }}
          >
            <ToolTip
              name="Diamond Game Piece"
              description="The most expensive game piece."
              effect={`${DIAMOND_GAME_PIECE_MULTIPLIER}x game piece multiplier`}
              cost={`${DIAMOND_GAME_PIECE_PRICE >= 1000000 ? numFormatter.format(DIAMOND_GAME_PIECE_PRICE) : DIAMOND_GAME_PIECE_PRICE} ${selectedGamePiece}`}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < DIAMOND_GAME_PIECE_PRICE)
                    return;
                  setGamePieceMultiplier(
                    (prev) => prev * DIAMOND_GAME_PIECE_MULTIPLIER,
                  );
                  setDiamondGamePieceUpgradeVisible(false);
                  diamondGamePieceBought.current = true;
                  totalRef.current -= DIAMOND_GAME_PIECE_PRICE;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-10 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= DIAMOND_GAME_PIECE_PRICE - 1 ? "shadow-xl shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= DIAMOND_GAME_PIECE_PRICE - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  6 {/* placeholder */}
                </div>
              </button>
            </ToolTip>
          </div>
          <div
            className={`${neoUpgradeVisible ? "flex" : "hidden"}`}
            style={{ order: NEOS_PRICE }}
          >
            <ToolTip
              name="Neo"
              description="Just your average motor."
              effect={`${NEOS_MULTIPLIER}x motor multiplier`}
              cost={`${NEOS_PRICE >= 1000000 ? numFormatter.format(NEOS_PRICE) : NEOS_PRICE} ${selectedGamePiece}`}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < NEOS_PRICE) return;
                  setMotorMultiplier((prev) => prev * NEOS_MULTIPLIER);
                  setNeoUpgradeVisible(false);
                  neoBought.current = true;
                  totalRef.current -= NEOS_PRICE;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-10 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= NEOS_PRICE - 1 ? "shadow-xl shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= NEOS_PRICE - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  7 {/* placeholder */}
                </div>
              </button>
            </ToolTip>
          </div>
          <div
            className={`${krakenX44UpgradeVisible ? "flex" : "hidden"}`}
            style={{ order: KRAKEN_X44_PRICE }}
          >
            <ToolTip
              name="Kraken X44"
              description="The middle child of motors."
              effect={`${KRAKEN_X44_MULTIPLIER}x motor multiplier`}
              cost={`${KRAKEN_X44_PRICE >= 1000000 ? numFormatter.format(KRAKEN_X44_PRICE) : KRAKEN_X44_PRICE} ${selectedGamePiece}`}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < KRAKEN_X44_PRICE) return;
                  setMotorMultiplier((prev) => prev * KRAKEN_X44_MULTIPLIER);
                  setKrakenX44UpgradeVisible(false);
                  krakenX44Bought.current = true;
                  totalRef.current -= KRAKEN_X44_PRICE;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-10 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= KRAKEN_X44_PRICE - 1 ? "shadow-xl shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= KRAKEN_X44_PRICE - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  8 {/* placeholder */}
                </div>
              </button>
            </ToolTip>
          </div>
          <div
            className={`${krakenX60UpgradeVisible ? "flex" : "hidden"}`}
            style={{ order: KRAKEN_X60_PRICE }}
          >
            <ToolTip
              name="Kraken X60"
              description="Loves browning out your robot."
              effect={`${KRAKEN_X60_MULTIPLIER}x motor multiplier`}
              cost={`${KRAKEN_X60_PRICE >= 1000000 ? numFormatter.format(KRAKEN_X60_PRICE) : KRAKEN_X60_PRICE} ${selectedGamePiece}`}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < KRAKEN_X60_PRICE) return;
                  setMotorMultiplier((prev) => prev * KRAKEN_X60_MULTIPLIER);
                  setKrakenX60UpgradeVisible(false);
                  krakenX60Bought.current = true;
                  totalRef.current -= KRAKEN_X60_PRICE;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-10 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= KRAKEN_X60_PRICE - 1 ? "shadow-xl shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= KRAKEN_X60_PRICE - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  9 {/* placeholder */}
                </div>
              </button>
            </ToolTip>
          </div>
          <div
            className={`${arducamUpgradeVisible ? "flex" : "hidden"}`}
            style={{ order: ARDUCAM_PRICE }}
          >
            <ToolTip
              name="Arducam"
              description="That's one fast camera."
              effect={`${ARDUCAM_MULTIPLIER}x camera multiplier`}
              cost={`${ARDUCAM_PRICE >= 1000000 ? numFormatter.format(ARDUCAM_PRICE) : ARDUCAM_PRICE} ${selectedGamePiece}`}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < ARDUCAM_PRICE) return;
                  setCameraMultiplier((prev) => prev * ARDUCAM_MULTIPLIER);
                  setArducamUpgradeVisible(false);
                  arducamBought.current = true;
                  totalRef.current -= ARDUCAM_PRICE;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-10 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= ARDUCAM_PRICE - 1 ? "shadow-xl shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= ARDUCAM_PRICE - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  10 {/* placeholder */}
                </div>
              </button>
            </ToolTip>
          </div>
          <div
            className={`${thriftyCamUpgradeVisible ? "flex" : "hidden"}`}
            style={{ order: THRIFTY_CAM_PRICE }}
          >
            <ToolTip
              name="Thrifty Cam"
              description="Amazing thrift store find."
              effect={`${THRIFTY_CAM_MULTIPLIER}x camera multiplier`}
              cost={`${THRIFTY_CAM_PRICE >= 1000000 ? numFormatter.format(THRIFTY_CAM_PRICE) : THRIFTY_CAM_PRICE} ${selectedGamePiece}`}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < THRIFTY_CAM_PRICE) return;
                  setCameraMultiplier((prev) => prev * THRIFTY_CAM_MULTIPLIER);
                  setThriftyCamUpgradeVisible(false);
                  thriftyCamBought.current = true;
                  totalRef.current -= THRIFTY_CAM_PRICE;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-10 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= THRIFTY_CAM_PRICE - 1 ? "shadow-xl shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= THRIFTY_CAM_PRICE - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  11 {/* placeholder */}
                </div>
              </button>
            </ToolTip>
          </div>
          <div
            className={`${limelightUpgradeVisible ? "flex" : "hidden"}`}
            style={{ order: LIMELIGHT_PRICE }}
          >
            <ToolTip
              name="Limelight"
              description="See the field in green!"
              effect={`${LIMELIGHT_MULTIPLIER}x camera multiplier`}
              cost={`${LIMELIGHT_PRICE >= 1000000 ? numFormatter.format(LIMELIGHT_PRICE) : LIMELIGHT_PRICE} ${selectedGamePiece}`}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < LIMELIGHT_PRICE) return;
                  setCameraMultiplier((prev) => prev * LIMELIGHT_MULTIPLIER);
                  setLimelightUpgradeVisible(false);
                  limelightBought.current = true;
                  totalRef.current -= LIMELIGHT_PRICE;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-10 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= LIMELIGHT_PRICE - 1 ? "shadow-xl shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= LIMELIGHT_PRICE - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  12 {/* placeholder */}
                </div>
              </button>
            </ToolTip>
          </div>
          <div
            className={`${spacexEngineerUpgradeVisible ? "flex" : "hidden"}`}
            style={{ order: SPACEX_ENGINEER_PRICE }}
          >
            <ToolTip
              name="SpaceX Engineer"
              description="Puts a rocket engine on your robot."
              effect={`${SPACEX_ENGINEER_MULTIPLIER}x mentor multiplier`}
              cost={`${SPACEX_ENGINEER_PRICE >= 1000000 ? numFormatter.format(SPACEX_ENGINEER_PRICE) : SPACEX_ENGINEER_PRICE} ${selectedGamePiece}`}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < SPACEX_ENGINEER_PRICE)
                    return;
                  setMentorMultiplier(
                    (prev) => prev * SPACEX_ENGINEER_MULTIPLIER,
                  );
                  setSpacexEngineerUpgradeVisible(false);
                  spacexEngineerBought.current = true;
                  totalRef.current -= SPACEX_ENGINEER_PRICE;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-10 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= SPACEX_ENGINEER_PRICE - 1 ? "shadow-xl shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= SPACEX_ENGINEER_PRICE - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  13 {/* placeholder */}
                </div>
              </button>
            </ToolTip>
          </div>
          <div
            className={`${lockheedEngineerUpgradeVisible ? "flex" : "hidden"}`}
            style={{ order: LOCKHEED_ENGINEER_PRICE }}
          >
            <ToolTip
              name="Lockheed Engineer"
              description="Anti-defense system for your robot."
              effect={`${LOCKHEED_ENGINEER_MULTIPLIER}x mentor multiplier`}
              cost={`${LOCKHEED_ENGINEER_PRICE >= 1000000 ? numFormatter.format(LOCKHEED_ENGINEER_PRICE) : LOCKHEED_ENGINEER_PRICE} ${selectedGamePiece}`}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < LOCKHEED_ENGINEER_PRICE)
                    return;
                  setMentorMultiplier(
                    (prev) => prev * LOCKHEED_ENGINEER_MULTIPLIER,
                  );
                  setLockheedEngineerUpgradeVisible(false);
                  lockheedEngineerBought.current = true;
                  totalRef.current -= LOCKHEED_ENGINEER_PRICE;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-10 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= LOCKHEED_ENGINEER_PRICE - 1 ? "shadow-xl shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= LOCKHEED_ENGINEER_PRICE - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  14 {/* placeholder */}
                </div>
              </button>
            </ToolTip>
          </div>
          <div
            className={`${nasaEngineerUpgradeVisible ? "flex" : "hidden"}`}
            style={{ order: NASA_ENGINEER_PRICE }}
          >
            <ToolTip
              name="NASA Engineer"
              description="3, 2, 1, blastoff!"
              effect={`${NASA_ENGINEER_MULTIPLIER}x mentor multiplier`}
              cost={`${NASA_ENGINEER_PRICE >= 1000000 ? numFormatter.format(NASA_ENGINEER_PRICE) : NASA_ENGINEER_PRICE} ${selectedGamePiece}`}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < NASA_ENGINEER_PRICE)
                    return;
                  setMentorMultiplier(
                    (prev) => prev * NASA_ENGINEER_MULTIPLIER,
                  );
                  setNasaEngineerUpgradeVisible(false);
                  nasaEngineerBought.current = true;
                  totalRef.current -= NASA_ENGINEER_PRICE;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-10 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= NASA_ENGINEER_PRICE - 1 ? "shadow-xl shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= NASA_ENGINEER_PRICE - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  15 {/* placeholder */}
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
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= gamePiecePrice - 1 ? "bg-[#111111]" : "bg-black"}`}
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
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= motorPrice - 1 ? "bg-[#111111]" : "bg-black"}`}
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
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= cameraPrice - 1 ? "bg-[#111111]" : "bg-black"}`}
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
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= mentorPrice - 1 ? "bg-[#111111]" : "bg-black"}`}
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
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= sponsorPrice - 1 ? "bg-[#111111]" : "bg-black"}`}
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
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= printerPrice - 1 ? "bg-[#111111]" : "bg-black"}`}
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
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= machinePrice - 1 ? "bg-[#111111]" : "bg-black"}`}
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
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= robotPrice - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  Robot
                </div>
              </button>
            </ToolTip>
            <p className="flex font-semibold">{numRobots}</p>
          </div>
          <div
            className={`${numRobots >= 3 ? "flex flex-row" : "hidden"} w-full pr-2 pl-2 justify-around items-center`}
          >
            {/* TODO: make mentored team name dynamic */}
            <ToolTip
              name="Mentored Team"
              description="Our outreach knows no bounds."
              effect={`+${MENTORED_TEAM_EFFECT} ${selectedGamePiece.toLowerCase()} per second`}
              cost={`${mentoredTeamPrice >= 1000000 ? numFormatter.format(mentoredTeamPrice) : mentoredTeamPrice} ${selectedGamePiece.toLowerCase()}`}
              scroll={scrollY}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < mentoredTeamPrice) return;
                  setNumMentoredTeams((prev) => prev + 1);
                  totalRef.current -= mentoredTeamPrice;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-26 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) >= mentoredTeamPrice - 1 ? "shadow-lg shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) >= mentoredTeamPrice - 1 ? "bg-[#111111]" : "bg-black"}`}
                >
                  Team
                </div>
              </button>
            </ToolTip>
            <p className="flex font-semibold">{numMentoredTeams}</p>
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
