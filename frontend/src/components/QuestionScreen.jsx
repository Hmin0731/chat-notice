import ProgressBar from "./ProgressBar.jsx";

export default function QuestionScreen({
  question,
  currentIndex,
  total,
  onSelect,
}) {
  if (!question) return null;

  return (
    <div key={question.id} className="screen-enter px-5 py-6">
      <ProgressBar current={currentIndex + 1} total={total} />

      <p className="mt-8 text-sm font-medium text-indigo-600">
        Q{question.id}
      </p>
      <h2 className="mt-2 text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
        {question.text}
      </h2>

      <ul className="mt-8 space-y-3">
        {question.options.map((option, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => onSelect(index)}
              className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-left text-base font-medium text-slate-800 shadow-sm transition hover:border-indigo-400 hover:bg-indigo-50 active:scale-[0.99]"
            >
              <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                {String.fromCharCode(65 + index)}
              </span>
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
