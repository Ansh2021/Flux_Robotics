"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import FRCWordle from "./frcWordle";
import FTCWordle from "./ftcWordle";

export default function Wordle({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);
  // console.log(type);

  // if (!(type.toLowerCase() === "frc" || type.toLowerCase() === "ftc")) {
  //   notFound();
  // }

  if (type.toLowerCase() === "frc") {
    return <FRCWordle />;
  }

  if (type.toLowerCase() === "ftc") {
    return <FTCWordle />;
  }
}
