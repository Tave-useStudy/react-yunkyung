# react_yunkyung

TAVE React 스터디 1주차 과제 — React 투두리스트

## 실행

```bash
npm install
npm run dev   # http://localhost:5173
```

## 구조

```
src/
├── App.jsx                  todos 상태 관리, 자식에게 props로 전달
└── components/
    ├── TextInput.jsx        할 일 입력 (글자 수 표시, 20자 제한, Enter/버튼으로 추가)
    ├── TaskList.jsx         할 일 목록 (완료 토글 → 취소선, 삭제)
    └── UserProfile.jsx      Random User API 호출 + 새로고침
```
