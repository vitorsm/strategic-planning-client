
We are going to use styled components in this project. 

We need to use typescript.

For this project, all shared components should be located in the src/shared/componenets folder. Each component should have a folder. Inside that, the component file, the style file and the index. The index should export the component. It should have a folder with tests too __tests__.

All pages should be located at src/features. Pages can know the state, while components don't know the states. There will be a UnauthenticatedPage with the structure that will be used for all pages before login, like LandingPage, Login, Pricing, etc.

In the components and page, we are going to have only screen logic. All other logics should be separed and must be accessed by hooks.

All colors should be imported from src/shared/styles/colors.ts.

### Project structure
src/
├── app/                # App bootstrap & global config
│   ├── router.tsx
│   ├── store.ts
│   └── providers.tsx
│
├── features/           # Business domains / use cases
│   ├── auth/
│   │   ├── pages/
│   │   │   └── LoginPage.tsx
│   │   ├── components/
│   │   │   └── LoginForm.tsx
│   │   ├── hooks/
│   │   │   └── useLogin.ts
│   │   ├── api/
│   │   │   └── auth.api.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── users/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types.ts
│   │
│   └── dashboard/
│
├── shared/             # Reusable, domain-agnostic code
│   ├── components/
|   |   ├── PrimaryButton/
|   |   |   ├── __tests__
|   |   |   ├── index.ts
|   |   |   ├── PrimaryButton.tsx
|   |   |   ├── styles.ts
|   |   ├── TextInput/
|   |   |   ├── __tests__
|   |   |   ├── index.ts
|   |   |   ├── TextInput.tsx
|   |   |   ├── styles.ts
│   │
│   ├── hooks/
│   │   └── useDebounce.ts
│   │
│   ├── api/
│   │   ├── httpClient.ts
│   │   └── queryClient.ts
│   │
│   ├── utils/
│   ├── constants/
│   └── types/
│
├── pages/              # Route composition (optional, see below)
│   └── index.tsx
│
├── assets/
│
└── main.tsx

