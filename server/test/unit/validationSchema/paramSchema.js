/* eslint import/no-extraneous-dependencies: off */
import {
  assert
} from 'chai';
import params from '../../../src/middleware/paramSchema';

context('Validation with Joi schemas', () => {

  describe('for request.params on GET, PUT and DELETE', () => {
    const test = [{
      id: 'add'
    }, {
      id: '3.5'
    }, {
      id: 3.5
    }];
    const item = {
      id: 'c848bf5c-27ab-4882-9e43-ffe178c82602'
    };

    test.forEach((elem) => {
      it(`throws error for non-uuid ${typeof elem.id} parameter: ${elem.id}`, () => {
        const result = params.validate(elem);
        assert.notEqual(result.error, null, `Joi output: ${result.error}`);
      });
    });

    it('does not throw error for uuid string parameter c848bf5c-27ab-4882-9e43-ffe178c82602', () => {
      const result = params.validate(item);
      assert.equal(result.error, null, `Joi output: ${result.error}`);
    });
  });
});