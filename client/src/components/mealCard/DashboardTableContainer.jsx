import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import format from 'date-fns/format';
import 'react-table/react-table.css';

const DashboardTableContainer = ({ orders, ...props }) => {

  const columns = [
    {
      Header: 'Order Id',
      accessor: 'id',
      className: 'test-click',
      width: 300,
    }, {
      Header: 'Customer',
      accessor: 'User',
      Cell: columnProps => (
        <span>
          {columnProps.row.User.firstName} &nbsp;
          {columnProps.row.User.lastName}
        </span>
      ),
      width: 150,
    }, {
      Header: 'Customer Id',
      accessor: 'userId',
      width: 200,
    }, {
      Header: 'Date',
      accessor: 'updatedAt',
      Cell: columnProps =>
        (<span>{format(columnProps.value, 'DD MMM, YYYY')}</span>),
      width: 100,
    }, {
      Header: 'Time',
      accessor: 'updatedAt',
      Cell: columnProps => (<span>{format(columnProps.value, 'h:mm A')}</span>),
      width: 100
    }
  ];
  return (
    <div>
      <ReactTable
        data={orders}
        columns={columns}
        className="-striped -highlight clickable"
        minRows={0}
        defaultPageSize={props.pagination.limit}
        loading={props.loading}
        pages={props.pagination.pages}
        onFetchData={props.onFetchData}
        sortable={false}
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

DashboardTableContainer.defaultProps = {
  pagination: {
    pages: 1,
    limit: 10,
    offset: 0
  },
  loading: false,
};
DashboardTableContainer.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  getOrderMeals: PropTypes.func.isRequired,
  getOrderMealsTotals: PropTypes.func.isRequired,
  onFetchData: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    pages: PropTypes.number,
    limit: PropTypes.number,
    offset: PropTypes.number,
  }),
  loading: PropTypes.bool
};

export default DashboardTableContainer;

