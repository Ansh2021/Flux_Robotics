import express from "express";
import {
  getAreaData,
  getTeamData,
} from "../controllers/wordle/frcWordleController.js";
import { getTriviaQuestions } from "../controllers/trivia/frcTriviaController.js";

export const router = express.Router();

//wordle
router.get("/wordle/team", getTeamData);
router.get("/wordle/multiple", getAreaData);

//trivia
router.get("/trivia/get-questions", getTriviaQuestions);
