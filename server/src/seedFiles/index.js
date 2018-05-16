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
  password: '$2a$10$JNmon8b2KLUT.31FsTwyDeSz3ge/BZ5OOpc6mq32CzdAfU.DCz.4e',
  isCaterer: false
}
];

export const seedMeals = [{
  id: 'adb53a5a-06c7-4067-8062-c71a7ac5484e',
  userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
  title: 'Beef with Rice',
  description: 'plain rice with ground beef',
  imageUrl: 'https://cdn.pixabay.com/photo/2017/11/23/13/50/pumpkin-soup-2972858_960_720.jpg',
  price: 2000,
},
{
  id: '5422b66c-09a2-4413-81b1-a8ceed0a66bb',
  userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
  title: 'Spaghetti and Sauce',
  description: 'plain rice with ground beef',
  imageUrl: 'https://cdn.pixabay.com/photo/2017/11/23/13/50/pumpkin-soup-2972858_960_720.jpg',
  price: 1500,
},
{
  id: 'a30194b2-7925-48bf-99f2-5847042f34fd',
  userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
  title: 'Amala and Ewedu',
  description: 'plain rice with ground beef',
  imageUrl: 'https://cdn.pixabay.com/photo/2017/11/23/13/50/pumpkin-soup-2972858_960_720.jpg',
  price: 1800,
}
];