"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import FRCClicker from "./frcClicker";
import FTCClicker from "./ftcClicker";

export default function Trivia({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);

  // if (!(type.toLowerCase() === "frc" || type.toLowerCase() === "ftc")) {
  //   notFound();
  // }

  if (type.toLowerCase() === "frc") {
    return <FRCClicker />;
  }

  if (type.toLowerCase() === "ftc") {
    return <FTCClicker />;
  }
}
