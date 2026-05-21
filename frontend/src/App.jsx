import LoadingScreen from "./components/LoadingScreen.jsx";
import MainScreen from "./components/MainScreen.jsx";
import QuestionScreen from "./components/QuestionScreen.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import { SCREENS } from "./constants/screens.js";
import { useTest } from "./hooks/useTest.js";

export default function App() {
  const {
    screen,
    config,
    questions,
    currentIndex,
    resultData,
    error,
    loading,
    startTest,
    selectOption,
    restart,
  } = useTest();

  const currentQuestion = questions[currentIndex];

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-slate-50/90 px-5 py-4 backdrop-blur">
        <p className="text-center text-sm font-semibold text-slate-600">
          {config?.title ?? "직장인 부캐 테스트"}
        </p>
      </header>

      <main className="pb-8">
        {error && (
          <div
            role="alert"
            className="mx-5 mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {error}
          </div>
        )}

        {screen === SCREENS.MAIN && (
          <MainScreen
            config={config}
            onStart={startTest}
            loading={loading}
          />
        )}

        {screen === SCREENS.QUESTION && currentQuestion && (
          <QuestionScreen
            question={currentQuestion}
            currentIndex={currentIndex}
            total={questions.length}
            onSelect={selectOption}
          />
        )}

        {screen === SCREENS.LOADING && <LoadingScreen />}

        {screen === SCREENS.RESULT && (
          <ResultScreen resultData={resultData} onRestart={restart} />
        )}
      </main>
    </div>
  );
}
