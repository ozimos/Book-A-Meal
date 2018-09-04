# Book-A-Meal

[![Build Status](https://travis-ci.org/ozimos/Book-A-Meal.svg?branch=develop)](https://travis-ci.org/ozimos/Book-A-Meal)
[![Coverage Status](https://coveralls.io/repos/github/ozimos/Book-A-Meal/badge.svg?branch=develop)](https://coveralls.io/github/ozimos/Book-A-Meal?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/77dae76840f23281165a/maintainability)](https://codeclimate.com/github/ozimos/Book-A-Meal/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/77dae76840f23281165a/test_coverage)](https://codeclimate.com/github/ozimos/Book-A-Meal/test_coverage)

## What the project does

Book-A-Meal is an application that allows customers to make food orders and helps the food
vendor know what the customers want to eat.

## Why the project is useful

Given you manage a catering business, this app will help you manage meals and menus, and will enable customers to make bookings and show a dashboard summary of bookings made and profits accrued.

## Features

### Caterer (Admin)

* manage meals (create, modify, delete)
* manage menu (create, modify, delete) for specific day
* view summary and details of orders for specific day

### All Users

* sign up and sign in
* place a meal order from the menu for a specific day

API Endpoints

* Get All Meals  - GET /api/v1/meals
* Add a Meal  - POST /api/v1/meals
* Update a Meal  - PUT /api/v1/meals/:mealId
* Delete a Meal - DELETE /api/v1/meals/:mealId
* Get the menu for the day - GET /api/v1/menu
* Setup the menu for the day - POST /api/v1/menu
* Get All Orders  - GET /api/v1/orders
* Place an order  - POST /api/v1/orders
* Modify an order  - PUT /api/v1/orders/:orderId
* View API Documentation  - GET /api/v1/docs

## Getting Started

* [View UI Templates](<https://ozimos.github.io/Book-A-Meal/UI> "Github Project Hosting")
* [View the full application hosted on Heroku](https://book-a-meal-andela-31.herokuapp.com/)
* [View the application API Documentation](https://book-a-meal-andela-31.herokuapp.com/api/v1/docs)
* [Track progress on application features with Pivotal Tracker](<https://www.pivotaltracker.com/n/projects/2165548> "Pivotal Tracker Project")
* Requirements

  * Back-end: Node/Expressjs
  * Libraries: ES6, Babel-CLI, eslint, Mocha/Chai, Postman

## How to setup the project/Installation/Configuration
 * Install [Node js](https://nodejs.org/en/) and [PostgreSQL](https://www.postgresql.org/)
  * Clone or download this repository
  * Install ```sequelize-cli``` globally on your local machine
  * Navigate inside the cloned or downloaded directory
  * ```npm install``` - to install the dependencies required by the app
  * Create a .env file in the root directory of the app using the .env.example file as a template
   * ```npm run migrate``` - to setup the app database
   * you can run the app in development or production mode
      #### Development 
      * ```npm run start:dev``` - to run the app in development mode
      #### Production 
  
      * ```npm run start:prod``` - to run the app in production mode
 * Navigate to ```localhost:3500``` in your browser to view app

## How to run tests
  * Setup the app as detailed above
  * ```npm run test:client``` - to test the app client side
  * ```npm run test:server``` - to test the app server side
  * Using Postman import this endpoint collection link <https://www.getpostman.com/collections/85eee7927738b7112a13>
  * Test the API Endponts with Postman

  ## Release
* Version 1.0.0
  * Still in developement

  ## Technologies & Tools
* HTML/CSS/JS - Base tchnologies for web development
* SCSS - CSS Preprocessor
* [Materialize](https://materializecss.com/) CSS Framework
* [Node js](https://nodejs.org/en/) - Javascript Run Time Engine
* [NPM](https://www.npmjs.com/) - Package Manager
* [Express](https://expressjs.com/) - Web Application Framework
* [React js](https://reactjs.org/) - UI Library
* [Webpack](https://webpack.js.org/) - Module Bundler
* [Eslint](https://eslint.org/) - Code Linter
* [Babel](http://babeljs.io/) - Transpiler for ES6+ code
* [Pivotal Tracker](https://www.pivotaltracker.com/n/projects/2165548) Project Manager
* [Mocha](https://mochajs.org/) - Javascript Testing Framework
* [Jest](https://jestjs.io/) - Javascript Testing Framework
* [Chai](http://www.chaijs.com/) - Assertion Library for Node
* [Istanbul](https://istanbul.js.org/) - Code Instrumentation and Test Coverage Generation

## Contributing
 To contribute follow the steps below:
* Fork this project and clone to your local machine
* Create a Pull Request for your features to the original repository

## Author
* **Tovieye Moses Ozi**
