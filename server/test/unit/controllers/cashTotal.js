/* eslint import/no-extraneous-dependencies: off */

import {
  expect
} from 'chai';
import cashTotal, { subTotal } from '../../../src/controllers/util/cashTotal';

const sampleOrders = [
  {
    id: 'b7f4b44a-052a-457c-8422-327e106ddbed',
    userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
    Meals: [
      {
        dataValues: {
          subTotal: 7500
        }
      },
      {
        dataValues: {
          subTotal: 5000
        }
      }
    ]
  },
  {
    id: 'b8c05c01-7ed0-45eb-b3b4-e9ff52ffe17c',
    userId: 'db5e4fa9-d4df-4352-a2e4-d13c0b0cb967',
    Meals: [
      {
        dataValues: {
          subTotal: 7500
        }
      },
      {
        dataValues: {
          subTotal: 5000
        }
      }
    ]
  }
];

describe('CashTotal', () => {

  it('should return the total cash for all orders', () => {
    expect(cashTotal(sampleOrders)).to.equal(25000);
  });

  it('should return the 0 for no argument', () => {
    expect(cashTotal()).to.equal(0);
  });

});
describe('subTotal', () => {

  it('should return the total cash for an order', () => {
    expect(subTotal(sampleOrders[0].Meals)).to.equal(12500);
  });

  it('should return the 0 for no argument calls', () => {
    expect(subTotal()).to.equal(0);
  });
});

