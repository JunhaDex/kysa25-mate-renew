# MATE Frontend

SNS App for KYSA 2025

## 📝 프로젝트의 목적

MATE는 2025년 청년대회 참가자들을 위해 특별히 제작된 소셜 네트워킹 PWA(Progressive Web App) 플랫폼입니다. Vue.js를 기반으로 구축되었으며, 모바일 환경에 완벽하게 최적화되어 있습니다.
이 프로젝트의 핵심 목표는 청년대회 기간 동안 참가자들이 서로 원활하게 소통하고 교류하며, 공동체 의식을 함양할 수 있는 디지털 공간을 제공하는 것입니다. 실시간 채팅, 프로필 공유, 게시판 활동 등을 통해
참가자들이 더 깊은 유대감을 형성하고 소중한 추억을 만들 수 있도록 돕고자 합니다.

## ✨ 핵심 기능

- 다이렉트 메세지 (실시간 채팅)
- 자유게시판
- 호감 보내기 티켓 (일 10회)
- 프로필 설정
- 참가자 목록 / 조 검색

## 📂 프로젝트 구조

- `components`: 재사용 가능한 컴포넌트들을 MUI 기반의 컴포넌트 분류방식을 따라 정리했습니다. 대규모 프로젝트에서 수많은 컴포넌트들을 관리할 때 유용합니다.
    - `display` (Data Display): 데이터를 구조화해서 시각적으로 보여주는 컴포넌트의 모음입니다. (예: Avatar, Card, List, Table 등)
    - `feedbacks`: 사용자의 작업에 대한 피드백을 제공하는 컴포넌트의 모음입니다. (예: Alert, Dialog, Progress, Snackbar 등)
    - `inputs`: 사용자들의 입력을 받는 컴포넌트의 모음입니다. (예: Button, Checkbox, TextArea, Dropdown 등)
    - `layouts`: 페이지의 레이아웃을 구성하는 컴포넌트의 모음입니다. (예: Container, Grid, Stack 등)
    - `surfaces`: 다른 컴포넌트들을 감싸는 표면 역할을 하는 컴포넌트의 모음입니다. (예: AppBar, Card, Paper 등)
- `services`: API 통신과 관련된 로직을 담당합니다. Axios 인스턴스를 생성하고, 각 API 엔드포인트에 대한 함수를 정의합니다.
- `types`: 서비스에서 다루는 데이터의 타입을 정의합니다. API 응답 전달 및 컴포넌트 생성 시, 리터럴 데이터를 넘기기보다 타입 데이터를 prop 등으로 전달하는 방식을 만들 때 더 명시적이고 안정적인
  코드를 작성할 수 있습니다.
- `routes`: SPA 전반의 라우팅을 처리합니다. Vue Router를 사용하여 라우팅을 구현했습니다.
- `providers`: 외부 서비스와의 연결을 정의하고 추상화합니다. Firebase와의 연결을 정의합니다.

## ☁️ 인프라

사용자의 요청은 먼저 GCP Load Balancer로 전달됩니다. 정적 콘텐츠(HTML, CSS, JS) 요청의 경우, 트래픽은 Cloud CDN을 통해 캐시된 데이터를 빠르게 제공받거나 Cloud Storage에
저장된 원본 파일로 라우팅됩니다. API와 같은 동적 요청은 Load Balancer를 통해 백엔드 서비스인 CloudRun으로 전달되며, CloudRun은 DB Compute Engine Instance와 통신하여
비즈니스 로직을 처리합니다. 이러한 구조는 트래픽을 효율적으로 분산시키고, 사용자에게 안정적이고 빠른 서비스 경험을 제공합니다.