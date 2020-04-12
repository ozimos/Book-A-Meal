import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import format from 'date-fns/format';
import isToday from 'date-fns/is_today';
import 'react-table/react-table.css';
import canEdit from '../../services/canEdit';

const OrderTableContainer = ({ orders, ...props }) => {

  const columns = [
    {
      Header: 'Order Id',
      accessor: 'id',
      width: 550,
    }, {
      Header: 'Date',
      accessor: 'createdAt',
      Cell: columnProps =>
        (<span>{format(columnProps.value, 'DD MMM, YYYY')}</span>),
      width: 250,
    }, {
      Header: 'Time',
      accessor: 'createdAt',
      Cell: columnProps => (<span>{format(columnProps.value, 'h:mm A')}</span>),
      width: 200
    }, {
      Header: '',
      accessor: 'createdAt',
      Cell: columnProps => isToday(columnProps.value) &&
      canEdit(columnProps.value) &&
      (
        <div className="flexbox">
          <button
            className="btn title-button"
            onClick={() => props.addOrderToCart(columnProps.row.id)}
            disabled={props.loadingMeals ||
          (props.currentOrderId === columnProps.row.id)}
          >
      Edit
          </button>

          <button
            className="btn title-button"
            onClick={() => props.deleteOrder(columnProps.row.id)}
            disabled={props.loading ||
         (props.currentOrderId === columnProps.row.id)}
          >
     Delete
          </button>
        </div>

      ),
      getProps: () => ({
        style: {
          cursor: 'auto',
          marginRight: 'auto',
          marginLeft: 'auto',
        }
      }),
      className: 'normal-cursor',
      width: 200
    }
  ];
  return (
    <div>

      <ReactTable
        data={orders}
        columns={columns}
        className="-striped -highlight clickable"
        minRows={5}
        defaultPageSize={props.pagination.limit}
        loading={props.loading}
        pages={props.pagination.pages}
        onFetchData={props.onFetchData}
        sortable={false}
        resizable={false}
        manual
        getTdProps={(state, rowInfo, column) => ({
            onClick: () => {
              if (column.Header) {
                props.getOrderMeals(rowInfo.row.id);
                props.getOrderMealsTotals(rowInfo.row.id);
              }
            }
          })}
      />

    </div>
  );
};
OrderTableContainer.defaultProps = {

  pagination: {
    pages: 1,
    limit: 10,
    offset: 0
  },
  loading: false,
  loadingMeals: false,
  currentOrderId: ''

};

OrderTableContainer.propTypes = {

  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  addOrderToCart: PropTypes.func.isRequired,
  deleteOrder: PropTypes.func.isRequired,
  getOrderMeals: PropTypes.func.isRequired,
  getOrderMealsTotals: PropTypes.func.isRequired,
  onFetchData: PropTypes.func.isRequired,
  currentOrderId: PropTypes.string,
  pagination: PropTypes.shape({
    pages: PropTypes.number,
    limit: PropTypes.number,
    offset: PropTypes.number,
  }),
  loading: PropTypes.bool,
  loadingMeals: PropTypes.bool

};

export default OrderTableContainer;

