import { Router } from "express";
import { questions } from "../data/questions.js";
import { calculateResultFromAnswers } from "../services/resultCalculator.js";

const router = Router();

/**
 * POST body: { answers: [{ questionId: number, optionIndex: 0|1 }] }
 * 또는 { dimensions: ["E","S",...] }
 */
router.post("/", (req, res) => {
  const { answers, dimensions } = req.body ?? {};

  let resolvedDimensions;

  if (Array.isArray(dimensions) && dimensions.length > 0) {
    resolvedDimensions = dimensions.map((d) => ({ dimension: d }));
  } else if (Array.isArray(answers) && answers.length > 0) {
    resolvedDimensions = answers.map((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) {
        return null;
      }
      const option = question.options[answer.optionIndex];
      if (!option) {
        return null;
      }
      return { dimension: option.dimension };
    });

    if (resolvedDimensions.some((a) => a === null)) {
      return res.status(400).json({
        error: "Invalid questionId or optionIndex in answers.",
      });
    }
  } else {
    return res.status(400).json({
      error: "Provide 'answers' or 'dimensions' in request body.",
    });
  }

  const payload = calculateResultFromAnswers(resolvedDimensions);

  if (!payload.result) {
    return res.status(500).json({
      error: `Unknown type code: ${payload.typeCode}`,
    });
  }

  res.json({
    typeCode: payload.typeCode,
    scores: payload.scores,
    result: payload.result,
  });
});

export default router;
