export default (orders) => {
  const userId = orders.map(order => order.userId);

  return new Set(userId).size;
};

