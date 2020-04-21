# Book-A-Meal

[![Maintainability](https://api.codeclimate.com/v1/badges/77dae76840f23281165a/maintainability)](https://codeclimate.com/github/ozimos/Book-A-Meal/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/77dae76840f23281165a/test_coverage)](https://codeclimate.com/github/ozimos/Book-A-Meal/test_coverage)
[![codecov](https://codecov.io/gh/ozimos/Book-A-Meal/branch/develop/graph/badge.svg)](https://codecov.io/gh/ozimos/Book-A-Meal)

## What the project does

Book-A-Meal is an application that allows customers to make food orders and helps the food
vendor know what the customers want to eat.

# Table of Contents
* [Features](##Features)
* [Getting Started](##Getting-Started)
* [Release](##Release)
* [Technologies & Tools](##Technologies-&-Tools)
* [API](##API-Documentation)
* [Contributing](##Contributing)
* [Authors](##Authors)
* [Licence](##Licence)


## Why the project is useful

Given you manage a catering business, this app will help you manage meals and menus, and will enable customers to make bookings and show a dashboard summary of bookings made and profits accrued.

## Features

### Caterer (Admin)

* Caterer is able to add their meals to the meal database
* Caterer is able to edit or remove added meals
* Caterer is able to set menu for the current day 
* Caterer is able to see the orders made for their meals
* Caterer is able to see their order history
* Caterer dashboard shows the total revenue for the day
* App supports multiple cateres

### Customers

* Customer is able to view menu for the day
* Customer is able to place orders
* Customer is able to cancel order within 15 minutes of placing the order
* Customer is able to view the history of their orders on the app

### All Users

* Users can signup as a caterer or customer
* User can login to the app


## Getting Started

* [View UI Templates](<https://ozimos.github.io/Book-A-Meal/UI> "Github Project Hosting")
* [View the full application hosted on Heroku](https://book-a-meal-andela-31.herokuapp.com/)
* [View the application API Documentation](https://book-a-meal-andela-31.herokuapp.com/api/v1/docs)
* [Track progress on application features with Pivotal Tracker](<https://www.pivotaltracker.com/n/projects/2165548> "Pivotal Tracker Project")
### Requirements

  * Back-end: Node/Expressjs
  * Libraries: ES6, Babel-CLI, eslint, Mocha/Chai, Postman

  ### How to setup the project/Installation/Configuration

  * Install [Node js](https://nodejs.org/en/) and [PostgreSQL](https://www.postgresql.org/)
  * Install [sequelize-cli](https://www.npmjs.com/package/sequelize-cli) 
  globally on your local machine
  * Clone or download this [repository](https://github.com/ozimos/Book-A-Meal.git)
  
  * Open a terminal and navigate inside the cloned or downloaded directory
  * In your terminal, run `npm install` - to install the dependencies required by the app
  * Create a .env file in the root directory of the app using the .env.example file as a template
   * `npm run migrate` - to setup the app database
   * you can run the app in development or production mode
      #### Development 
      * `npm run start:dev` - to run the app in development mode
      #### Production 
  
      * `npm run start:prod` - to run the app in production mode
  * Navigate to `localhost:3500` in your browser to view app

### How to run tests
  * Setup the app as detailed above
  * `npm run test:client` - to test the app client side
  * `npm run test:server` - to test the app server side
  *  End to End testing
     * Install `Java JDK` on your Local machine
     * `npm run e2e:setup` to install the test utilities
     *  `npm run e2e:server` to start the app before testing
     * In a separate terminal window execute `npm run e2e:start` to run the end to end tests

## Release
* Version 1.0.0
  * Still in developement

## Technologies & Tools
* [Node js](https://nodejs.org/en/) - Javascript Run Time Engine
* [NPM](https://www.npmjs.com/) - Package Manager
* [Express](https://expressjs.com/) - Web Application Framework
* [React js](https://reactjs.org/) - UI Library
* [Webpack](https://webpack.js.org/) - Module Bundler
* [Eslint](https://eslint.org/) - Code Linter
* [Pivotal Tracker](https://www.pivotaltracker.com/n/projects/2165548) Project Manager

## API Documentation
The API documentation is powered by Swagger. View the [API](https://book-a-meal-andela-31.herokuapp.com/api/v1/docs)

## Contributing
 This app is in development and contributions are welcome. To contribute follow the steps below:
* Fork this [project](https://github.com/ozimos/Book-A-Meal.git) and clone to your local machine
* Create a branch for any new feature and write tests for your features
* Ensure to follow the commit message, branch naming and pull request conventions specified in this project's wiki
* Create a Pull Request for your branch to the original repository
* Automated tests will be run upon creation of the pull request
* Pull requests that pass the automated tests and do not reduce project test coverage will be merged after review by the project owner or other contributors.

## Authors
* **Tovieye Moses Ozi**


## License
  [MIT License](https://opensource.org/licenses/MIT)
