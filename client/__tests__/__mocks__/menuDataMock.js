
export const menuMeals = [
  {
    id: 'meal1',
    price: 1200,
    title: 'Eba and Egusi',
    description: 'nice',
    imageUrl: 'nice',
    userId: 'user1',
    MealMenus: {
      userId: 'user1'
    }
  },
  {
    id: 'meal2',
    price: 2000,
    title: 'Rice and Stew',
    description: 'nice',
    imageUrl: 'nice',
    userId: 'user1',
    MealMenus: {
      userId: 'user1'
    }
  }
];

export const pagination = {
  limit: 10,
  offset: 0,
  count: 1,
  pages: 1,
};

export default {
  data: {
    ...pagination,
    rows: [{
      Meals: menuMeals
    }]
  }
};
