import differenceInMinutes from 'date-fns/difference_in_minutes';

export default (updatedAt) => {
  const orderEditMinutes = parseInt(process.env.ORDER_EDIT_MINUTES, 10) || 15;
  const minutesSinceOrder = differenceInMinutes(new Date(), updatedAt);
  return orderEditMinutes - minutesSinceOrder > 0;
};
