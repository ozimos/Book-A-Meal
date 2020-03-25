import {
  catererTovieye,
  seedMealOrders,
  seedOrders,
  seedPassword
} from "../server/src/seedFiles";
import db from "../server/src/models";

module.exports = {
  before: async () => {
    await db.Order.bulkCreate(seedOrders);
    await db.MealOrders.bulkCreate(seedMealOrders);
  },
  beforeEach: browser => {
    browser.maximizeWindow();
  },
  [`It should allow caterer to login and navigate caterer to
   meal management page`]: browser => {
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
      .assert.containsText(
        "#root > div > main > div.title-element.flexbox > h5",
        "Your Meals"
      )
      .pause(2000);
  },
  "It should allow caterer to edit a meal": browser => {
    browser
      .click(
        "#root > div > main > div.scroll2.gallery >" +
          "div:nth-child(3) > button.btn.pad-btn.modal-open"
      )
      .pause(2000)
      .waitForElementVisible(
        "body > div:nth-child(11) > div >" +
          "div > div.title.flexbox.navbar-fixed",
        1000
      )
      .assert.containsText(
        "body > div:nth-child(11) > div >" +
          "div > div.title.flexbox.navbar-fixed > h4",
        "Meal Editor"
      )
      .setValue(
        "body > div:nth-child(11) > div > div > div.form3-grid >" +
          " div:nth-child(1) > form > input:nth-child(3)",
        500
      )
      .pause(2000)
      .click("body > div:nth-child(11) > div > div > div.form3-grid > button")
      .pause(2000)
      .assert.containsText(
        "#root > div > main > div.scroll2.gallery > " +
          "div:nth-child(3) > div > div > div > span:nth-child(2)",
        "\u20a6500"
      )
      .pause(2000);
  },
  "It should not allow caterer to create a new meal": browser => {
    browser
      .click("#root > div > main > div.title-element.flexbox > button")
      .pause(1000)
      .waitForElementVisible(
        "body > div:nth-child(6) > div > div >" +
          "div.title.flexbox.navbar-fixed",
        1000
      )
      .assert.containsText(
        "body > div:nth-child(6) > div > div >" +
          "div.title.flexbox.navbar-fixed > h4",
        "Meal Editor"
      )
      .pause(1000)

      .setValue(
        "body > div:nth-child(6) > div > div > div.form3-grid >" +
          " div:nth-child(1) > form > input:nth-child(1)",
        "Fruit Basket"
      )
      .pause(2000)
      .setValue(
        "body > div:nth-child(6) > div > div > div.form3-grid >" +
          "div:nth-child(1) > form > input:nth-child(3)",
        500
      )
      .pause(2000)
      .setValue(
        "body > div:nth-child(6) > div > div > div.form3-grid >" +
          "div:nth-child(1) > form > textarea",
        "Healthy Living"
      )
      .pause(2000)
      .click("body > div:nth-child(6) > div > div > div.form3-grid > button")
      .pause(2000)
      .waitForElementVisible(
        "#root > div > main > div.scroll2.gallery > div:nth-child(1) > p",
        3000
      )
      .assert.containsText(
        "#root > div > main > div.scroll2.gallery > div:nth-child(1) > p",
        "Healthy Living"
      )
      .pause(2000);
  },
  "It should navigate to menu page and show caterer meals ": browser => {
    browser

      .click("#root > div > header > div > nav > div > a:nth-child(3)")
      .pause(1000)
      .waitForElementVisible("#accordion__title-0 > div > h5", 1000)

      .assert.containsText("#accordion__title-0 > div > h5", "Your Meals")
      .assert.containsText("#accordion__title-1 > div > h5", "Today's Menu")
      .pause(1000);
  },
  "It should show the caterer's menu for the day ": browser => {
    browser
      .click("#accordion__title-1")
      .pause(1000)
      .assert.containsText(
        "#accordion__body-1 > div:nth-child(2) > div > div:nth-child(1) > p",
        "plain rice with ground beef"
      )
      .assert.containsText(
        "#accordion__body-1 > div:nth-child(2) > div > div:nth-child(2) > p",
        "Filling and Tasty"
      )
      .assert.containsText(
        "#accordion__body-1 > div:nth-child(2) > div > div:nth-child(3) > p",
        "traditional"
      )
      .pause(1000);
  },

  "It should allow the caterer to clear the menu for the day": browser => {
    browser
      .click("#accordion__body-1 > div.title-element.flexbox > button")
      .pause(1000)
      .waitForElementVisible(".Toastify__toast-body", 3000)
      .assert.containsText(".Toastify__toast-body", "Menu has been cleared")
      .pause(2000);
  },
  [`It should add a meal to the menu cart if the meal's add 
  to menu button is clicked`]: browser => {
    browser
      .pause(2000)
      .click("#root > div > main > div.accordion > div:nth-child(1)")
      .pause(1000)
      .click(
        "#accordion__body-0 > div.scroll.gallery >" +
          "div:nth-child(3) > button"
      )
      .pause(1000)
      .waitForElementVisible(".Toastify__toast-body", 3000)
      .assert.containsText(
        ".Toastify__toast-body",
        "Meal has been added to menu cart"
      )
      .pause(2000);
  },
  [`It should not add a meal to the menu cart if the meal has already
   been added to the menu cart`]: browser => {
    browser
      .pause(3000)
      .click(
        "#accordion__body-0 > div.scroll.gallery >" +
          " div:nth-child(3) > button"
      )
      .waitForElementVisible(
        "#root > div > main > div.Toastify > div > div >" +
          "div.Toastify__toast-body",
        6000
      )
      .assert.containsText(
        "#root > div > main > div.Toastify > div > div >" +
          "div.Toastify__toast-body",
        "Meal is already in menu cart"
      );
  },
  "It should navigate to menu cart and post menu": browser => {
    browser
      .pause(2000)
      .click(
        "#accordion__body-0 > div.scroll.gallery > " +
          "div:nth-child(1) > button"
      )
      .waitForElementVisible(".Toastify__toast-body", 3000)
      .waitForElementVisible("#menu-cart-button", 3000)
      .pause(2000)
      .click("#menu-cart-button")
      .pause(2000)
      .assert.containsText(
        "body > div.ReactModalPortal > div > div >" +
          "aside > div > div:nth-child(1) > h5",
        "Menu Editor"
      )
      .pause(2000)
      .click(
        "body > div.ReactModalPortal > div > div > aside > div >" +
          " div:nth-child(3) > button:nth-child(1)"
      )
      .waitForElementVisible(".Toastify__toast-body", 3000)
      .assert.containsText(
        ".Toastify__toast-body",
        "Menu for the day has been posted"
      );
  },
  "It should show the new caterer's menu for the day ": browser => {
    browser
      .click("#accordion__title-1")
      .pause(1000)
      .assert.containsText(
        "#accordion__body-1 > div:nth-child(2) > div >" +
          "div:nth-child(1) > p",
        "plain rice with ground beef"
      )
      .assert.containsText(
        "#accordion__body-1 > div:nth-child(2) >" +
          " div > div:nth-child(2) > p",
        "traditional"
      )
      .pause(1000);
  },
  "It should navigate to the caterer's dashboard ": browser => {
    browser
      .click("#root > div > header > div > nav > div > a.nav-item.long_string")
      .pause(1000)
      .assert.containsText(
        "#dashboard > div > main > " +
          "div.order_detail.flexbox.title-element > h5",
        "Order History"
      )
      .pause(1000);
  },
  "It should show order details when table row is clicked": browser => {
    browser
      .pause(2000)
      .click(
        "#accordion__body-2 > div:nth-child(2) > div > div.rt-table >" +
          "div.rt-tbody > div:nth-child(1) > div > div.rt-td.test-click"
      )
      .pause(2000)
      .assert.containsText("#order-details", "Order Details")
      .pause(3000)
      .click("#order-details-close")
      .end();
  }
};
