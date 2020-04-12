import { catererTovieye, seedPassword } from "../server/src/seedFiles";

module.exports = {
  beforeEach: browser => {
    browser.maximizeWindow();
  },

  "It should log in registered users": browser => {
    browser
      .url("http://localhost:3500")
      .waitForElementVisible("body", 1000)
      .setValue('input[type="email"]', catererTovieye.email)
      .pause(1000)
      .setValue('input[type="password"]', seedPassword)
      .waitForElementVisible(".btn.login", 1000)
      .click(".btn.login")
      .pause(2000)
      .assert.containsText(
        ".greeting",
        `Welcome Caterer ${catererTovieye.firstName}`
      )
      .pause(2000)
      .end();
  },

  "It should return error if email does not exist`": browser => {
    browser
      .url("http://localhost:3500")
      .waitForElementVisible("body", 1000)
      .setValue('input[type="email"]', "random@gmail.com")
      .pause(1000)
      .setValue('input[type="password"]', seedPassword)
      .waitForElementVisible(".btn.login", 1000)
      .click(".btn.login")
      .waitForElementVisible(".error:last-of-type", 3000)
      .assert.containsText(".error:last-of-type", "Incorrect email or password")
      .pause(2000)
      .end();
  },
  "It should show error if password is wrong`": browser => {
    browser
      .url("http://localhost:3500")
      .waitForElementVisible("body", 1000)
      .setValue('input[type="email"]', catererTovieye.email)

      .setValue('input[type="password"]', "wrongP@ssw0rd")
      .waitForElementVisible(".btn.login", 1000)
      .click(".btn.login")
      .waitForElementVisible(".error:nth-of-type(2)", 3000)
      .assert.containsText(
        ".error:nth-of-type(2)",
        "Incorrect email or password"
      )
      .pause(2000)
      .end();
  }
};
