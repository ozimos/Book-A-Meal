import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import format from 'date-fns/format';
import isToday from 'date-fns/is_today';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import 'react-table/react-table.css';

const OrderContainer = ({ orders, ...props }) => {
  const hasEditMinutes = (updatedAt) => {
    const orderEditMinutes = parseInt(process.env.ORDER_EDIT_MINUTES, 10) || 15;
    const minutesSinceOrder = differenceInMinutes(new Date(), updatedAt);
    return orderEditMinutes - minutesSinceOrder > 0;
  };
  const newOrders = [];
  orders.forEach((order) => {
    const { updatedAt, id } = order;
    const formattedOrder = {
      id,
      time: format(updatedAt, 'h:mm A'),
      date: format(updatedAt, 'DD MMM, YYYY'),
      hasEditMinutes: isToday(updatedAt) && hasEditMinutes(updatedAt)
    };
    order.Meals.forEach(meal =>
      newOrders.push({ ...formattedOrder,
        meal,
        total: meal.price * meal.MealOrders.quantity }));
  });

  const columns = [
    {
      Header: 'Order Id',
      accessor: 'id',
      width: 200,
      filterable: true
    }, {
      Header: 'Title',
      accessor: 'meal.title',
      width: 350,
      filterable: true
    }, {
      Header: 'Quantity',
      accessor: 'meal.MealOrders.quantity',
      width: 100
    }, {
      Header: 'Price (\u20a6)',
      accessor: 'meal.price',
      width: 100
    }, {
      Header: 'Total (\u20a6)',
      accessor: 'total',
      aggregate: vals => vals.reduce((accum, val) => accum + val),
      width: 150,
      filterable: true
    }, {
      Header: 'Date',
      accessor: 'date',
      width: 150,
      filterable: true
    }, {
      Header: 'Time',
      accessor: 'time',
      width: 100
    }, {
      accessor: 'hasEditMinutes',
      aggregate: vals => vals[0],
      Cell: columnProps => columnProps.value &&
      (
      <button
        className="btn title-button"
        onClick={() => props.addOrderToCart(columnProps.row.id)}
      >Edit
      </button>
      ),
      width: 50
    }
  ];
  return (
    <div>
      <ReactTable
        data={newOrders}
        columns={columns}
        className="-striped -highlight"
        minRows={0}
        defaultPageSize={props.pagination.limit}
        pivotBy={['id']}
        loading={props.loading}
        pages={props.pagination.pages}

      />
    </div>
  );
};
OrderContainer.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  addOrderToCart: PropTypes.func.isRequired
};

export default OrderContainer;

