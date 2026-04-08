# TRD (Technical Requirements Document)
# 딥러닝 Week 5 학습 플랫폼

**버전**: v1.0  
**작성일**: 2026-04-08  
**참조 문서**: PRD v1.0

---

## 1. 기술 스택 (Tech Stack)

| 영역 | 기술 | 버전 |
|------|------|------|
| **Frontend** | React | ^19 |
| **Frontend Styling** | Tailwind CSS | ^4 |
| **Backend** | FastAPI | ^0.115 |
| **Runtime (BE)** | Python | ^3.12 |
| **Database** | SQLite + SQLAlchemy | SQLAlchemy ^2 |
| **인증** | Google OAuth 2.0 + JWT | - |
| **결제** | Polar.sh | - |
| **배포** | Vercel (FE) + Vercel Serverless (BE) | - |
| **패키지 관리 (FE)** | pnpm | ^9 |
| **패키지 관리 (BE)** | uv | ^0.5 |

---

## 2. 시스템 아키텍처 (System Architecture)

```
┌─────────────────────────────────────────────────────────┐
│                        Client                           │
│              React + Tailwind (Vercel CDN)              │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS / REST
┌───────────────────────▼─────────────────────────────────┐
│                   FastAPI Backend                        │
│              (Vercel Serverless Functions)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Auth     │  │ Content  │  │ Payment (Webhook)     │  │
│  │ Router   │  │ Router   │  │ Router               │  │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘  │
└───────┼─────────────┼───────────────────┼──────────────┘
        │             │                   │
┌───────▼─────────────▼───────────────────▼──────────────┐
│                  SQLite (SQLAlchemy ORM)                 │
│         users | subscriptions | chapters                 │
└─────────────────────────────────────────────────────────┘
        │                               │
┌───────▼───────┐               ┌───────▼──────────┐
│  Google OAuth │               │    Polar.sh       │
│  (외부 서비스) │               │   (결제 / Webhook) │
└───────────────┘               └──────────────────┘
```

---

## 3. 디렉토리 구조 (Project Structure)

```
project-root/
├── frontend/                    # React 앱
│   ├── public/
│   ├── src/
│   │   ├── api/                 # API 호출 함수 (axios)
│   │   │   ├── auth.ts
│   │   │   ├── chapters.ts
│   │   │   └── payment.ts
│   │   ├── components/
│   │   │   ├── layout/          # Header, Footer, Sidebar
│   │   │   ├── auth/            # LoginButton, ProtectedRoute
│   │   │   ├── chapters/        # ChapterCard, ChapterContent, LockOverlay
│   │   │   └── ui/              # Button, Badge, CodeBlock
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Chapters.tsx
│   │   │   ├── ChapterDetail.tsx
│   │   │   ├── Pricing.tsx
│   │   │   └── Profile.tsx
│   │   ├── store/               # Zustand 전역 상태
│   │   │   └── authStore.ts
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                     # FastAPI 앱
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py          # /api/auth/*
│   │   │   ├── chapters.py      # /api/chapters/*
│   │   │   ├── users.py         # /api/users/*
│   │   │   └── webhook.py       # /api/webhook/polar
│   │   ├── core/
│   │   │   ├── config.py        # 환경변수 설정
│   │   │   ├── security.py      # JWT 발급/검증
│   │   │   └── database.py      # SQLAlchemy 세션
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   └── subscription.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   └── chapter.py
│   │   ├── data/
│   │   │   └── chapters.py      # 정적 콘텐츠 데이터
│   │   └── main.py
│   ├── pyproject.toml
│   └── .env.example
│
├── vercel.json                  # Vercel 라우팅 설정
└── README.md
```

---

## 4. 데이터베이스 스키마 (Database Schema)

### 4.1 users

```sql
CREATE TABLE users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    email       TEXT UNIQUE NOT NULL,
    name        TEXT NOT NULL,
    picture     TEXT,
    google_id   TEXT UNIQUE NOT NULL,
    plan        TEXT NOT NULL DEFAULT 'free',   -- 'free' | 'pro'
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 4.2 subscriptions

```sql
CREATE TABLE subscriptions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL REFERENCES users(id),
    polar_order_id  TEXT UNIQUE NOT NULL,
    status          TEXT NOT NULL,              -- 'active' | 'cancelled'
    amount          INTEGER NOT NULL,           -- cents
    currency        TEXT NOT NULL DEFAULT 'USD',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 4.3 chapter_progress *(v2, 선택)*

```sql
CREATE TABLE chapter_progress (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    chapter_id  INTEGER NOT NULL,
    completed   BOOLEAN DEFAULT FALSE,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, chapter_id)
);
```

---

## 5. API 명세 (API Specification)

### 5.1 인증 (Auth)

#### `GET /api/auth/google`
Google OAuth 로그인 URL로 리다이렉트

```
Response: 302 Redirect → https://accounts.google.com/o/oauth2/auth?...
```

#### `GET /api/auth/callback`
Google OAuth 콜백 처리

```
Query Params:
  code: string   (Google 인증 코드)
  state: string  (CSRF 방지)

Response: 302 Redirect → /chapters?token=<JWT>
```

#### `GET /api/auth/me`
현재 로그인 사용자 정보

```
Headers: Authorization: Bearer <token>

Response 200:
{
  "id": 1,
  "email": "user@gmail.com",
  "name": "홍길동",
  "picture": "https://...",
  "plan": "free"
}
```

### 5.2 챕터 (Chapters)

#### `GET /api/chapters`
챕터 목록 조회 (모든 사용자 접근 가능)

```
Response 200:
[
  {
    "id": 1,
    "title": "Regularization",
    "description": "과적합을 막기 위한 규제 기법",
    "is_free": true,
    "order": 1
  },
  ...
]
```

#### `GET /api/chapters/:id`
챕터 상세 조회 (유료 챕터는 Pro 사용자만)

```
Headers: Authorization: Bearer <token>  (선택, 없으면 무료 챕터만)

Response 200:
{
  "id": 3,
  "title": "Data Augmentation",
  "content": "...",   // Markdown 형식
  "code_examples": [...],
  "is_free": false
}

Response 403 (Free 사용자가 유료 챕터 접근 시):
{
  "detail": "PRO_REQUIRED"
}
```

### 5.3 결제 (Payment)

#### `POST /api/payment/checkout`
Polar.sh 결제 링크 생성

```
Headers: Authorization: Bearer <token>

Response 200:
{
  "checkout_url": "https://polar.sh/checkout/..."
}
```

#### `POST /api/webhook/polar`
Polar.sh Webhook 수신 (결제 완료 처리)

```
Headers: polar-signature: <HMAC>

Body (Polar.sh 형식):
{
  "type": "order.created",
  "data": {
    "id": "order_xxx",
    "customer_email": "user@gmail.com",
    "status": "paid",
    "amount": 900
  }
}

Response 200: { "ok": true }
```

---

## 6. 인증 플로우 (Auth Flow)

```
[사용자]          [Frontend]          [Backend]           [Google]
   │                  │                   │                   │
   │ 로그인 클릭       │                   │                   │
   │─────────────────▶│                   │                   │
   │                  │ GET /api/auth/google                  │
   │                  │──────────────────▶│                   │
   │                  │                   │ 302 → Google URL  │
   │                  │◀──────────────────│                   │
   │◀─────────────────│                   │                   │
   │                  │                   │                   │
   │ Google 동의 화면  │                   │                   │
   │──────────────────────────────────────────────────────────▶│
   │◀──────────────────────────────────────────────────────────│
   │  code=xxx 콜백   │                   │                   │
   │                  │ GET /api/auth/callback?code=xxx        │
   │                  │──────────────────▶│                   │
   │                  │                   │ token exchange    │
   │                  │                   │──────────────────▶│
   │                  │                   │◀──────────────────│
   │                  │                   │ DB upsert user    │
   │                  │                   │ JWT 발급           │
   │                  │ 302 /chapters?token=JWT               │
   │                  │◀──────────────────│                   │
   │ localStorage 저장 │                   │                   │
   │◀─────────────────│                   │                   │
```

---

## 7. 결제 플로우 (Payment Flow)

```
[사용자] → "Pro 업그레이드" 클릭
      → Frontend: POST /api/payment/checkout
      → Backend: Polar.sh API로 checkout session 생성
      → Frontend: checkout_url로 리다이렉트
      → 사용자: Polar.sh 결제 완료
      → Polar.sh: POST /api/webhook/polar (HMAC 서명 포함)
      → Backend: 서명 검증 → users.plan = 'pro' 업데이트
      → 사용자: 다음 페이지 로드 시 Pro 권한 적용
```

---

## 8. 환경 변수 (.env)

### Backend (.env)

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-domain.vercel.app/api/auth/callback

# JWT
JWT_SECRET_KEY=your_very_long_random_secret
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=24

# Polar.sh
POLAR_ACCESS_TOKEN=your_polar_access_token
POLAR_PRODUCT_ID=your_polar_product_id
POLAR_WEBHOOK_SECRET=your_polar_webhook_secret

# Database
DATABASE_URL=sqlite:///./app.db

# CORS
FRONTEND_URL=https://your-domain.vercel.app
```

### Frontend (.env.local)

```env
VITE_API_BASE_URL=https://your-domain.vercel.app
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 9. Vercel 배포 설정

### vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/dist/**",
      "use": "@vercel/static"
    },
    {
      "src": "backend/app/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/app/main.py"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/index.html"
    }
  ]
}
```

> **주의**: SQLite는 Vercel Serverless 환경에서 파일 시스템이 읽기 전용이므로, `/tmp/app.db`에 DB를 생성하거나 배포 후 Turso(libSQL) 또는 PlanetScale로 마이그레이션을 권장합니다. 로컬 개발 및 MVP 단계에서는 SQLite를 그대로 사용합니다.

---

## 10. 주요 라이브러리

### Frontend

| 패키지 | 용도 |
|--------|------|
| `react-router-dom` | 클라이언트 라우팅 |
| `axios` | HTTP 클라이언트 |
| `zustand` | 전역 상태 관리 (auth) |
| `react-markdown` | Markdown 렌더링 |
| `react-syntax-highlighter` | 코드 블록 하이라이팅 |
| `@polar-sh/sdk` | Polar.sh 클라이언트 (선택) |

### Backend

| 패키지 | 용도 |
|--------|------|
| `fastapi` | 웹 프레임워크 |
| `uvicorn` | ASGI 서버 |
| `sqlalchemy` | ORM |
| `python-jose` | JWT 처리 |
| `httpx` | Google OAuth 토큰 교환 |
| `polar-sdk` | Polar.sh API |
| `python-dotenv` | 환경 변수 로드 |

---

## 11. 보안 고려사항

| 항목 | 구현 방법 |
|------|----------|
| CSRF 방지 | OAuth state 파라미터 (랜덤 UUID, 세션 검증) |
| Webhook 위조 방지 | Polar.sh HMAC-SHA256 서명 검증 |
| JWT 탈취 방지 | HttpOnly 쿠키 전환 고려 (v2), 현재는 짧은 만료 시간 |
| SQL Injection | SQLAlchemy ORM 파라미터 바인딩 |
| CORS | `FRONTEND_URL` 화이트리스트만 허용 |
| Rate Limiting | Vercel Edge Config 또는 SlowAPI (FastAPI) |

---

## 12. 개발 순서 (Implementation Order)

```
Phase 1 (기반)
  □ 프로젝트 구조 세팅 (pnpm, uv)
  □ FastAPI 기본 앱 + SQLite 연결
  □ React + Tailwind + React Router 세팅

Phase 2 (인증)
  □ Google OAuth 백엔드 구현 (callback, JWT 발급)
  □ Frontend 로그인 페이지 + authStore
  □ ProtectedRoute 컴포넌트

Phase 3 (콘텐츠)
  □ 챕터 정적 데이터 작성 (chapters.py)
  □ 챕터 목록 / 상세 API
  □ Frontend 챕터 페이지 + LockOverlay

Phase 4 (결제)
  □ Polar.sh 프로덕트 생성
  □ Checkout API + Webhook 처리
  □ Frontend Pricing 페이지

Phase 5 (배포)
  □ Vercel 프로젝트 연결
  □ 환경 변수 설정
  □ 도메인 설정 + 최종 테스트
```

---

*문서 작성: 프로젝트 팀 | 기술 스택 변경 시 본 문서 업데이트 필요*
