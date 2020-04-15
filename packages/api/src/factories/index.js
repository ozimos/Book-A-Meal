/* eslint-disable-next-line import/no-extraneous-dependencies */
const faker = require('faker/locale/en');
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const hashPassword = bcrypt.hashSync(faker.internet.password(), salt);
const imageUrls = [
    /* eslint-disable max-len */
    'https://res.cloudinary.com/tovieyeozim/image/upload/c_fill,w_200,h_200/v1532706744/hbj4qsguzdi78xcksws8.jpg',
    'https://res.cloudinary.com/tovieyeozim/image/upload/c_fill,w_200,h_200/v1532706744/hbj4qsguzdi78xcksws8.jpg',
    'https://res.cloudinary.com/tovieyeozim/image/upload/c_fill,w_200,h_200/v1532701830/hz2fmblixkuvbfnt4vvv.jpg',
    'https://res.cloudinary.com/tovieyeozim/image/upload/c_fill,w_200,h_200/v1532723568/rfja8q5tmldmtga2uc29.jpg',
    'https://res.cloudinary.com/tovieyeozim/image/upload/c_fill,w_200,h_200/v1532723402/ifzj4ynikksdo6tdtvko.jpg',
    'https://res.cloudinary.com/tovieyeozim/image/upload/c_fill,w_200,h_200/v1532722391/qgj8cexfzuopitoldmt7.jpg',
    'http://res.cloudinary.com/tovieyeozim/image/upload/c_fill,w_200,h_200/v1532723533/c4wpnbdit8pisnwlhk7x.jpg',
    /* eslint-enable max-len */
];

function getRandomInt(min = 1, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const userFactory = (defaults = {}) => ({
    id: faker.random.uuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: hashPassword,
    isCaterer: true,
    ...defaults,
});

const mealFactory = (caterer, defaults = {}) => ({
    id: faker.random.uuid(),
    userId: caterer.id,
    title: faker.random.words(getRandomInt(4, 2)),
    description: faker.lorem.sentence(),
    imageUrl: faker.random.arrayElement(imageUrls),
    price: getRandomInt(1500, 3000),
    ...defaults,
});

const menuFactory = (caterer, defaults = {}) => ({
    id: faker.random.uuid(),
    userId: caterer.id,
    menuDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...defaults,
});

const orderFactory = (user, defaults = {}) => ({
    id: faker.random.uuid(),
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...defaults,
});

const mealMenuFactory = (menu, meals, min) => {
    const max = meals.length;
    const length = min ? getRandomInt(min, max) : max;
    return Array.from({ length }, (v, k) => ({
        id: faker.random.uuid(),
        mealId: meals[k].id,
        menuId: menu.id,
    }));
};

const mealOrderFactory = (order, meals, min) => {
    const max = meals.length;
    const length = min ? getRandomInt(min, max) : max;
    return Array.from({ length }, (v, k) => ({
        id: faker.random.uuid(),
        quantity: getRandomInt(1, 10),
        mealId: meals[k].id,
        orderId: order.id,
    }));
};

module.exports = {
    userFactory,
    mealFactory,
    menuFactory,
    orderFactory,
    getRandomInt,
    mealMenuFactory,
    mealOrderFactory,
};
