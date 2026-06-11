import express from "express";
import { getSingleTeamData } from "../controllers/frcWordleController.js";
import { getAreaTeamData } from "../controllers/frcWordleController.js";

export const router = express.Router();

//TODO: replace the req/res with the controller i will be using for this
//almost done
router.get("/wordle/team", getSingleTeamData);

router.get("/wordle/multiple", getAreaTeamData);
