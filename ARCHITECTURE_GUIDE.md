# MVVM 아키텍처 가이드

## 📁 폴더별 역할 및 책임

### 1. `src/models/` - Model Layer

**역할**: 순수 데이터 및 비즈니스 로직 없는 API 호출

#### `src/models/api/` - 순수 API 호출 함수

- **역할**: 외부 API를 호출하는 순수 함수만 포함
- **특징**:
  - 비즈니스 로직 없음
  - 데이터 변환/가공 없음
  - React 의존성 없음
  - 단순히 API를 호출하고 원시 데이터 반환

**예시**:

```typescript
// ✅ 올바른 예: 순수 API 호출
export const readBond10y = async ({ date }: { date: string }) => {
  const response = await ky.get(`...`).json();
  return response; // 원시 데이터 그대로 반환
};

// ❌ 잘못된 예: 비즈니스 로직 포함
export const readBond10y = async ({ date }: { date: string }) => {
  const response = await ky.get(`...`).json();
  // ❌ 데이터 변환/가공은 여기서 하지 않음
  return transformData(response); // ViewModel에서 처리해야 함
};
```

#### `src/models/services/` - 도메인 서비스 (선택적)

- **역할**: 여러 API를 조합하거나 도메인별 비즈니스 로직이 포함된 순수 함수
- **특징**:
  - React 의존성 없음 (hook 아님)
  - 여러 API를 조합하여 하나의 도메인 작업 수행
  - 재사용 가능한 비즈니스 로직
  - ViewModel에서 호출됨

**예시**:

```typescript
// ✅ 올바른 예: 여러 API를 조합하는 서비스
import { readBond10y } from '../api/readBond10y';
import { readExchangeRate } from '../api/readExchangeRate';

export const fetchAllIndicators = async (date: string) => {
  const [bond, exchange] = await Promise.all([
    readBond10y({ date }),
    readExchangeRate({ date }),
  ]);
  return { bond, exchange };
};

// ✅ 올바른 예: 도메인별 데이터 변환 (순수 함수)
export const transformBondData = (rawData: any): EconomicIndicator => {
  // API 응답을 EconomicIndicator 타입으로 변환
  return {
    id: 'bond',
    value: rawData.statistic_search.row[0].DATA_VALUE,
    // ...
  };
};
```

#### `src/models/types/` - 타입 정의

- TypeScript 인터페이스 및 타입 정의

#### `src/models/constants/` - 상수

- 기준값, 메타데이터 등 상수 정의

---

### 2. `src/viewmodels/` - ViewModel Layer

**역할**: 상태 관리, 비즈니스 로직, 데이터 가공, React hooks

#### `src/viewmodels/use*.ts` - React Hooks

- **역할**:
  - API 호출 + 전처리 + 상태 관리 + View에 전달
  - React hooks (use\* 패턴)
  - Jotai atoms를 통한 상태 관리
  - 여러 API/Service를 조합하여 데이터 가공
  - View에 전달할 최종 데이터 준비

**예시**:

```typescript
// ✅ 올바른 예: ViewModel에서 API 호출 + 전처리 + 상태 관리
import { readBond10y } from '@models/api/readBond10y';
import { transformBondData } from '@models/services/indicatorService';
import { atom, useAtomValue, useSetAtom } from 'jotai';

export const useBondIndicator = () => {
  const [bond, setBond] = useAtom(bondAtom);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBond = async () => {
    setIsLoading(true);
    try {
      // 1. API 호출 (Model/api)
      const rawData = await readBond10y({ date: '20250101' });

      // 2. 데이터 변환 (Model/services 또는 ViewModel 내부)
      const indicator = transformBondData(rawData);

      // 3. 상태 업데이트
      setBond(indicator);
    } finally {
      setIsLoading(false);
    }
  };

  return { bond, isLoading, fetchBond };
};
```

---

## 🎯 코드 배치 결정 가이드

### 질문: 어디에 작성해야 할까?

#### 1. **순수 API 호출 함수** → `src/models/api/`

```typescript
// ✅ src/models/api/readBond10y.ts
export const readBond10y = async ({ date }: { date: string }) => {
  return await ky.get(`...`).json();
};
```

#### 2. **여러 API 조합 또는 도메인 서비스** → `src/models/services/` (선택적)

```typescript
// ✅ src/models/services/indicatorService.ts
export const fetchAllIndicators = async (date: string) => {
  // 여러 API 조합
};
```

#### 3. **API 호출 + 전처리 + 상태 관리 + View 전달 hook** → `src/viewmodels/`

```typescript
// ✅ src/viewmodels/useBondIndicator.ts
export const useBondIndicator = () => {
  // API 호출 + 전처리 + 상태 관리
  // View에 전달할 데이터 준비
};
```

---

## 📊 데이터 흐름

```
외부 API
  ↓
src/models/api/          (순수 API 호출)
  ↓
src/models/services/      (선택적: 여러 API 조합)
  ↓
src/viewmodels/           (상태 관리 + 데이터 가공)
  ↓
src/views/                (UI 렌더링)
```

---

## ✅ 권장 구조

### 현재 프로젝트에 맞는 구조:

```
src/models/
├── api/                    # 순수 API 호출 함수
│   ├── readBond10y.ts      # ✅ 국고채 10년물 금리 API
│   ├── readExchangeRate.ts # ✅ 환율 API
│   └── ...
│
├── services/               # 도메인 서비스 (선택적)
│   ├── indicatorService.ts # 여러 API 조합 또는 데이터 변환
│   └── ...
│
├── types/                  # 타입 정의
└── constants/              # 상수

src/viewmodels/
├── useDashboardVM.ts       # ✅ API 호출 + 전처리 + 상태 관리
└── useBondIndicator.ts     # ✅ 개별 지표 hook (필요시)
```

---

## 🔍 판단 기준

### `src/models/services/`에 작성할 것:

- ✅ 여러 API를 조합하는 함수
- ✅ 도메인별 데이터 변환 로직 (순수 함수)
- ✅ React 의존성 없는 재사용 가능한 비즈니스 로직

### `src/viewmodels/`에 작성할 것:

- ✅ React hooks (use\* 패턴)
- ✅ 상태 관리 (Jotai atoms)
- ✅ API 호출 + 전처리 + View 전달을 모두 포함하는 hook
- ✅ 로딩/에러 상태 관리

---

## 💡 실전 예시

### 시나리오: 국고채 10년물 금리 데이터를 가져와서 View에 표시

#### 1단계: API 호출 함수 (Model/api)

```typescript
// src/models/api/readBond10y.ts
export const readBond10y = async ({ date }: { date: string }) => {
  return await ky.get(`...`).json();
};
```

#### 2단계: 데이터 변환 서비스 (Model/services) - 선택적

```typescript
// src/models/services/indicatorService.ts
export const transformBondData = (rawData: any): EconomicIndicator => {
  return {
    id: 'bond',
    value: rawData.statistic_search.row[0].DATA_VALUE,
    // ...
  };
};
```

#### 3단계: ViewModel Hook (viewmodels/)

```typescript
// src/viewmodels/useBondIndicator.ts
import { readBond10y } from '@models/api/readBond10y';
import { transformBondData } from '@models/services/indicatorService';

export const useBondIndicator = () => {
  const [indicator, setIndicator] = useAtom(bondAtom);
  const [isLoading, setIsLoading] = useState(false);

  const fetch = async () => {
    setIsLoading(true);
    try {
      const rawData = await readBond10y({ date: '20250101' });
      const transformed = transformBondData(rawData);
      setIndicator(transformed);
    } finally {
      setIsLoading(false);
    }
  };

  return { indicator, isLoading, fetch };
};
```

#### 4단계: View에서 사용

```typescript
// src/views/pages/DashboardPage.tsx
const { indicator, isLoading, fetch } = useBondIndicator();
```

---

## 🎯 결론

**당신의 경우**: API 호출 + 전처리 후 View로 전달하는 hook 함수

→ **`src/viewmodels/`에 작성하세요!**

이유:

1. React hook이므로 ViewModel 레이어에 적합
2. 상태 관리가 필요하므로 ViewModel이 적절
3. View에 전달하는 역할이므로 ViewModel의 책임

`src/models/services/`는:

- React 의존성 없는 순수 함수만 작성
- 여러 API를 조합하거나 도메인별 변환 로직이 있을 때 사용
- 선택적으로 사용 (필수 아님)
