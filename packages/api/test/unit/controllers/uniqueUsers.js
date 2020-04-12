/* eslint import/no-extraneous-dependencies: off */

import {
  expect
} from 'chai';
import {uniqueUsers} from '../../../src/controllers/OrderController';

const sampleOrder = [
  {
    id: 'f2e1da5f-d52c-4434-bd2f-39fc62beaec4',
    createdAt: '2018-06-12T12:41:30.652Z',
    updatedAt: '2018-06-12T12:41:30.652Z',
    userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
    Meals: []
  },
  {
    id: 'f2e1da5f-d52c-4434-bd2f-39fc62beaec4',
    createdAt: '2018-06-12T12:41:30.652Z',
    updatedAt: '2018-06-12T12:41:30.652Z',
    userId: 'b7f4b44a-052a-457c-8422-327e106ddbed',
    Meals: []
  },
  {
    id: 'f2e1da5f-d52c-4434-bd2f-39fc62beaec4',
    createdAt: '2018-06-12T12:41:30.652Z',
    updatedAt: '2018-06-12T12:41:30.652Z',
    userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
    Meals: []
  },
  {
    id: 'f2e1da5f-d52c-4434-bd2f-39fc62beaec4',
    createdAt: '2018-06-12T12:41:30.652Z',
    updatedAt: '2018-06-12T12:41:30.652Z',
    userId: '2c7ba6d8-643b-4e0e-a182-c7edfab6fc0d',
    Meals: []
  },
  {
    id: 'f2e1da5f-d52c-4434-bd2f-39fc62beaec4',
    createdAt: '2018-06-12T12:41:30.652Z',
    updatedAt: '2018-06-12T12:41:30.652Z',
    userId: 'db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b',
    Meals: []
  },
  {
    id: 'f2e1da5f-d52c-4434-bd2f-39fc62beaec4',
    createdAt: '2018-06-12T12:41:30.652Z',
    updatedAt: '2018-06-12T12:41:30.652Z',
    userId: '2c7ba6d8-643b-4e0e-a182-c7edfab6fc0d',
    Meals: []
  }
];
describe('uniqueUsers', () => {
  it('should return how many unique ids in order', () => {
    expect(uniqueUsers(sampleOrder)).to.equal(3);
  });
});
