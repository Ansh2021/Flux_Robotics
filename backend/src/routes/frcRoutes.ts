import express from "express";
import { getSingleTeamData } from "../controllers/wordle/frcWordleController.js";
import { getAreaTeamData } from "../controllers/wordle/frcWordleController.js";
import { getTriviaQuestions } from "../controllers/trivia/frcTriviaController.js";

export const router = express.Router();

//wordle
router.get("/wordle/team", getSingleTeamData);
router.get("/wordle/multiple", getAreaTeamData);

//trivia
router.get("/trivia/get-questions", getTriviaQuestions);
