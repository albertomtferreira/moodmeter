lunch-feedback-app/
├── app/
│ ├── layout.tsx
│ ├── page.tsx (Home page)
│ ├── reports/
│ │ └── page.tsx
│ ├── settings/
│ │ └── page.tsx
│ ├── api/
│ │ ├── feedback/
│ │ │ └── route.ts
│ │ ├── reports/
│ │ │ └── route.ts
│ │ ├── user-schools/
│ │ │ └── route.ts
│ │ └── sync-offline-feedback/
│ │ └── route.ts
│ └── (auth)/
│ ├── sign-in/
│ │ └── [[...sign-in]]/
│ │ └── page.tsx
│ └── sign-up/
│ └── [[...sign-up]]/
│ └── page.tsx
├── components/
│ ├── FeedbackButton.tsx
│ ├── SchoolSelector.tsx
│ ├── ReportChart.tsx
│ └── Header.tsx
├── lib/
│ ├── mongodb.ts
│ ├── offlineStorage.ts
│ └── networkStatus.ts
├── middleware.ts
├── styles/
│ └── globals.css
├── public/
│ └── service-worker.js
├── types/
│ └── index.ts (Type definitions)
├── config/
│ └── constants.ts
├── hooks/
│ └── useUserSchools.ts
├── .env.local
├── next.config.js
├── package.json
└── tsconfig.json
