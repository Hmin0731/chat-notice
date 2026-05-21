/**
 * 16가지 결과 유형 — typeCode(MBTI)만 유지하면 계산 로직 재사용 가능
 */
export const results = {
  ISTJ: {
    typeCode: "ISTJ",
    title: "완벽주의 실무 기계",
    emoji: "📋",
    summary: "회사의 든든한 기둥. 규칙과 데이터로 세상을 정리하는 직장인 부캐.",
    description:
      "책임감이 강하고 약속을 지키는 타입이에요. 검증된 방식을 선호하며, 팀에 안정감을 줍니다. 가끔 융통성이 부족해 보일 수 있지만, 결과물의 품질은 믿을 만합니다.",
    goodMatch: ["ESFJ", "ESTJ"],
    badMatch: ["ENFP", "ENTP"],
  },
  ISFJ: {
    typeCode: "ISFJ",
    title: "조용한 팀 수호천사",
    emoji: "🛡️",
    summary: "뒤에서 모두를 챙기는 따뜻한 실무형. 말보다 행동으로 보여주는 부캐.",
    description:
      "세심하고 배려심이 깊어요. 동료의 컨디션을 먼저 살피며, 묵묵히 일을 해냅니다. 인정받을 때 더 빛나니 가끔 칭찬 한마디가 큰 힘이 됩니다.",
    goodMatch: ["ESTP", "ESFP"],
    badMatch: ["ENTJ", "INTJ"],
  },
  INFJ: {
    typeCode: "INFJ",
    title: "통찰력 있는 조용한 멘토",
    emoji: "🔮",
    summary: "사람과 비전을 동시에 보는 이상주의 실무자.",
    description:
      "깊이 생각하고 의미 있는 일을 추구해요. 조직의 방향이 어긋나면 먼저 느끼는 편이며, 진심 어린 조언으로 팀을 이끕니다.",
    goodMatch: ["ENFP", "ENTP"],
    badMatch: ["ESTP", "ISTP"],
  },
  INTJ: {
    typeCode: "INTJ",
    title: "전략 설계자",
    emoji: "♟️",
    summary: "장기 플랜과 효율로 승부하는 냉철한 브레인.",
    description:
      "비효율을 참지 못하고 구조를 개선하는 데 탁월해요. 감정보다 논리를 우선하지만, 목표 달성을 위해 팀을 이끄는 리더십이 있습니다.",
    goodMatch: ["ENFP", "ENTP"],
    badMatch: ["ESFP", "ISFP"],
  },
  ISTP: {
    typeCode: "ISTP",
    title: "위기 대응 만능 해결사",
    emoji: "🔧",
    summary: "말은 적지만 손으로 문제를 끝내는 실전형.",
    description:
      "위기 상황에서 침착하게 해법을 찾아요. 형식보다 결과를 중시하며, 자유로운 환경에서 능력을 발휘합니다.",
    goodMatch: ["ESTJ", "ESFJ"],
    badMatch: ["ENFJ", "INFJ"],
  },
  ISFP: {
    typeCode: "ISFP",
    title: "감성 크리에이터",
    emoji: "🎨",
    summary: "조용하지만 작품과 결과물로 존재감을 드러내는 부캐.",
    description:
      "미적 감각과 개인 가치를 중시해요. 압박이 심한 환경보다는 자율이 보장될 때 최고의 퍼포먼스를 냅니다.",
    goodMatch: ["ENFJ", "ESFJ"],
    badMatch: ["ENTJ", "ESTJ"],
  },
  INFP: {
    typeCode: "INFP",
    title: "가치 수호 몽상가",
    emoji: "🌱",
    summary: "의미 없는 일엔 에너지가 안 나는 진심 파이터.",
    description:
      "이상과 현실 사이에서 고민하지만, 믿는 일에는 열정을 쏟아요. 공감 능력이 뛰어나 팀의 분위기를 부드럽게 만듭니다.",
    goodMatch: ["ENFJ", "ENTJ"],
    badMatch: ["ESTJ", "ISTJ"],
  },
  INTP: {
    typeCode: "INTP",
    title: "아이디어 연구소장",
    emoji: "🧪",
    summary: "왜?를 끝없이 던지는 논리 덕후.",
    description:
      "새로운 관점과 분석을 즐겨요. 루틴 업무는 지루해할 수 있지만, 복잡한 문제를 풀 때 팀의 핵심 자산이 됩니다.",
    goodMatch: ["ENTJ", "ESTJ"],
    badMatch: ["ESFJ", "ISFJ"],
  },
  ESTP: {
    typeCode: "ESTP",
    title: "현장 액션 플레이어",
    emoji: "⚡",
    summary: "지금 당장 움직이는 스피드러너.",
    description:
      "기회를 놓치지 않고 빠르게 실행해요. 회의보다 현장, 계획보다 시행착오로 배우는 타입입니다.",
    goodMatch: ["ISFJ", "ISTJ"],
    badMatch: ["INFJ", "INTJ"],
  },
  ESFP: {
    typeCode: "ESFP",
    title: "분위기 메이커",
    emoji: "🎉",
    summary: "팀의 웃음과 에너지를 책임지는 인간 비타민.",
    description:
      "사람을 좋아하고 즉흥적으로 상황을 살려요. 자유로운 문화에서 창의력과 동기부여를 동시에 올려줍니다.",
    goodMatch: ["ISFJ", "ISTJ"],
    badMatch: ["INTJ", "INFJ"],
  },
  ENFP: {
    typeCode: "ENFP",
    title: "열정 폭발 아이디어뱅크",
    emoji: "🚀",
    summary: "새 프로젝트가 생기면 가장 먼저 눈이 반짝이는 타입.",
    description:
      "가능성과 사람을 연결하는 데 탁월해요. 시작은 화려하지만 마무리에 도움이 필요할 때가 있어, J형 동료와 찰떡궁합입니다.",
    goodMatch: ["INFJ", "INTJ"],
    badMatch: ["ISTJ", "ESTJ"],
  },
  ENTP: {
    typeCode: "ENTP",
    title: "논쟁 즐기는 혁신가",
    emoji: "💡",
    summary: "회의실의 토론왕, 남다른 각도의 제안자.",
    description:
      "틀을 깨는 질문으로 팀을 성장시켜요. 규칙에 얽매이면 답답해하지만, 변화가 필요한 순간엔 최고의 동반자입니다.",
    goodMatch: ["INFJ", "INTJ"],
    badMatch: ["ISFJ", "ESFJ"],
  },
  ESTJ: {
    typeCode: "ESTJ",
    title: "현장 지휘관",
    emoji: "📢",
    summary: "목표·역할·일정을 명확히 하는 실용 리더.",
    description:
      "조직력과 추진력이 뛰어나요. 결과 중심으로 팀을 이끌며, 애매한 상황을 정리하는 데 강합니다.",
    goodMatch: ["ISFP", "ISTP"],
    badMatch: ["INFP", "ENFP"],
  },
  ESFJ: {
    typeCode: "ESFJ",
    title: "팀 케어 매니저",
    emoji: "🤝",
    summary: "모두가 잘 지내야 일도 잘 된다고 믿는 조율자.",
    description:
      "협업과 소통을 중시해요. 구성원의 의견을 모아 합의를 이끌며, 조직 문화를 따뜻하게 만듭니다.",
    goodMatch: ["ISFP", "INFP"],
    badMatch: ["INTP", "ISTP"],
  },
  ENFJ: {
    typeCode: "ENFJ",
    title: "비전 코치",
    emoji: "🌟",
    summary: "사람의 성장을 이끄는 천생 리더.",
    description:
      "타인의 잠재력을 믿고 격려해요. 큰 그림을 그리면서도 관계를 세심히 챙기는, 팀이 원하는 멘토 타입입니다.",
    goodMatch: ["INFP", "ISFP"],
    badMatch: ["ISTP", "INTP"],
  },
  ENTJ: {
    typeCode: "ENTJ",
    title: "보스 캐릭터",
    emoji: "👑",
    summary: "목표 달성을 위해 과감히 결정하는 추진형 리더.",
    description:
      "속도와 성과를 중시해요. 도전적인 목표에 팀을 이끌며, 장기적으로 조직에 큰 성과를 만듭니다.",
    goodMatch: ["INTP", "INFP"],
    badMatch: ["ISFP", "ESFP"],
  },
};
