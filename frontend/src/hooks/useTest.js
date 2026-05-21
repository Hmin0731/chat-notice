import { useCallback, useEffect, useState } from "react";
import { fetchQuestions, submitResults } from "../api/client.js";
import { LOADING_DURATION_MS, SCREENS } from "../constants/screens.js";

export function useTest() {
  const [screen, setScreen] = useState(SCREENS.MAIN);
  const [config, setConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions()
      .then((data) => {
        setConfig(data.config);
        if (data.config?.title) {
          document.title = data.config.title;
        }
      })
      .catch(() => {});
  }, []);

  const loadQuestions = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchQuestions();
      setConfig(data.config);
      setQuestions(data.questions);
      setCurrentIndex(0);
      setAnswers([]);
      setResultData(null);
      setScreen(SCREENS.QUESTION);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const finishTest = useCallback(async (finalAnswers) => {
    setAnswers(finalAnswers);
    setScreen(SCREENS.LOADING);
    setError(null);

    const delay = new Promise((r) => setTimeout(r, LOADING_DURATION_MS));
    const apiCall = submitResults(finalAnswers);

    try {
      const [data] = await Promise.all([apiCall, delay]);
      setResultData(data);
      setScreen(SCREENS.RESULT);
    } catch (e) {
      setError(e.message);
      setScreen(SCREENS.QUESTION);
    }
  }, []);

  const selectOption = useCallback(
    (optionIndex) => {
      const question = questions[currentIndex];
      if (!question) return;

      const newAnswer = {
        questionId: question.id,
        optionIndex,
      };
      const nextAnswers = [...answers, newAnswer];

      if (currentIndex < questions.length - 1) {
        setAnswers(nextAnswers);
        setCurrentIndex((i) => i + 1);
      } else {
        finishTest(nextAnswers);
      }
    },
    [answers, currentIndex, questions, finishTest]
  );

  const restart = useCallback(() => {
    setScreen(SCREENS.MAIN);
    setCurrentIndex(0);
    setAnswers([]);
    setResultData(null);
    setError(null);
  }, []);

  return {
    screen,
    config,
    questions,
    currentIndex,
    answers,
    resultData,
    error,
    loading,
    startTest: loadQuestions,
    selectOption,
    restart,
  };
}
