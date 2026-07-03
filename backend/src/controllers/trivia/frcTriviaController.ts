import { Request, Response } from "express";
import { supabaseClient } from "../../supabase.js";

interface TriviaQuestions {
  category: string[];
  era: string[];
  difficulty: string[];
  answerType: string[];
}
export const getTriviaQuestions = async (
  req: Request<TriviaQuestions>,
  res: Response,
): Promise<Response> => {
  const { category, era, difficulty, answerType } = req.query;

  if (
    category?.length === 0 ||
    era?.length === 0 ||
    difficulty?.length === 0 ||
    answerType?.length === 0
  ) {
    return res.status(400).json({ data: [], message: "Missing fields" });
  }

  const categories = (Array.isArray(category) ? category : [category]) as (
    | string
    | null
  )[];
  const eras = (Array.isArray(era) ? era : [era]) as (string | null)[];
  const difficulties = (
    Array.isArray(difficulty) ? difficulty : [difficulty]
  ) as (string | null)[];
  const answerTypes = (
    Array.isArray(answerType) ? answerType : [answerType]
  ) as (string | null)[];

  const { data, error } = await supabaseClient
    .from("frc_trivia")
    .select("*")
    .in("core_category", categories)
    .in("era", eras)
    .in("difficulty", difficulties)
    .in("answer_type", answerTypes);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
};
