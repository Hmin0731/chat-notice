import { results } from "../data/results.js";

const PAIRS = [
  ["E", "I"],
  ["S", "N"],
  ["T", "F"],
  ["P", "J"],
];

/**
 * 선택지 dimension 배열로 MBTI 4글자 코드 계산
 * @param {string[]} dimensions - 각 질문에서 선택한 dimension (예: ["E","S","T","J", ...])
 */
export function calculateTypeCode(dimensions) {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, P: 0, J: 0 };

  for (const dim of dimensions) {
    const key = String(dim).toUpperCase();
    if (Object.prototype.hasOwnProperty.call(scores, key)) {
      scores[key] += 1;
    }
  }

  let code = "";
  for (const [a, b] of PAIRS) {
    code += scores[a] >= scores[b] ? a : b;
  }
  return code;
}

export function getResultByTypeCode(typeCode) {
  const normalized = String(typeCode).toUpperCase();
  const result = results[normalized];
  if (!result) {
    return null;
  }
  return { ...result };
}

export function calculateResultFromAnswers(answers) {
  const dimensions = answers.map((a) => a.dimension);
  const typeCode = calculateTypeCode(dimensions);
  const result = getResultByTypeCode(typeCode);

  return {
    typeCode,
    scores: buildScoreSummary(dimensions),
    result,
  };
}

function buildScoreSummary(dimensions) {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, P: 0, J: 0 };
  for (const dim of dimensions) {
    const key = String(dim).toUpperCase();
    if (scores[key] !== undefined) scores[key] += 1;
  }
  return scores;
}
