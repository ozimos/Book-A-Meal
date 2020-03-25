import { customerDienebi, seedPassword } from "../server/src/seedFiles";

module.exports = {
  beforeEach: browser => {
    browser.maximizeWindow();
  },
  "It should login customer and navigate to meal ordering page": browser => {
    browser
      .url("http://localhost:3500")
      .waitForElementVisible("body", 1000)
      .setValue('input[type="email"]', customerDienebi.email)
      .pause(1000)
      .setValue('input[type="password"]', seedPassword)
      .waitForElementVisible(".btn.login", 1000)
      .click(".btn.login")
      .pause(2000)
      .assert.containsText(
        ".greeting",
        `Welcome Customer ${customerDienebi.firstName}`
      );
  },

  "It should show today's menu on meal order page": browser => {
    browser.assert
      .containsText(
        ".greeting",
        `Welcome Customer ${customerDienebi.firstName}`
      )
      .waitForElementVisible("body", 1000)
      .pause(2000)
      .assert.containsText("#menu-title", "Today's Menu");
  },

  "It should add meal to cart if meal's add button is clicked": browser => {
    browser
      .pause(3000)
      .click(".scroll.gallery > .card:nth-child(2) > button")
      .pause(1000)
      .waitForElementVisible(".Toastify__toast-body", 3000)
      .assert.containsText(
        ".Toastify__toast-body",
        "Meal has been added to cart"
      )
      .pause(2000);
  },

  "It should not add meal to cart if meal has already been added to cart": browser => {
    browser
      .pause(3000)
      .click(".scroll.gallery > .card:nth-child(3) > button")
      .waitForElementVisible(".Toastify__toast-body", 3000)
      .pause(1000)
      .click(".scroll.gallery > .card:nth-child(3) > button")
      .pause(1000)
      .waitForElementVisible(
        "div.Toastify > div > div:nth-child(2) > div.Toastify__toast-body",
        3000
      )
      .assert.containsText(
        "div.Toastify > div > div:nth-child(2) > div.Toastify__toast-body",
        "Meal is already in cart"
      );
  },

  "It should navigate to cart and place order": browser => {
    browser
      .pause(2000)
      .click(".scroll.gallery > .card:nth-child(3) > button")
      .waitForElementVisible(".Toastify__toast-body", 3000)
      .waitForElementVisible("#cart-button", 3000)
      .pause(2000)
      .click("#cart-button")
      .pause(2000)
      .assert.containsText("#order-cart-heading > h5", "Order Cart")
      .pause(1000)
      .setValue(
        "#order-cart > div.responsive-table > table > tbody >" +
          "tr:nth-child(1) > td.quantity-cell > input",
        3
      )
      .pause(2000)
      .click("#place-order")
      .waitForElementVisible(".Toastify__toast-body", 3000)
      .assert.containsText(".Toastify__toast-body", "Order has been created");
  },

  "It should not remove meal from cart if only one meal is left": browser => {
    browser
      .pause(2000)
      .click(".scroll.gallery > .card:nth-child(3) > button")
      .waitForElementVisible(".Toastify__toast-body", 3000)
      .pause(2000)
      .click("#cart-button")
      .pause(2000)
      .waitForElementVisible("body > .ReactModalPortal .flexbox.cart", 1000)
      .click(
        "body > .ReactModalPortal tr.slim:first-of-type >" +
          "td:last-of-type > button"
      )
      .waitForElementVisible(".Toastify__toast-body", 3000)
      .assert.containsText(
        ".Toastify__toast-body",
        "There must be at least one meal in the cart." +
          " Use the clear cart button to clear cart"
      );
  },

  "It should remove meal from cart if delete is clicked": browser => {
    browser
      .pause(2000)
      .click("#order-cart-heading > button")
      .pause(2000)
      .click(".scroll.gallery > .card:nth-child(2) > button")
      .waitForElementVisible(".Toastify__toast-body", 3000)
      .pause(2000)
      .click("#cart-button")
      .pause(2000)
      .waitForElementVisible("body > .ReactModalPortal .flexbox.cart", 1000)
      .click(
        "#order-cart > div.responsive-table > table > tbody >" +
          "tr:nth-child(1) > td:nth-child(5) > button"
      )
      .pause(2000)
      .click("#order-cart-heading > button")
      .assert.containsText("#cart-button>.cart-notification>.badge", "1");
  },

  [`It should navigate to order history section and show order details
   when table row is clicked`]: browser => {
    browser
      .pause(2000)
      .click(".accordion__item:nth-child(2)")
      .pause(1000)
      .assert.containsText(
        ".accordion__item:nth-child(2) .long_string",
        "Your Order History"
      )
      .click(".rt-tr-group:first-of-type > .rt-tr.-odd > .rt-td:nth-child(1)")
      .pause(2000)
      .assert.containsText("#order-details", "Order Details")
      .pause(3000)
      .click("#order-details-close");
  },

  "It should add order to cart when order edit button is clicked": browser => {
    browser
      .pause(2000)
      .click(
        ".rt-tr-group:first-of-type > .rt-tr.-odd >" +
          ".rt-td.normal-cursor > button"
      )
      .pause(1000)
      .waitForElementVisible(".Toastify__toast-body", 3000)
      .assert.containsText(
        ".Toastify__toast-body",
        "Order has been added to cart for editing"
      )
      .pause(2000)
      .click("#cart-button")
      .pause(2000)
      .waitForElementVisible("body > .ReactModalPortal .flexbox.cart", 1000)
      .pause(1000)
      .setValue(
        "body > .ReactModalPortal tr.slim:first-of-type >" +
          ".quantity-cell > .meal-quantity",
        0
      )
      .pause(2000)
      .click("#place-order ")
      .pause(1000)
      .waitForElementVisible(".Toastify__toast-body", 3000)
      .assert.containsText(".Toastify__toast-body", "Order has been modified")
      .end();
  }
};
