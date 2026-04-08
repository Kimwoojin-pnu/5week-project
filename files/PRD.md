# PRD (Product Requirements Document)
# 딥러닝 Week 5 학습 플랫폼

**버전**: v1.0  
**작성일**: 2026-04-08  
**상태**: Draft

---

## 1. 제품 개요 (Product Overview)

### 1.1 목적
딥러닝 5주차 핵심 개념(Regularization, Overfitting/Underfitting, Data Augmentation, Transfer Learning, CNN 실습)을 웹 기반으로 제공하는 학습 플랫폼입니다. 수강생은 로그인 후 강의 콘텐츠를 열람하고, 유료 플랜을 통해 전체 실습 자료에 접근할 수 있습니다.

### 1.2 대상 사용자
- 딥러닝을 학습 중인 대학생 / 입문자
- TensorFlow/Keras 실습 자료가 필요한 개발자

### 1.3 핵심 가치
- **접근성**: Google 계정으로 즉시 가입, 별도 회원 정보 입력 최소화
- **콘텐츠 품질**: 코드 예시 + 결과 이미지 + 개념 설명이 통합된 구성
- **투명한 결제**: Polar.sh 기반의 심플한 유료 플랜 구조

---

## 2. 기능 요구사항 (Functional Requirements)

### 2.1 인증 (Authentication)

| ID | 기능 | 우선순위 |
|----|------|---------|
| AUTH-01 | Google OAuth 2.0 로그인 / 회원가입 | P0 |
| AUTH-02 | 로그인 상태 유지 (JWT 기반 세션) | P0 |
| AUTH-03 | 로그아웃 | P0 |
| AUTH-04 | 최초 로그인 시 사용자 DB 자동 생성 | P0 |

**상세 동작:**
- 사용자가 "Google로 로그인" 버튼 클릭
- Google OAuth Consent 화면 → 승인
- 백엔드가 Google에서 `email`, `name`, `picture` 수신 후 JWT 발급
- 프론트엔드는 JWT를 localStorage에 저장, 이후 API 요청 시 `Authorization: Bearer <token>` 헤더 첨부

### 2.2 콘텐츠 (Content)

| ID | 기능 | 우선순위 |
|----|------|---------|
| CONT-01 | Week 5 학습 목표 표시 | P0 |
| CONT-02 | 5개 챕터 목차 및 개요 표시 (비로그인 포함) | P0 |
| CONT-03 | 챕터 상세 페이지 (개념 설명, 코드 블록, 결과 이미지) | P0 |
| CONT-04 | 챕터 1~2 무료 공개, 챕터 3~5 유료 잠금 | P1 |
| CONT-05 | 코드 블록 구문 강조 (Syntax Highlighting) | P1 |
| CONT-06 | 학습 진도 체크 (챕터별 완료 표시) | P2 |

**챕터 구성:**

| # | 챕터명 | 접근 |
|---|--------|------|
| 1 | Regularization (L1/L2, Dropout, BatchNorm) | 무료 |
| 2 | Overfitting vs Underfitting | 무료 |
| 3 | Data Augmentation | 유료 |
| 4 | Transfer Learning | 유료 |
| 5 | MNIST CNN 실습 | 유료 |

### 2.3 결제 (Payment)

| ID | 기능 | 우선순위 |
|----|------|---------|
| PAY-01 | Polar.sh 연동 결제 버튼 표시 | P0 |
| PAY-02 | 결제 성공 Webhook 수신 → 사용자 플랜 업그레이드 | P0 |
| PAY-03 | 유료 사용자 콘텐츠 잠금 해제 | P0 |
| PAY-04 | 현재 플랜 상태 표시 (Free / Pro) | P1 |
| PAY-05 | 결제 이력 조회 | P2 |

**플랜 구조:**

| 플랜 | 가격 | 포함 내용 |
|------|------|----------|
| Free | 무료 | 챕터 1~2 열람 |
| Pro | $9 / 월 (Polar.sh 설정) | 전체 챕터 + 실습 파일 다운로드 |

### 2.4 사용자 프로필

| ID | 기능 | 우선순위 |
|----|------|---------|
| USER-01 | 프로필 페이지 (이름, 이메일, 플랜 상태) | P1 |
| USER-02 | 아바타 이미지 (Google 프로필 사진) | P1 |

---

## 3. 비기능 요구사항 (Non-Functional Requirements)

| 항목 | 요구사항 |
|------|---------|
| **성능** | 페이지 초기 로드 < 2초 (Vercel Edge Network 활용) |
| **보안** | JWT 만료 시간 24시간, HTTPS 강제 |
| **가용성** | Vercel 무중단 배포, 99% 이상 Uptime 목표 |
| **반응형** | 모바일 / 태블릿 / 데스크톱 대응 (Tailwind breakpoints) |
| **접근성** | WCAG 2.1 AA 수준 준수 |

---

## 4. 사용자 스토리 (User Stories)

```
US-01: 비로그인 사용자로서, 홈 페이지에서 강의 개요와 챕터 목록을 볼 수 있다.
US-02: 비로그인 사용자로서, "Google로 로그인" 버튼을 눌러 바로 가입/로그인할 수 있다.
US-03: Free 사용자로서, 챕터 1, 2의 전체 내용을 읽을 수 있다.
US-04: Free 사용자로서, 챕터 3~5에 접근하면 업그레이드 유도 화면을 본다.
US-05: Pro 사용자로서, 모든 챕터와 실습 파일을 제한 없이 열람한다.
US-06: 사용자로서, 결제 버튼을 눌러 Polar.sh 결제 페이지로 이동한다.
US-07: 사용자로서, 결제 완료 후 자동으로 Pro 플랜이 활성화된다.
```

---

## 5. 화면 구성 (UI Screens)

```
/                   → 랜딩 페이지 (학습 목표 + 챕터 목록 미리보기)
/login              → 로그인 페이지 (Google OAuth 버튼)
/chapters           → 챕터 목록 페이지
/chapters/:id       → 챕터 상세 페이지
/pricing            → 플랜 비교 / 결제 페이지
/profile            → 사용자 프로필 페이지
/api/auth/...       → OAuth 콜백 (백엔드 처리)
/api/webhook/polar  → Polar.sh Webhook 수신 (백엔드)
```

---

## 6. 성공 지표 (Success Metrics)

| 지표 | 목표 |
|------|------|
| 가입 전환율 | 방문자 대비 30% 이상 |
| 유료 전환율 | 가입자 대비 10% 이상 |
| 페이지 이탈률 | 챕터 상세 < 40% |
| 결제 완료율 | 결제 시도 대비 80% 이상 |

---

## 7. 출시 범위 (Scope)

### MVP (v1.0)
- Google OAuth 로그인
- 5개 챕터 콘텐츠 (정적 데이터)
- Polar.sh 결제 + Webhook
- 무료/유료 콘텐츠 잠금

### 이후 버전
- 챕터 완료 진도 트래킹
- 실습 코드 온라인 실행 (Jupyter 연동)
- 다국어 지원
- 이메일 알림

---

*문서 작성: 프로젝트 팀 | 검토 필요 항목은 [TBD]로 표시*
