import React, { useRef, useEffect, useState, UIEvent } from "react";
import Image from "next/image";

//more items constants
const GAME_PIECE_PRICE_SCALING = 1.22;
const GAME_PIECE_EFFECT = 2; //in game pieces per second
const GAME_PIECE_STARTING_PRICE = 25; //in game pieces

const MOTOR_PRICE_SCALING = 1.24;
const MOTOR_EFFECT = 10;
const MOTOR_STARTING_PRICE = 100;

const CAMERA_PRICE_SCALING = 1.28;
const CAMERA_EFFECT = 100;
const CAMERA_STARTING_PRICE = 700;

//upgrade constants
const STRONGER_MOUSE_PRICE = 3000;
const STRONGER_MOUSE_MULTIPLIER = 2; //adds a +2x multiplier

export default function FRCClicker() {
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

  useEffect(() => {
    setGamePiecesPerSecond(totalGamePieceEffect + totalMotorEffect);
  }, [totalGamePieceEffect, totalMotorEffect]);

  return (
    <main className="flex w-full items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="h-[calc(100dvh-4rem)] w-full flex flex-row items-center justify-center">
        <RebuiltFuel
          totalRef={totalRef}
          total={total}
          setTotal={setTotal}
          perSecond={gamePiecesPerSecond}
          clickMultiplier={clickMultiplier}
        />
        <SideCatalog
          totalRef={totalRef}
          selectedGamePiece="Fuel"
          setClickMultiplier={setClickMultiplier}
          setTotalGamePieceEffect={setTotalGamePieceEffect}
          setTotalMotorEffect={setTotalMotorEffect}
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
  return (
    <div className="flex flex-col w-fit h-fit rounded-full gap-2 justify-center items-center">
      <div className="flex flex-col w-fit h-fit gap-1 justify-center items-center">
        <p className="font-bold text-2xl">{Math.floor(total)} fuel</p>
        <p>{perSecond} fuel per second</p>
      </div>
      <button onClick={() => setTotal((prev) => prev + clickMultiplier)}>
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
}: {
  totalRef: React.RefObject<number>;
  selectedGamePiece: string;
  setClickMultiplier: React.Dispatch<React.SetStateAction<number>>;
  setTotalGamePieceEffect: React.Dispatch<React.SetStateAction<number>>;
  setTotalMotorEffect: React.Dispatch<React.SetStateAction<number>>;
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

  //upgrades
  const [strongerMouseUpgradeVisible, setStrongerMouseUpgradeVisible] =
    useState(true);

  return (
    <div className="flex flex-col h-fit w-[15dvw] min-w-20 max-w-100 max-h-105 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] absolute right-0 mr-5 rounded-xl p-[4px]">
      <div className="flex flex-col rounded-xl bg-black h-fit max-h-100 w-full justify-start items-center p-2 gap-3 overflow-y-auto no-scrollbar">
        <div className="flex flex-row rounded-full gap-2 bg-black h-fit min-h-10 w-full justify-start items-center overflow-x-auto no-scrollbar">
          <div className={`${strongerMouseUpgradeVisible ? "flex" : "hidden"}`}>
            <ToolTip
              name="Stronger Mouse"
              description="Can withstand your persistent clicking"
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
                className={`group flex rounded-full items-center justify-center h-10 w-10 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) > STRONGER_MOUSE_PRICE ? "shadow-xl shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full group-hover:bg-[#111111] transition-all ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) > STRONGER_MOUSE_PRICE ? "bg-[#0a0a0a]" : "bg-black"}`}
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
              description={`More ${selectedGamePiece.toLowerCase()} for human matches`}
              effect={`+${GAME_PIECE_EFFECT} ${selectedGamePiece.toLowerCase()} per second`}
              cost={`${gamePiecePrice} ${selectedGamePiece.toLowerCase()}`}
              scroll={scrollY}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < gamePiecePrice) return;
                  setNumGamePieces((prev) => prev + 1);
                  totalRef.current -= gamePiecePrice;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-26 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) > gamePiecePrice ? "shadow-lg shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full bg-black group-hover:bg-[#111111] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) > gamePiecePrice ? "bg-[#0a0a0a]" : "bg-black"}`}
                >
                  {selectedGamePiece}
                </div>
              </button>
            </ToolTip>
            <p className="flex font-semibold">{numGamePieces}</p>
          </div>
          {/* More motors */}
          {/* TODO: change numGamePieces >= 1 to >= 5*/}
          <div
            className={`${numGamePieces >= 5 ? "flex flex-row" : "hidden"} w-full pr-2 pl-2 justify-around items-center`}
          >
            {/* TODO: make motor name dynamic depending on whether it is neo/kraken x44/x60 */}
            <ToolTip
              name="Motor"
              description="More motors could never hurt"
              effect={`+${MOTOR_EFFECT} ${selectedGamePiece.toLowerCase()} per second`}
              cost={`${motorPrice} ${selectedGamePiece.toLowerCase()}`}
              scroll={scrollY}
            >
              <button
                onClick={() => {
                  if (Math.floor(totalRef.current) < motorPrice) return;
                  setNumMotors((prev) => prev + 1);
                  totalRef.current -= motorPrice;
                }}
                className={`group flex rounded-full items-center justify-center h-10 w-26 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300 ${Math.floor(totalRef.current) > motorPrice ? "shadow-lg shadow-[#110e73]/50" : "shadow-none"}`}
              >
                <div
                  className={`rounded-full bg-black group-hover:bg-[#111111] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300 ${Math.floor(totalRef.current) > motorPrice ? "bg-[#0a0a0a]" : "bg-black"}`}
                >
                  Motor
                </div>
              </button>
            </ToolTip>
            <p className="flex font-semibold">{numMotors}</p>
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
