export default function MainScreen({ config, onStart, loading }) {
  const title = config?.title ?? "나의 직장인 부캐 찾기 테스트";
  const subtitle = config?.subtitle ?? "회사에서 숨겨진 나의 진짜 모습은?";
  const description =
    config?.description ??
    "10가지 질문으로 당신의 직장인 부캐(16유형)를 알아보세요.";

  return (
    <div className="screen-enter flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div
        className="mb-8 flex h-40 w-40 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-200 shadow-inner"
        aria-hidden
      >
        <span className="text-7xl">💼</span>
      </div>

      <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
        MBTI형 심리테스트
      </p>
      <h1 className="mb-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
        {title}
      </h1>
      <p className="mb-2 text-lg text-slate-600">{subtitle}</p>
      <p className="mb-10 max-w-sm text-sm text-slate-500">{description}</p>

      <button
        type="button"
        onClick={onStart}
        disabled={loading}
        className="w-full max-w-xs rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? "준비 중..." : "테스트 시작하기"}
      </button>

      <p className="mt-6 text-xs text-slate-400">약 2분 · 문항 10개</p>
    </div>
  );
}
