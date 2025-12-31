
We are going to use styled components in this project. 

We need to use typescript.

For this project, all components should be located in the src/componenets folder. Each component should have a folder. Inside that, the component file, the style file and the index. The index should export the component. It should have a folder with tests too __tests__.

All pages should be located at src/pages. Pages can know the state, while components don't know the states. There will be a UnauthenticatedPage with the structure that will be used for all pages before login, like LandingPage, Login, Pricing, etc.

In the components and page, we are going to have only screen logic. All other logics should be separed and must be accessed by hooks.

All colors should be imported from src/styles/colors.ts.

