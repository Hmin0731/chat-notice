const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export async function fetchQuestions() {
  const res = await fetch(`${API_BASE}/api/questions`);
  if (!res.ok) throw new Error("질문을 불러오지 못했습니다.");
  return res.json();
}

export async function submitResults(answers) {
  const res = await fetch(`${API_BASE}/api/results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "결과 계산에 실패했습니다.");
  }
  return res.json();
}
