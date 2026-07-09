"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import FRCTrivia from "./frcTrivia";
import FTCTrivia from "./ftcTrivia";

export default function Trivia({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);

  if (!(type.toLowerCase() === "frc" || type.toLowerCase() === "ftc")) {
    notFound();
  }

  if (type.toLowerCase() === "frc") {
    return <FRCTrivia />;
  }

  if (type.toLowerCase() === "ftc") {
    return <FTCTrivia />;
  }
}
