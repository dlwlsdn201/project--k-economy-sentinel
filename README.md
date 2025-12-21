# React + TypeScript + Vite + Jest

이 프로젝트는 React, TypeScript, Vite, Jest를 사용한 보일러플레이트 템플릿입니다.

## 기술 스택

### 주요 의존성

- **React**: ^19.2.1
- **React DOM**: ^19.2.1
- **TypeScript**: ^5.9.3
- **Vite**: ^7.2.6
- **Jest**: ^30.2.0

### 개발 도구

- **@vitejs/plugin-react-swc**: ^4.2.2 - SWC를 사용한 Fast Refresh
- **ESLint**: ^9.39.1 - 코드 린팅
- **TypeScript ESLint**: ^8.48.1 - TypeScript 전용 ESLint 규칙
- **Prettier**: ^3.7.4 - 코드 포맷팅
- **Testing Library**: 최신 버전 - React 컴포넌트 테스트
  - @testing-library/react: ^16.3.0
  - @testing-library/jest-dom: ^6.9.1
  - @testing-library/user-event: ^14.6.1

## 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

기본 포트는 5173입니다. 다른 포트(예: 3000)를 사용하려면:

```bash
pnpm dev:3000
```

### 빌드

```bash
pnpm build
```

### 프로덕션 미리보기

```bash
pnpm start
```

### 테스트

```bash
# 테스트 실행
pnpm test

# Watch 모드로 테스트 실행 (커버리지 포함)
pnpm test:auto
```

### 린트

```bash
pnpm lint
```

## 프로젝트 구조

```
src/
├── app/          # 애플리케이션 레벨 로직
├── entities/     # 비즈니스 엔티티
├── features/     # 기능 모듈
├── pages/        # 페이지 컴포넌트
├── shared/       # 공유 유틸리티 및 컴포넌트
└── widgets/      # 위젯 컴포넌트
```

## 설정 파일

- `vite.config.ts` - Vite 빌드 설정
- `jest.config.ts` - Jest 테스트 설정
- `eslint.config.js` - ESLint 린팅 규칙 (Flat Config 형식)
- `tsconfig.json` - TypeScript 컴파일러 설정
- `tsconfig.app.json` - 애플리케이션용 TypeScript 설정
- `tsconfig.node.json` - Node.js 환경용 TypeScript 설정

## 주요 기능

- ✅ React 19 지원
- ✅ TypeScript 5.9 최신 기능
- ✅ Vite 7 빠른 개발 서버 및 빌드
- ✅ Jest 30 테스트 환경
- ✅ ESLint 9 Flat Config
- ✅ SWC를 사용한 빠른 컴파일
- ✅ 경로 별칭 지원 (`@src`, `@app`, `@features` 등)
- ✅ 커버리지 리포트 생성

## ESLint 설정 확장

프로덕션 애플리케이션 개발 시, 타입 인식 린트 규칙을 활성화하는 것을 권장합니다:

- `parserOptions`에 `project` 속성 추가
- `tseslint.configs.recommendedTypeChecked` 또는 `tseslint.configs.strictTypeChecked` 사용
- 선택적으로 `tseslint.configs.stylisticTypeChecked` 추가

자세한 내용은 [TypeScript ESLint 문서](https://typescript-eslint.io/)를 참고하세요.

## 라이선스

MIT
