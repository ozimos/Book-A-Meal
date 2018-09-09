/* eslint import/no-extraneous-dependencies: off */

import {
  expect
} from 'chai';
import td from 'testdouble';
import Controller from '../../../src/controllers/Controller.js';

let Table, controller;
describe('Controllers', () => {

  beforeEach('Stub Database', () => {
    Table = td.object();
    controller = new Controller(Table);
  });

  afterEach('Remove Stubbing', () => td.reset());

  describe('getAllRecords()', () => {
    const query = { limit: 8, offset: 0 };

    it(
      'should return a list of rows if data is returned from database',
      () => {
        const expectedResponse = [
          {
            id: 1,
            title: 'Beef with Rice',
            description: 'plain rice with ground beef',
            price: 1500,
          },
          {
            id: 2,
            title: 'Beef with Fries',
            description: 'beef slab with fried potato slivers',
            price: 2000,
          }
        ];
        const scope = 'string';
        const req = { query };
        td.when(Table.scope(scope)).thenReturn(Table);
        td.when(Table.findAndCountAll(td.matchers.anything()))
          .thenResolve({ count: 1, rows: expectedResponse });

        return controller.getAllRecords(req, scope)
          .then(response => expect(response.data.rows)
            .to.eql(expectedResponse));
      }
    );

    it(
      'should return an error message if error occurs when accessing database',
      () => {
        const error = {
          message: 'database error'
        };
        const scope = 'string';
        const req = { query };
        td.when(Table.scope(scope)).thenReturn(Table);
        td.when(Table.findAndCountAll(td.matchers.anything()))
          .thenReject(error);
        return controller.getAllRecords(req, scope)
          .catch(response => expect(response.message).to.equal(error.message));
      }
    );
  });

  describe('getSingleRecord()', () => {

    const req = {
      params: {
        id: 'c848bf5c-27ab-4882-9e43-ffe178c82602'
      }
    };

    it('should return a row if data is returned from database', () => {
      const expectedResponse = {
        id: req.params.id,
        title: 'Beef with Fries',
        description: 'beef slab with fried potato slivers',
        price: 2000,
      };

      td.when(Table.findById(req.params.id)).thenResolve(expectedResponse);


      return controller.getSingleRecord(req)
        .then(response => expect(response.data).to.eql(expectedResponse));
    });

    it('should return an error message if no data in database', () => {
      const expectedResponse = 'no records available';

      td.when(Table.findById(req.params.id)).thenResolve(null);
      return controller.getSingleRecord(req)
        .then(response => expect(response.message).to.equal(expectedResponse));
    });

    it(
      'should return an error message if error occurs when accessing database',
      () => {
        const error = {
          message: 'database error'
        };
        td.when(Table.findById(req.params.id)).thenReject(error);
        return controller.getSingleRecord(req)
          .catch(response => expect(response.message).to.equal(error.message));
      }
    );
  });

  describe('postRecord()', () => {

    it('should create a row', () => {
      const req = {
        body: {
          title: 'Beef with Fries',
          description: 'beef slab with fried potato slivers',
          price: 2000,
        }
      };
      const returnValue = {
        body: {
          id: 'c848bf5c-27ab-4882-9e43-ffe178c82602',
          title: 'Beef with Fries',
          description: 'beef slab with fried potato slivers',
          price: 2000,
        }
      };
      td.when(Table.create(req.body)).thenResolve(returnValue.body);
      return controller.postRecord(req)
        .then((response) => {
          expect(response.statusCode).to.equal(201);
          expect(response.data).to.eql(returnValue.body);
        });
    });

    it(
      'should return an error message if error occurs when accessing database',
      () => {
        const req = {
          body: 'wrong input',
        };
        const error = {
          message: 'database error'
        };
        td.when(Table.create(req.body)).thenReject(error);
        return controller.postRecord(req)
          .catch(response => expect(response.message).to.equal(error.message));
      }
    );
  });

  describe('updateRecord()', () => {

    const req = {
      body: {
        id: 'c848bf5c-27ab-4882-9e43-ffe178c82602',
        title: 'Beef with Fries',
        description: 'beef slab with fried potato slivers',
        price: 2000,
      },
      params: {
        id: 'c848bf5c-27ab-4882-9e43-ffe178c82602'
      }
    };

    it('should update a row', () => {
      td.when(Table.update(req.body, {
        where: {
          id: req.params.id
        },
        returning: true
      })).thenResolve([1, [req.body]]);

      return controller.updateRecord(req)
        .then(response =>
          expect(response.data).to.eql(req.body));
    });

    it(
      'should return an error message if error occurs when accessing database',
      () => {
        const error = {
          message: 'database error'
        };
        td.when(Table.update(req.body, {
          where: {
            id: req.params.id
          },
          returning: true
        })).thenReject(error);
        return controller.updateRecord(req)
          .catch(response => expect(response.message).to.equal(error.message));
      }
    );
  });

  describe('deleteRecord()', () => {
    const req = {
      params: {
        id: 'c848bf5c-27ab-4882-9e43-ffe178c82602'
      }
    };

    it('should delete a row', () => {
      const req = {
        params: {
          id: 'c848bf5c-27ab-4882-9e43-ffe178c82602'
        }
      };
      const result = 1;
      td.when(Table.destroy({
        where: {
          id: req.params.id,
          deletedAt: new Date('2100')
        },
      })).thenResolve(result);
      return controller.deleteRecord(req)
        .then(response =>
          expect(response.data).to.equal(result));
    });

    it(
      'should return an error message if error occurs when accessing database',
      () => {
        const error = {
          message: 'database error'
        };
        td.when(Table.destroy({
          where: {
            id: req.params.id,
            deletedAt: new Date('2100')
          },
        })).thenReject(error);
        return controller.deleteRecord(req)
          .catch(response => expect(response.message).to.equal(error.message));
      }
    );
  });
});
