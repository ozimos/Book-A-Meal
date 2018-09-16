/* eslint import/no-extraneous-dependencies: off */

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import httpMocks from 'node-mocks-http';
import td from 'testdouble';
import Controller from '../../../src/controllers/Controller.js';

chai.use(chaiHttp);

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
        td.when(Table.findAndCountAll(td.matchers.contains({
          limit: query.limit,
          offset: query.offset
        })))
          .thenResolve({ count: 1, rows: expectedResponse });

        return controller.getAllRecords(req, scope)
          .then(response => expect(response.data.rows)
            .to.eql(expectedResponse));
      }
    );

    it(
      'should return error message if no records are returned from database',
      () => {
        const expectedResponse = [];
        const scope = 'string';
        const req = { query };
        td.when(Table.scope(scope)).thenReturn(Table);
        td.when(Table.findAndCountAll(td.matchers.contains({
          limit: query.limit,
          offset: query.offset
        })))
          .thenResolve({ count: 1, rows: expectedResponse });

        return controller.getAllRecords(req, scope)
          .then(response => expect(response.message)
            .to.eql('no records available'));
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
        td.when(Table.findAndCountAll(td.matchers.contains({
          limit: query.limit,
          offset: query.offset
        })))
          .thenReject(error);
        return controller.getAllRecords(req, scope)
          .then(response => expect(response.message).to.equal(error.message));
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

      td.when(Table.findById(req.params.id, undefined))
        .thenResolve(expectedResponse);


      return controller.getSingleRecord(req, undefined)
        .then(response => expect(response.data).to.eql(expectedResponse));
    });

    it('should return an error message if no data in database', () => {
      const expectedResponse = 'no records available';

      td.when(Table.findById(req.params.id, undefined)).thenResolve(null);
      return controller.getSingleRecord(req, undefined)
        .then(response => expect(response.message).to.equal(expectedResponse));
    });

    it(
      'should return an error message if error occurs when accessing database',
      () => {
        const error = {
          message: 'database error'
        };
        td.when(Table.findById(req.params.id, undefined)).thenReject(error);
        return controller.getSingleRecord(req, undefined)
          .then(response => expect(response.message).to.equal(error.message));
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
          .then(response => expect(response.message).to.equal(error.message));
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

    it('should return an error message if no rows were updated', () => {
      td.when(Table.update(req.body, {
        where: {
          id: req.params.id
        },
        returning: true
      })).thenResolve([0, [req.body]]);

      return controller.updateRecord(req)
        .then(response =>
          expect(response.message).to.eql('no records available'));
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
          .then(response => expect(response.message).to.equal(error.message));
      }
    );
  });

  describe('deleteRecord()', () => {

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

    const req = {
      params: {
        id: 'c848bf5c-27ab-4882-9e43-ffe178c82602'
      },
    };

    let getAllRecords;
    beforeEach('Stub Controller', () => {
      getAllRecords = td.replace(controller, 'getAllRecords');
      td.when(getAllRecords(req)).thenResolve(expectedResponse);
    });


    it(
      'should return an error message if error occurs when accessing database',
      () => {
        const error = {
          message: 'database error'
        };
        td.when(Table.destroy({
          where: {
            id: req.params.id
          },
        })).thenReject(error);
        return controller.deleteRecord(req)
          .then(response => expect(response.message).to.equal(error.message));
      }
    );

    it(
      'should return an error message if no matching record for delete id',
      () => {
        td.when(Table.destroy({
          where: {
            id: req.params.id
          },
        })).thenResolve(null);
        return controller.deleteRecord(req)
          .then(response => expect(response.message)
            .to.equal('no records available'));
      }
    );

    it(
      'should return the result for `getAllRecords` if a record was deleted',
      () => {
        td.when(Table.destroy({
          where: {
            id: req.params.id
          },
        })).thenResolve(1);
        return controller.deleteRecord(req)
          .then(response => expect(response)
            .to.equal(expectedResponse));
      }
    );
  });

  describe('select', () => {
    const response = {
      statusCode: 200,
      data: {
        user: 'user'
      }
    };
    const req = {
      params: {
        id: 'c848bf5c-27ab-4882-9e43-ffe178c82602'
      },
    
    };
    const res = httpMocks.createResponse();
    // let deleteRecord;
    // beforeEach('Stub Controller', () => {
    //   deleteRecord = td.replace(controller, 'deleteRecord');
    // });

    it('returns a middleware function', () => {
      // td.when(deleteRecord(td.matchers.anything())).thenResolve(response);
      td.when(Table.destroy({
        where: {
          id: req.params.id
        },
      })).thenResolve(null);
      const middleware = Controller.select(controller, 'deleteRecord');
      expect(middleware).to.be.a('function');
      middleware(req, res)
        .then((responseValue) => {
          console.log(responseValue);
          expect(responseValue.message).to.eql('no records available');
          expect(response).to.have.status(404);
        });
      // console.log(td.explain(deleteRecord));
    });
  });
});

