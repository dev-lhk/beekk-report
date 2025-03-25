# 📦 과제 제출 - 개인정보 유효기간, 예산 계산, 할인 행사 등록일 (NestJS + Prisma + SQLite + SQL)

---

## 개발환경

| 항목                | 상세 내용                              |
|---------------------|----------------------------------------|
| Node.js             | v22.x                                  |
| NestJS              | v11.x                                  |
| TypeScript          | v5.x                                   |
| Prisma ORM          | v6.x (Database toolkit)                |
| Database            | SQLite (로컬 DB 파일 기반)            |
| Validation          | class-validator, class-transformer     |
| API 문서 자동화     | Swagger (nestjs/swagger)               |
| SQL 실행 환경       | SQLite CLI (`sqlite3`)                 |

---

## 과제별 구현 방식 요약

| 과제 번호 | 주제                                         | 구현 방식 | 위치                          |
|-----------|----------------------------------------------|-----------|-------------------------------|
| 1번       | 개인정보 유효기간 계산                       | NestJS API | `src/expiry/`                 |
| 2번       | 예산 내 최대 부서 수 계산                    | NestJS API | `src/budget/`                 |
| 3번       | 할인 행사 등록 가능 날짜 계산                | NestJS API | `src/sale/`                   |
| 4번       | 가격대별 상품 개수 조회                      | SQL 파일   | `sql/4-price-group.sql`       |
| 5번       | 월별 총매출 계산                             | SQL 파일   | `sql/5-monthly-sales.sql`     |
| 6번       | 재구매 회원 리스트                           | SQL 파일   | `sql/6-repeat-buyers.sql`     |

---

## API 서버 실행 방법

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

---

## Swagger API 문서

- Swagger URL: [http://localhost:3000/api](http://localhost:3000/api)

- 구현된 API:
  - `/expiry/calculate`: 개인정보 유효기간 계산
  - `/budget/check`: 예산 계산 및 저장
  - `/sale/check`: 할인행사 계산 및 저장
  - 각각 저장된 목록, 초기화, 계산 전용 API도 포함

---

## SQL 실행 방법 (4~6번 과제)

SQLite CLI 환경에서 아래 명령어 실행:

```bash
# 가격대별 상품 개수
sqlite3 prisma/dev.db < sql/price-group.sql

# 월별 총매출
sqlite3 prisma/dev.db < sql/monthly-sales.sql

# 재구매 회원 리스트
sqlite3 prisma/dev.db < sql/repurchase-users.sql
```

---

## 디렉토리 구조

```
📦 your-assignment/
├── 📂 src/
│   ├── 📂 expiry/       # 1번 과제
│   ├── 📂 budget/       # 2번 과제
│   ├── 📂 sale/         # 3번 과제
│   └── 📂 provider/prisma/
│       └── prisma.service.ts
├── 📂 sql/
│   ├── price-group.sql           # 4번 과제
│   ├── monthly-sales.sql         # 5번 과제
│   └── sql/repurchase-users.sql  # 6번 과제
├── prisma/
│   ├── schema.prisma
│   └── dev.db
├── package.json
├── tsconfig.json
└── README.md
```

---

## 기타 안내

- Prisma 사용 시 `prisma migrate reset`으로 DB 초기화 가능
- 각 API는 `calculate`, `check`, `list`, `reset` 구조를 따름
- 예외 처리 및 유효성 검증 포함

---

📧 문의 사항은 주석 또는 README 하단에 자유롭게 추가해주세요.
