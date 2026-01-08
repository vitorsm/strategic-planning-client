
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

## How to add GenericEntity page?

1. First, create the entity at src/shared/models. It must extends GenericEntity.
2. Create the entity directory at src/features
3. Create the entity details page. It should have this name: {EntityName}Details.tsx. Use the component EntityDetailsPage. The children of this component is where we put the forms. The component EntityDetailsPage has some parameters:
    1. isEntityValidToSubmit should check if all required fields of the entity are filled
    2. entityEndpoint usually is /api/{entity_name_in_plural}
    3. loadEntityDataStates is a function that will get a entity object and fill the component states
    4. setEntityIdCallback should fill a entityId that will be used to build the object
    5. getEntityFromStates is the function that reads the component states and build the entity object
4. Create the main entity page. It should have this name: {EntityName}Page.tsx. Use the component RoutePage. This component is responsible for define the entity routes and show the first screen. It shows a table with the list of entities. There are some required parameters:
    1. apiEndpoint usually is /api/{entity_name_in_plural}
    2. rootPath usually is /{entity_name_in_plural}
    3. MainPageComponent usually is MainEntityPage, that is the default entity page
    4. DetailsPageComponent is the entity page that was created in step 3
5. __tests__ to test the pages behaviors. Add in this directory at least two page tests: {EntityName}Page.test.tsx and {EntityName}Details.test.tsx. It should test if the entities are being display in the table, if the refresh button is working, if it is possible to create a new entity, if it is possible to edit an entity, and if it is possible to delete an entity. Add tests in {EntityName}Page.test.tsx that click in the entity, open the entity details screen, update/delete the entity and check if the fetch entities was called again when return to the main page
