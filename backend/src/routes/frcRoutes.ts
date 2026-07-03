import express from "express";
import {
  getSingleTeamData,
  test,
  testAgain,
  testAgainin,
} from "../controllers/wordle/frcWordleController.js";
import { getAreaTeamData } from "../controllers/wordle/frcWordleController.js";
import { getTriviaQuestions } from "../controllers/trivia/frcTriviaController.js";

export const router = express.Router();

//wordle
router.get("/wordle/team", testAgainin);
router.get("/wordle/multiple", testAgain);

//trivia
router.get("/trivia/get-questions", getTriviaQuestions);
