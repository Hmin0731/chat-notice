import { useMemo } from "react";

function buildKakaoShareText(result, typeCode) {
  const title = result?.title ?? "나의 직장인 부캐";
  return `[직장인 부캐 테스트] 나는 ${typeCode} · ${title}! 당신의 부캐도 확인해보세요.`;
}

export default function ResultScreen({ resultData, onRestart }) {
  const { typeCode, result } = resultData ?? {};
  const shareText = useMemo(
    () => buildKakaoShareText(result, typeCode),
    [result, typeCode]
  );

  const handleKakaoShare = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(shareText);
    window.open(
      `https://sharer.kakao.com/talk/friends/picker/link?url=${url}&text=${text}`,
      "_blank",
      "noopener,noreferrer,width=420,height=640"
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${shareText}\n${window.location.href}`
      );
      alert("결과가 클립보드에 복사되었습니다!");
    } catch {
      alert("복사에 실패했습니다. 브라우저 권한을 확인해주세요.");
    }
  };

  if (!result) return null;

  return (
    <div className="screen-enter px-5 pb-32 pt-6">
      <div className="rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 p-6 text-white shadow-xl">
        <p className="text-sm font-medium opacity-90">당신의 직장인 부캐</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-5xl">{result.emoji}</span>
          <div>
            <p className="text-2xl font-bold">{result.title}</p>
            <p className="text-lg font-semibold opacity-90">{typeCode}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed opacity-95">
          {result.summary}
        </p>
      </div>

      <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-500">상세 설명</h3>
        <p className="mt-2 text-base leading-relaxed text-slate-700">
          {result.description}
        </p>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <section className="rounded-2xl bg-emerald-50 p-4">
          <h3 className="text-xs font-bold text-emerald-700">잘 맞는 유형</h3>
          <p className="mt-2 font-semibold text-emerald-900">
            {result.goodMatch?.join(", ")}
          </p>
        </section>
        <section className="rounded-2xl bg-rose-50 p-4">
          <h3 className="text-xs font-bold text-rose-700">안 맞는 유형</h3>
          <p className="mt-2 font-semibold text-rose-900">
            {result.badMatch?.join(", ")}
          </p>
        </section>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleKakaoShare}
          className="w-full rounded-2xl bg-[#FEE500] py-4 font-semibold text-[#3C1E1E] transition hover:brightness-95"
        >
          카카오톡 공유하기
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="w-full rounded-2xl border-2 border-slate-200 bg-white py-4 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          결과 텍스트 복사
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="w-full rounded-2xl bg-indigo-600 py-4 font-semibold text-white transition hover:bg-indigo-700"
        >
          다시 하기
        </button>
      </div>

      <aside
        className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-slate-100 px-4 py-4"
        aria-label="광고 배너 영역"
      >
        <div className="mx-auto flex max-w-lg items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white py-6 text-center text-sm text-slate-400">
          광고 배너 영역 (320×50 / 320×100 등 삽입)
        </div>
      </aside>
    </div>
  );
}
