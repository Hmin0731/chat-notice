import { Router } from "express";
import { testConfig } from "../config/testConfig.js";
import { questions } from "../data/questions.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    config: testConfig,
    questions,
  });
});

export default router;
