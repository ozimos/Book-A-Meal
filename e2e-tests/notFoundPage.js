module.exports = {
  beforeEach: browser => {
    browser.maximizeWindow();
  },
  "It should redirect to `not found page` if route does not exist": browser => {
    browser
      .url("http://localhost:3500")
      .waitForElementVisible("body", 1000)
      .pause(3000)
      .url("http://localhost:3500/non-existing-page")
      .pause(2000)
      .waitForElementVisible("#not-found", 1000)
      .assert.containsText(
        "#not-found > div > div > h3",
        "Sorry, the page you are looking for does not exist"
      );
  },
  "It should redirect to login page if `Go home` is clicked": browser => {
    browser
      .pause(2000)
      .click("#not-found > div > div > h4 > a")
      .pause(1000)
      .waitForElementVisible("body", 1000)
      .assert.containsText(
        "#root > div > div > main > div.welcome > h5",
        "Sign in by entering the information below"
      )
      .pause(2000)
      .end();
  }
};
