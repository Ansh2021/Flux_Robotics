"use client";

import { use } from "react";
import { notFound } from "next/navigation";

export default function TeamBuilder({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);

  if (!(type.toLowerCase() === "frc" || type.toLowerCase() === "ftc")) {
    notFound();
  }

  return <h1>{type.toUpperCase()} Team Builder</h1>;
}
