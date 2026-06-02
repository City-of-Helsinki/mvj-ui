[![Build](https://github.com/City-of-Helsinki/mvj-ui/workflows/Node.js%20CI/badge.svg)](https://github.com/City-of-Helsinki/mvj-ui/actions)



# MVJ UI
City of Helsinki Land lease UI


## What's in the box?

- [Typescript](https://www.typescriptlang.org/) Type checker
- [Yarn](https://yarnpkg.com/) Dependency manager
- [Vite](https://vitejs.dev/) Front-end tooling
- [Vitest](https://vitest.dev/) Testing framework
- [React](https://facebook.github.io/react/) User interface components
- [Redux](http://redux.js.org/) Predictable state container


## Usage with devcontainer

Open your editor, and then `Reopen in Container` (vscode).

Run vite dev server and expose port:

```bash
yarn --immutable
yarn dev:leasing --host
yarn dev:landuse --host
```

## Usage w/o Docker


#### 1. Yarn
Make sure you have [Yarn](https://yarnpkg.com/en/docs/install) installed globally.

#### 2. Install dependencies

```bash
yarn --immutable
```

#### 3. Add .env file

```bash
cp .env.example .env
```

#### 4. Start the development server

```bash
yarn dev:leasing
yarn dev:landuse
```

#### 5. Compile the distribution build

```bash
yarn run build
```
## Test

#### Run the test suite

```bash
yarn test
```

#### Run the test suit in watch mode

```bash
yarn run test:watch
```

#### Generate the test coverage report

```bash
yarn run test:coverage
```

## Automatic Code formatting

Install Prettier extension for VSCode. The editor will format TypeScript and SCSS files automatically on save.


## Environment variables

There are multiple .env files. Fill them in based on .env.example files:
- apps/leasing/.env
- apps/landuse/.env

The files contain e.g.
- API URL
- authentication provider parameters
- feature flags
