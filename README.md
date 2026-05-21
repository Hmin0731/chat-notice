# 나의 직장인 부캐 찾기 테스트

양산형 바이럴 심리테스트 (React + Express, DB 없음).

---

## 목차

1. [시작 전 준비](#1-시작-전-준비)
2. [로컬에서 서버 띄우기](#2-로컬에서-서버-띄우기-개발-모드)
3. [동작 확인](#3-동작-확인)
4. [문제 해결](#4-문제-해결)
5. [배포 전 빌드](#5-배포-전-빌드)
6. [배포하기](#6-배포하기)
   - [방법 A — 프론트(Vercel) + 백엔드(Render) 추천](#방법-a--프론트vercel--백엔드render-추천)
   - [방법 B — 한 대 VPS + Nginx](#방법-b--한-대-vps--nginx)
7. [콘텐츠만 바꿔 다른 테스트 만들기](#7-콘텐츠만-바꿔-다른-테스트-만들기)
8. [API 참고](#8-api-참고)

---

## 1. 시작 전 준비

### 1-1. Node.js 설치

- **Node.js 18 이상** 필요 ([다운로드](https://nodejs.org/))
- 설치 후 터미널에서 확인:

```bash
node -v
npm -v
```

`v18.x` 이상이 나오면 OK.

### 1-2. 프로젝트 폴더 위치 확인

이 README가 있는 폴더가 프로젝트 루트입니다.

```
chat-notice/          ← 여기가 루트
├── backend/
├── frontend/
└── README.md
```

아래 모든 명령은 **루트 기준**으로 `backend` 또는 `frontend` 폴더로 들어가서 실행합니다.

---

## 2. 로컬에서 서버 띄우기 (개발 모드)

개발할 때는 **터미널 2개**를 씁니다. (백엔드 1개 + 프론트 1개)

### 2-1. 백엔드 실행 (터미널 1)

**Windows PowerShell / CMD**

```powershell
cd "C:\Program Files\HyeonMin\99.Project\chat-notice\backend"
npm install
npm run dev
```

**macOS / Linux**

```bash
cd backend
npm install
npm run dev
```

성공 시 터미널에 아래처럼 표시됩니다.

```
[backend] Server running at http://localhost:4000
```

이 터미널은 **닫지 말고** 그대로 두세요.

| 스크립트 | 설명 |
|----------|------|
| `npm run dev` | 코드 수정 시 자동 재시작 (개발용) |
| `npm start` | 일반 실행 (배포·운영과 동일) |

### 2-2. 프론트엔드 실행 (터미널 2)

**새 터미널**을 열고:

**Windows PowerShell / CMD**

```powershell
cd "C:\Program Files\HyeonMin\99.Project\chat-notice\frontend"
npm install
npm run dev
```

**macOS / Linux**

```bash
cd frontend
npm install
npm run dev
```

성공 시 예시:

```
  VITE v6.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### 2-3. 브라우저에서 열기

1. 브라우저 주소창에 **http://localhost:5173** 입력
2. 「테스트 시작하기」 클릭 → 질문 진행 → 결과 확인

> 로컬 개발에서는 프론트(5173)가 `/api` 요청을 **자동으로** 백엔드(4000)로 넘깁니다.  
> 별도 `.env` 설정 없이 동작합니다.

### 2-4. 포트 정리

| 서비스 | 주소 | 역할 |
|--------|------|------|
| 프론트 | http://localhost:5173 | 화면 (React) |
| 백엔드 | http://localhost:4000 | API (`/api/questions`, `/api/results`) |

---

## 3. 동작 확인

### 3-1. 백엔드 API만 확인

브라우저 또는 터미널:

- http://localhost:4000/api/health → `{"status":"ok"}`
- http://localhost:4000/api/questions → 질문 JSON

**PowerShell 예시**

```powershell
Invoke-RestMethod http://localhost:4000/api/health
```

### 3-2. 프론트 전체 플로우 확인

1. http://localhost:5173 접속
2. 테스트 10문항 완료
3. 로딩 약 2초 후 결과 화면 표시
4. 「다시 하기」로 메인 복귀

---

## 4. 문제 해결

| 증상 | 해결 |
|------|------|
| `npm` 명령을 찾을 수 없음 | Node.js 재설치 후 터미널 재시작 |
| `EADDRINUSE` (4000 포트 사용 중) | 4000 포트 쓰는 프로그램 종료 후 백엔드 다시 실행 |
| 프론트에서 API 오류 / 네트워크 실패 | **백엔드 터미널이 켜져 있는지** 확인 (2-1) |
| `npm install` 권한 오류 (Windows) | 프로젝트를 `Program Files` 밖(예: `C:\dev\chat-notice`)으로 옮겨 시도 |
| PowerShell에서 `&&` 오류 | 명령을 **한 줄씩** 실행하거나 `;`로 연결 |

```powershell
cd backend; npm install; npm run dev
```

---

## 5. 배포 전 빌드

배포 전에 로컬에서 빌드가 되는지 확인합니다.

### 5-1. 프론트 빌드

```bash
cd frontend
npm install
npm run build
```

성공 시 `frontend/dist` 폴더가 생성됩니다.

### 5-2. 빌드 결과 미리보기 (선택)

백엔드는 그대로 켠 뒤, 프론트에서:

```bash
cd frontend
npm run preview
```

→ http://localhost:4173 (개발과 동일하게 `/api` 프록시 사용)

---

## 6. 배포하기

운영 환경에서는 **프론트(정적 파일)** 와 **백엔드(API)** 가 분리됩니다.  
프론트 빌드 시 백엔드 주소를 환경 변수로 넣어야 합니다.

```
사용자 브라우저
    → 프론트 (Vercel / Netlify / Nginx 등)
    → API 요청 → 백엔드 (Render / Railway 등)
```

### 공통: 프론트 환경 변수

배포 플랫폼에 아래 변수를 등록합니다.

| 변수명 | 값 예시 | 설명 |
|--------|---------|------|
| `VITE_API_BASE` | `https://chat-notice-api.onrender.com` | 백엔드 **루트 URL** (끝에 `/` 없이) |

로컬 예시 파일: `frontend/.env.example`

---

### 방법 A — 프론트(Vercel) + 백엔드(Render) (추천)

무료 티어로 시작하기 쉬운 조합입니다. **아래 순서대로** 진행하세요.

#### Step A-1. 백엔드를 Render에 배포

1. [Render](https://render.com) 가입 · 로그인
2. **New +** → **Web Service**
3. GitHub 저장소 연결 (또는 Manual Deploy로 `backend` 폴더 업로드)
4. 설정:

| 항목 | 값 |
|------|-----|
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free (테스트용) |

5. **Create Web Service** 클릭
6. 배포 완료 후 URL 복사 (예: `https://chat-notice-api.onrender.com`)

7. 동작 확인 (브라우저):

   - `https://YOUR-API.onrender.com/api/health`
   - `https://YOUR-API.onrender.com/api/questions`

#### Step A-2. 프론트를 Vercel에 배포

1. [Vercel](https://vercel.com) 가입 · 로그인
2. **Add New…** → **Project** → 같은 Git 저장소 Import
3. 설정:

| 항목 | 값 |
|------|-----|
| **Root Directory** | `frontend` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

4. **Environment Variables** 추가:

| Name | Value |
|------|-------|
| `VITE_API_BASE` | Step A-1에서 복사한 Render URL (예: `https://chat-notice-api.onrender.com`) |

5. **Deploy** 클릭
6. 배포 URL 접속 (예: `https://chat-notice.vercel.app`) → 테스트 진행

#### Step A-3. 배포 후 체크리스트

- [ ] Render `/api/health` 응답 OK
- [ ] Vercel 사이트에서 테스트 시작 → 결과까지 완료
- [ ] 브라우저 개발자도구(F12) → Network에서 `/api/questions` 요청이 **Render URL**로 가는지 확인

#### Step A-4. 코드 수정 후 재배포

| 수정 위치 | 재배포 대상 |
|-----------|-------------|
| `backend/src/**` | Render (자동 또는 Manual Deploy) |
| `frontend/src/**` | Vercel (push 시 자동) |
| `VITE_API_BASE` 변경 | Vercel 환경 변수 수정 후 **Redeploy** |

---

### 방법 B — 한 대 VPS + Nginx

도메인 1개로 프론트·API를 같이 쓰는 방식입니다.

#### Step B-1. 서버 준비

- Ubuntu 22.04 등 VPS
- Node.js 18+ 설치
- (선택) 도메인 DNS → 서버 IP 연결

#### Step B-2. 프로젝트 올리기

```bash
# 예: /var/www/chat-notice
git clone <저장소-URL> /var/www/chat-notice
cd /var/www/chat-notice
```

#### Step B-3. 백엔드 실행 (PM2)

```bash
cd /var/www/chat-notice/backend
npm install --production
npm install -g pm2
pm2 start src/index.js --name chat-notice-api
pm2 save
pm2 startup
```

백엔드는 내부 **4000** 포트에서 동작합니다.

#### Step B-4. 프론트 빌드

```bash
cd /var/www/chat-notice/frontend
npm install
```

빌드 시 API 주소를 **같은 도메인**으로 두면 Nginx가 `/api`만 백엔드로 넘깁니다.

```bash
# 같은 도메인 쓸 때는 비워 두거나 도메인만 지정
export VITE_API_BASE=
npm run build
```

`dist` 폴더가 생성됩니다.

#### Step B-5. Nginx 설정 예시

`/etc/nginx/sites-available/chat-notice`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 프론트 정적 파일
    root /var/www/chat-notice/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API → Node 백엔드
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

적용:

```bash
sudo ln -s /etc/nginx/sites-available/chat-notice /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

HTTPS는 [Certbot](https://certbot.eff.org/)으로 Let's Encrypt 적용을 권장합니다.

#### Step B-6. 확인

- http://your-domain.com → 메인 화면
- http://your-domain.com/api/health → `ok`

---

### 다른 호스팅 (요약)

| 역할 | 대안 서비스 |
|------|-------------|
| 백엔드 | Railway, Fly.io, AWS EC2, Azure App Service |
| 프론트 | Netlify, Cloudflare Pages, AWS S3 + CloudFront |

공통 규칙:

1. **백엔드**: `backend` 폴더, `npm start`, `PORT` 환경 변수(플랫폼이 자동 주입)
2. **프론트**: `frontend` 폴더, `npm run build`, `dist` 배포, **`VITE_API_BASE` = 백엔드 URL**

**Netlify** 사용 시: Site settings → Environment variables에 `VITE_API_BASE` 추가 후 Build.

---

## 7. 콘텐츠만 바꿔 다른 테스트 만들기

코드 구조는 그대로 두고 **데이터 3곳**만 수정합니다.

| 파일 | 내용 |
|------|------|
| `backend/src/config/testConfig.js` | 제목, 부제, 설명 |
| `backend/src/data/questions.js` | 질문 10개, 선택지 `dimension` (E/I/S/N/T/F/P/J) |
| `backend/src/data/results.js` | 16유형 (`ISTJ`, `ENFP` 등) 결과 텍스트 |

수정 후:

- 로컬: 백엔드 `npm run dev` 재시작 (watch면 자동)
- 배포: 백엔드·프론트 각각 재배포 (프론트는 UI 문구만 바꿀 때는 백엔드만 배포해도 됨)

---

## 8. API 참고

### `GET /api/health`

서버 상태 확인.

### `GET /api/questions`

질문 목록 + `config` (타이틀 등).

### `POST /api/results`

**Request**

```json
{
  "answers": [
    { "questionId": 1, "optionIndex": 0 },
    { "questionId": 2, "optionIndex": 1 }
  ]
}
```

**Response** (요약)

```json
{
  "typeCode": "ENFP",
  "scores": { "E": 2, "I": 0, "S": 1, "N": 1, "T": 0, "F": 2, "P": 1, "J": 1 },
  "result": {
    "typeCode": "ENFP",
    "title": "...",
    "emoji": "...",
    "summary": "...",
    "description": "...",
    "goodMatch": ["INFJ", "INTJ"],
    "badMatch": ["ISTJ", "ESTJ"]
  }
}
```

---

## 기술 스택 · 폴더 구조

| 구분 | 스택 |
|------|------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express (인메모리 JSON) |

```
chat-notice/
├── backend/src/
│   ├── config/testConfig.js
│   ├── data/questions.js
│   ├── data/results.js
│   ├── services/resultCalculator.js
│   └── routes/
├── frontend/src/
│   ├── components/
│   ├── hooks/useTest.js
│   └── api/client.js
└── README.md
```

## 화면 흐름

1. 메인 → 테스트 시작  
2. 질문 10개 (프로그레스 바)  
3. 로딩 2초  
4. 결과 (공유, 다시 하기, 하단 광고 영역)
