import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';


class MealsTable extends Component {

  render() {

    const columns = [
      {
        Header: 'Meal Title',
        accessor: 'title',
        width: 275
      }, {
        Header: 'Quantity',
        accessor: 'MealOrders.quantity',
        width: 75
      }, {
        Header: () => (<span>Price (&#8358;)</span>),
        accessor: 'price',
        width: 175
      }, {
        Header: () => (<span>Subtotal (&#8358;)</span>),
        aggregate: vals => vals.reduce((accum, val) => accum + val),
        accessor: 'subTotal',
        width: 175
      }
    ];

    return (
      <div className="order-meal-modal" id="order-meal-modal">

        <div className="flexbox top">

          <h5 id="order-details">Order Details</h5>

          <button
            id="order-details-close"
            className="btn title-button"
            onClick={this.props.closeMealDetailModal}
          >
                &#10006;
          </button>

        </div>

        <div className="flexbox">

          <span>
        Total Charge:
          </span>

          <span>
            &#8358;{this.props.total}
          </span>

        </div>

        <ReactTable
          ref={(refReactTable) => { this.refReactTable = refReactTable; }}
          data={this.props.meals}
          columns={columns}
          minRows={0}
          defaultPageSize={this.props.mealsPagination.limit}
          loading={this.props.loading}
          pages={this.props.mealsPagination.pages}
          onFetchData={this.props.onFetchData}
          sortable={false}
          manual
          resizable={false}
          collapseOnSortingChange={false}
          collapseOnDataChange={false}
          collapseOnPageChange={false}
          nextText=">>"
          previousText="<<"
        />

      </div>
    );
  }
}

MealsTable.defaultProps = {
  mealsPagination: {
    pages: 1,
    limit: 5,
    offset: 0
  },
  loading: false,
  total: 0,
};

MealsTable.propTypes = {
  meals: PropTypes.arrayOf(PropTypes.object).isRequired,
  mealsPagination: PropTypes.shape({
    pages: PropTypes.number,
    limit: PropTypes.number,
    offset: PropTypes.number,
  }),
  onFetchData: PropTypes.func.isRequired,
  closeMealDetailModal: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  total: PropTypes.number
};

export default MealsTable;
