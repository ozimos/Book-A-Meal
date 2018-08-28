import subDays from 'date-fns/sub_days';

export const seedUsers = [{
  id: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
  firstName: 'Tovieye',
  lastName: 'Ozi',
  email: 'ad.min@gmail.com',
  password: '$2a$10$JNmon8b2KLUT.31FsTwyDeSz3ge/BZ5OOpc6mq32CzdAfU.DCz.4e',
  isCaterer: true
},
{
  id: '20a0dcc4-0a78-43f6-881b-884dd6f32861',
  firstName: 'Toviey',
  lastName: 'Oz',
  email: 'adm.in@gmail.com',
  // eslint-disable-next-line max-len
  password: '$2a$10$JNmon8b2KLUT.31FsTwyDeSz3ge/BZ5OOpc6mq32CzdAfU.DCz.4e',
  isCaterer: false
}
];

export const seedMeals = [{
  id: 'adb53a5a-06c7-4067-8062-c71a7ac5484e',
  userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
  title: 'Beef with Rice',
  description: 'plain rice with ground beef',
  // eslint-disable-next-line max-len
  imageUrl: 'https://res.cloudinary.com/tovieyeozim/image/upload/c_fill,w_200,h_200/v1532706744/hbj4qsguzdi78xcksws8.jpg',
  price: 2000,
},
{
  id: '5422b66c-09a2-4413-81b1-a8ceed0a66bb',
  userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
  title: 'Spaghetti and Sauce',
  description: 'plain rice with ground beef',
  // eslint-disable-next-line max-len
  imageUrl: 'https://res.cloudinary.com/tovieyeozim/image/upload/c_fill,w_200,h_200/v1532701830/hz2fmblixkuvbfnt4vvv.jpg',
  price: 1500,
},
{
  id: 'a30194b2-7925-48bf-99f2-5847042f34fd',
  userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
  title: 'Amala and Ewedu',
  description: 'traditional',
  // eslint-disable-next-line max-len
  imageUrl: 'https://res.cloudinary.com/tovieyeozim/image/upload/c_fill,w_200,h_200/v1532723568/rfja8q5tmldmtga2uc29.jpg',
  price: 1800,
},
{
  id: '226ecfc3-82bf-4075-b623-ea0c1fe1bb25',
  userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
  title: 'Starch and Owho',
  description: 'affordable',
  // eslint-disable-next-line max-len
  imageUrl: 'https://res.cloudinary.com/tovieyeozim/image/upload/c_fill,w_200,h_200/v1532723402/ifzj4ynikksdo6tdtvko.jpg',
  price: 1800,
},
{
  id: '443b76e7-b152-4937-890e-492c842b45a8',
  userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
  title: 'Pancake and Syrup',
  description: 'affordable',
  // eslint-disable-next-line max-len
  imageUrl: 'https://res.cloudinary.com/tovieyeozim/image/upload/c_fill,w_200,h_200/v1532722391/qgj8cexfzuopitoldmt7.jpg',
  price: 1800,
},
{
  id: 'a49498b3-889a-43f9-8582-058da7b8402a',
  userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
  title: 'Starch and Owho',
  description: 'affordable',
  // eslint-disable-next-line max-len
  imageUrl: 'http://res.cloudinary.com/tovieyeozim/image/upload/c_fill,w_200,h_200/v1532723533/c4wpnbdit8pisnwlhk7x.jpg',
  price: 1800,
}
];
export const seedMenus = [{
  id: '443b76e7-b152-4937-890e-492c842b45a8',
  createdAt: subDays(new Date(), 1),
  updatedAt: subDays(new Date(), 1)
},
{
  id: 'a49498b3-889a-43f9-8582-058da7b8402a',
  createdAt: new Date(),
  updatedAt: new Date()
}
];
export const seedMealMenus = [{
  mealId: seedMeals[0].id,
  menuId: seedMenus[0].id,
  userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
  createdAt: subDays(new Date(), 1),
  updatedAt: subDays(new Date(), 1)
},
{
  mealId: seedMeals[1].id,
  menuId: seedMenus[0].id,
  userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
  createdAt: subDays(new Date(), 1),
  updatedAt: subDays(new Date(), 1)
},
{
  mealId: seedMeals[2].id,
  menuId: seedMenus[0].id,
  userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
  createdAt: subDays(new Date(), 1),
  updatedAt: subDays(new Date(), 1)
},
{
  mealId: seedMeals[4].id,
  menuId: seedMenus[1].id,
  userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  mealId: seedMeals[0].id,
  menuId: seedMenus[1].id,
  userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  mealId: seedMeals[1].id,
  menuId: seedMenus[1].id,
  userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
  createdAt: new Date(),
  updatedAt: new Date()
}];
