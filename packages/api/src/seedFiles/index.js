const bcrypt = require("bcryptjs");
const faker = require("faker/locale/en");
const flattenDeep = require("lodash/flattenDeep");
const {
  userFactory,
  mealFactory,
  menuFactory,
  orderFactory,
  mealMenuFactory,
  mealOrderFactory,
} = require("../factories");
const seedPassword = "Thisisatestpassword";
const salt = bcrypt.genSaltSync(10);
const hashPassword = bcrypt.hashSync(seedPassword, salt);

const seedCaterers = Array.from({ length: 4 }, () =>
  userFactory({ password: hashPassword })
);

const seedUsers = Array.from({ length: 8 }, () =>
  userFactory({ isCaterer: false })
);

const seedMealsNested = seedCaterers.map((caterer) =>
  Array.from({ length: 6 }, () => mealFactory(caterer))
);
const seedMeals = flattenDeep(seedMealsNested);

const seedMenus = seedCaterers.map((caterer) => menuFactory(caterer));

const seedMealMenusNested = seedMenus.map((menu, index) =>
  mealMenuFactory(menu, seedMealsNested[index], 2)
);

const seedMealMenus = flattenDeep(seedMealMenusNested);

const seedOrders = Array.from({ length: 4 }, () =>
  orderFactory(faker.random.arrayElement(seedUsers))
);

const seedMealOrdersNested = seedOrders.map((order, index) =>
  mealOrderFactory(order, seedMealsNested[index], 3)
);

const seedMealOrders = flattenDeep(seedMealOrdersNested);
const allSeedUsers = seedCaterers.concat(seedUsers);

module.exports = {
  seedPassword,
  hashPassword,
  seedUsers,
  seedCaterers,
  allSeedUsers,
  seedMeals,
  seedMenus,
  seedMealMenus,
  seedOrders,
  seedMealOrders,
};
