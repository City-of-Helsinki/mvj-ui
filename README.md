[![Build status](https://travis-ci.org/City-of-Helsinki/mvj-ui.svg?branch=master)](https://travis-ci.org/City-of-Helsinki/mvj-ui)
[![codecov](https://codecov.io/gh/City-of-Helsinki/mvj-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/City-of-Helsinki/mvj-ui)

# MVJ UI 
City of Helsinki ground rent system UI

Based on [React Boilerplate](https://github.com/nordsoftware/react-boilerplate).

## What's in the box?

- [Flowtype](https://flowtype.org/) Type checker
- [Yarn](https://yarnpkg.com/) Dependency manager
- [React](https://facebook.github.io/react/) User interface components
- [Redux](http://redux.js.org/) Predictable state container
- [Lodash](https://lodash.com/) Utility library
- [Babel](https://babeljs.io/) ES.Next transpiler
- [Eslint](http://eslint.org/) Linting utility
- [Webpack](https://webpack.github.io/) Module bundler
- [Mocha](https://mochajs.org/) Testing framework
- [Chai](http://chaijs.com/) Assertion library
- [Enzyme](https://github.com/airbnb/enzyme) React testing utilities
- And more...

## Usage with Docker

Start the docker container with:

```bash
docker-compose up
```

The project is now live at [http://localhost:3000](http://localhost:3000)

You can log into the container to execute some commands like so:

```bash
docker exec -it mvj-ui bash
```

If you want to set up full integration with mvj backend and tunnistamo, check
[here](https://github.com/City-of-Helsinki/mvj#connecting-to-tunnistamo)
for the guidance.

## Usage w/o Docker


#### 1. Yarn
Make sure you have [Yarn](https://yarnpkg.com/en/docs/install) installed globally.

#### 2. Install dependencies

```bash
yarn
```

#### 3. Add .env file

```bash
cp .env.example .env
```

#### 4. Start the development server

```bash
yarn start
```

#### 5. Compile the distribution build

```bash
yarn run compile
```
## Test

#### Run the test suite

```bash
yarn test
```

#### Run the test suit in watch mode

```
yarn run test:watch
```

#### Generate the test coverage report

```
yarn run test:coverage
```
