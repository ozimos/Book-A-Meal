import { catererTovieye, seedPassword } from "../server/src/seedFiles";

const catererEfosa = {
  firstName: "Efosa",
  lastName: "Agbo",
  email: "efosa@gmail.com",
  password: seedPassword,
  isCaterer: true
};
module.exports = {
  beforeEach: browser => {
    browser.maximizeWindow();
  },

  "It should register user when all inputs are correctly filled": browser => {
    browser
      .url("http://localhost:3500")
      .waitForElementVisible("body", 1000)
      .click("#signup")
      .waitForElementVisible(".canvas.signup", 1000)
      .setValue('input[type="email"]', catererEfosa.email)
      .setValue("input:nth-of-type(2)", catererEfosa.firstName)
      .setValue("input:nth-of-type(3)", catererEfosa.lastName)
      .setValue("input:nth-of-type(4)", seedPassword)
      .setValue("input:nth-of-type(5)", seedPassword)
      .click("input#isCaterer")
      .waitForElementVisible("#signup-button", 1000)
      .click("#signup-button")
      .pause(2000)
      .assert.containsText(
        ".greeting",
        `Welcome Customer ${catererEfosa.firstName}`
      )
      .pause(2000)
      .end();
  },

  "It should show error if email has been taken": browser => {
    browser
      .url("http://localhost:3500")
      .waitForElementVisible("body", 1000)
      .click("#signup")
      .waitForElementVisible(".canvas.signup", 1000)
      .setValue('input[type="email"]', catererTovieye.email)
      .setValue("input:nth-of-type(2)", catererEfosa.firstName)
      .setValue("input:nth-of-type(3)", catererEfosa.lastName)
      .setValue("input:nth-of-type(4)", seedPassword)
      .setValue("input:nth-of-type(5)", seedPassword)
      .click("input#isCaterer")
      .waitForElementVisible("#signup-button", 1000)
      .click("#signup-button")
      .pause(2000)
      .waitForElementVisible(".error:first-of-type", 3000)
      .assert.containsText(".error:first-of-type", "Email is not available")
      .pause(2000)
      .end();
  },

  "It should show error if email format is wrong`": browser => {
    browser
      .url("http://localhost:3500")
      .waitForElementVisible("body", 1000)
      .click("#signup")
      .waitForElementVisible(".canvas.signup", 1000)
      .setValue('input[type="email"]', "wrongEmail.com")

      .waitForElementVisible(".error:first-of-type", 3000)
      .assert.containsText(".error:first-of-type", "This is not a valid email")
      .pause(2000)
      .end();
  },

  "It should show error if both passwords do not match`": browser => {
    browser
      .url("http://localhost:3500")
      .waitForElementVisible("body", 1000)
      .click("#signup")
      .waitForElementVisible(".canvas.signup", 1000)
      .setValue("input:nth-of-type(4)", seedPassword)
      .setValue("input:nth-of-type(5)", "wrongP@ssw0rd")
      .waitForElementVisible(".error:last-of-type", 3000)
      .assert.containsText(".error:last-of-type", "Passwords do not match")
      .pause(2000)
      .end();
  }
};
