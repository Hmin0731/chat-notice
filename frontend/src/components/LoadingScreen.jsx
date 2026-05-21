export default function LoadingScreen() {
  return (
    <div className="screen-enter flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-3 w-3 rounded-full bg-indigo-500 animate-bounce-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <h2 className="text-xl font-bold text-slate-800">결과 분석 중...</h2>
      <p className="mt-2 text-sm text-slate-500">
        당신의 직장인 부캐를 찾고 있어요
      </p>
      <div className="mt-10 h-1 w-48 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full w-1/2 animate-pulse-slow rounded-full bg-indigo-400" />
      </div>
    </div>
  );
}
