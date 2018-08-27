import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import format from 'date-fns/format';
import isToday from 'date-fns/is_today';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import 'react-table/react-table.css';
import ConnectedMealsTable from '../mealCard/ConnectedMealsTable';

const OrderContainer = ({ orders, ...props }) => {
  const hasEditMinutes = (updatedAt) => {
    const orderEditMinutes = parseInt(process.env.ORDER_EDIT_MINUTES, 10) || 15;
    const minutesSinceOrder = differenceInMinutes(new Date(), updatedAt);
    return orderEditMinutes - minutesSinceOrder > 0;
  };

  const newOrders = orders.map((order) => {
    const { updatedAt, id } = order;
    const formattedOrder = {
      id,
      time: format(updatedAt, 'h:mm A'),
      date: format(updatedAt, 'DD MMM, YYYY'),
      hasEditMinutes: isToday(updatedAt) && hasEditMinutes(updatedAt)
    };
    return formattedOrder;
  });

  const columns = [
    {
      Header: 'Order Id',
      accessor: 'id',
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
      Header: () => (
        <div className="flexbox">
          <span style={{ width: '50%' }}>
        Title
          </span>
          <span style={{ width: '17%' }}>
        Quantity
          </span>
          <span style={{ width: '17%' }}>
        Price (&#8358;)
          </span>
          <span style={{ width: '20%' }}>
        Total (&#8358;)
          </span>

        </div>
      ),
      accessor: 'id',
      Cell: columnProps =>
        (<ConnectedMealsTable
          id={columnProps.value}
        />),
      width: 900,
      style: { padding: '0' }
    }, {
      Header: '',
      accessor: 'hasEditMinutes',
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
        loading={props.loading}
        pages={props.pagination.pages}
        // page={Math.trunc(props.pagination.offset / props.pagination.limit)}
        onPageChange={props.getNextPage}
        page={props.defaultPage}
        // manual
      />
    </div>
  );
};
OrderContainer.defaultProps = {
  pagination: {
    pages: 1,
    limit: 10,
    offset: 0
  },
  loading: false
};
OrderContainer.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  addOrderToCart: PropTypes.func.isRequired,
  getNextPage: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    pages: PropTypes.number,
    limit: PropTypes.number,
    offset: PropTypes.number,
  }),
  loading: PropTypes.bool
};

export default OrderContainer;

