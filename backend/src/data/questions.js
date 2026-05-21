/**
 * 질문 데이터 — JSON 형태로 분리해 다른 테스트로 교체 가능
 * 각 선택지는 dimension(E/I/S/N/T/F/P/J)에 점수 +1
 */
export const questions = [
  {
    id: 1,
    text: "점심시간, 동료가 갑자기 말을 걸면?",
    options: [
      { label: "반가워서 수다 떨며 에너지 충전", dimension: "E" },
      { label: "혼자만의 시간이 필요해서 짧게 대답", dimension: "I" },
    ],
  },
  {
    id: 2,
    text: "팀 회식 초대가 왔을 때?",
    options: [
      { label: "사람들과 어울리며 분위기 띄우기", dimension: "E" },
      { label: "일찍 빠지거나 소규모로만 참여", dimension: "I" },
    ],
  },
  {
    id: 3,
    text: "새 프로젝트 브리핑을 들을 때?",
    options: [
      { label: "지금 당장 실행할 구체적 단계부터 생각", dimension: "S" },
      { label: "큰 그림과 미래 가능성부터 상상", dimension: "N" },
    ],
  },
  {
    id: 4,
    text: "업무 매뉴얼을 읽을 때?",
    options: [
      { label: "검증된 절차와 사례를 그대로 따름", dimension: "S" },
      { label: "왜 이렇게 하는지 맥락과 의미를 먼저 파악", dimension: "N" },
    ],
  },
  {
    id: 5,
    text: "동료가 실수로 곤란해할 때?",
    options: [
      { label: "문제 해결과 공정한 기준을 먼저 제시", dimension: "T" },
      { label: "상대 기분과 관계를 먼저 살핌", dimension: "F" },
    ],
  },
  {
    id: 6,
    text: "성과 평가 피드백을 받을 때?",
    options: [
      { label: "수치와 사실 위주로 개선점 파악", dimension: "T" },
      { label: "노력과 성장 스토리에 공감받고 싶음", dimension: "F" },
    ],
  },
  {
    id: 7,
    text: "마감이 다가올 때 나는?",
    options: [
      { label: "계획표 짜고 단계별로 차근차근 진행", dimension: "J" },
      { label: "마감 직전 집중력으로 몰아서 끝냄", dimension: "P" },
    ],
  },
  {
    id: 8,
    text: "책상 위 업무 환경은?",
    options: [
      { label: "정리정돈된 상태가 마음이 편함", dimension: "J" },
      { label: "자유로운 배치가 오히려 아이디어가 남", dimension: "P" },
    ],
  },
  {
    id: 9,
    text: "회의에서 의견을 낼 때?",
    options: [
      { label: "경험과 데이터 기반으로 현실적 제안", dimension: "S" },
      { label: "아직 없는 아이디어와 대안을 던짐", dimension: "N" },
    ],
  },
  {
    id: 10,
    text: "주말에 일이 생기면?",
    options: [
      { label: "미리 일정에 넣고 준비해 두는 편", dimension: "J" },
      { label: "그때그때 상황 보며 유연하게 대응", dimension: "P" },
    ],
  },
];
