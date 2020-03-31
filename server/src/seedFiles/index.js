const bcrypt = require("bcryptjs");
const faker = require("faker/locale/en");
const flattenDeep = require("lodash/flattenDeep");
const {
  userFactory,
  mealFactory,
  menuFactory,
  orderFactory,
  getRandomInt
} = require("../factories");
const seedPassword = "Thisisatestpassword";
const salt = bcrypt.genSaltSync(10);
const hashPassword = bcrypt.hashSync(seedPassword, salt);

const seedCaterers = Array.from({ length: 4 }, () => userFactory({password: hashPassword,}));

const seedUsers = Array.from({ length: 8 }, () =>
  userFactory({ isCaterer: false })
);

const catererTovieye = seedCaterers[0];
const catererDouglas = seedCaterers[1];
const customerDienebi = seedUsers[2];

const seedMealsNested = seedCaterers.map(caterer =>
  Array.from({ length: 6 }, () => mealFactory(caterer))
);
const seedMeals = flattenDeep(seedMealsNested);

const seedMenus = seedCaterers.map(caterer => menuFactory(caterer));

const seedMealMenusNested = seedMenus.map((menu, index) =>
  Array.from({ length: getRandomInt(2, 6) }, (v, k) => ({
    mealId: seedMealsNested[index][k].id,
    menuId: menu.id,
    userId: menu.userId,
    createdAt: new Date(),
    updatedAt: new Date()
  }))
);

const seedMealMenus = flattenDeep(seedMealMenusNested);

const seedOrders = Array.from({ length: 4 }, () =>
  orderFactory(faker.random.arrayElement(seedUsers))
);

const seedMealOrdersNested = seedOrders.map((order) =>
  Array.from({ length: getRandomInt(1, 3) }, () => ({
    orderId: order.id,
    mealId: faker.random.arrayElement(seedMealMenus).mealId,
    quantity: getRandomInt(1, 3),
    createdAt: new Date(),
    updatedAt: new Date()
  }))
);

const seedMealOrders = flattenDeep(seedMealOrdersNested);
const allSeedUsers = seedCaterers.concat(seedUsers);

module.exports = {
  seedPassword,
  hashPassword,
  seedUsers,
  seedCaterers,
  allSeedUsers,
  catererTovieye,
  catererDouglas,
  customerDienebi,
  seedMeals,
  seedMenus,
  seedMealMenus,
  seedOrders,
  seedMealOrders,
};
