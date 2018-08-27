import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';

import { connect } from 'react-redux';
import { orderActions } from '../../redux/actions';


class MealsTable extends Component {

  componentDidMount() {
    this.props.dispatch(orderActions.getMealsInOrder(this.props.id));
  }

  getNextPage = (page) => {
    const { orders, id } = this.props;
    const { pagination }
     = orders.find(order => order.id === id);
    const { limit } = pagination;
    const offset = limit * page;
    this.props.dispatch(orderActions
      .getMealsInOrder({ limit, offset }));
  }
  render() {
    const columns = [
      {
        headerStyle: { height: '0' },
        id: 'pivot',
        accessor: () => '',
        width: 30
      }, {
        headerStyle: { height: '0' },
        accessor: 'title',
        width: 400
      }, {
        headerStyle: { height: '0' },
        accessor: 'MealOrders.quantity',
        width: 150
      }, {
        headerStyle: { height: '0' },
        accessor: 'price',
        width: 150
      }, {
        headerStyle: { height: '0' },
        aggregate: vals => vals.reduce((accum, val) => accum + val),
        accessor: 'subTotal',
        width: 100
      }
    ];
    const { orders, id } = this.props;
    const { Meals, pagination = {}, connecting }
     = orders.find(order => order.id === id);

    return (
      <ReactTable
        data={Meals}
        columns={columns}
        minRows={0}
        defaultPageSize={pagination.limit || 5}
        pivotBy={['pivot']}
        loading={connecting}
        pages={pagination.pages || 1}
        onPageChange={this.getNextPage}
        collapseOnSortingChange={false}
        nextText=">>"
        previousText="<<"
      />
    );
  }
}
MealsTable.defaultProps = {
  orders: [],
};
MealsTable.propTypes = {
  id: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  orders: PropTypes.arrayOf(PropTypes.object),
};
const mapStateToProps = state => ({
  orders: state.orderReducer.orders,
});
export { MealsTable };
export default connect(mapStateToProps)(MealsTable);
