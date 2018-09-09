/* eslint import/no-extraneous-dependencies: off */
import {
  assert
} from 'chai';
import orderSchemas from '../../../src/middleware/orderSchemas';

context('Validation with Joi schemas', () => {

  // sample request body data
  const order = {
    meals: [{
      id: '20a0dcc4-0a78-43f6-881b-884dd6f32861',
      quantity: 1
    },
    {
      id: '20a0dcc4-0a78-43f6-881b-884dd6f32861',
      quantity: 2
    }
    ]
  };

  describe('for POST and PUT requests on /api/v1/orders, validation', () => {

    it(
      'throws error when some required fields are not in request body',
      () => {
        const modified = {
          meals: [{
            quantity: 1
          },
          {
            id: '20a0dcc4-0a78-43f6-881b-884dd6f32861',
            quantity: 2
          }
          ]
        };
        const result = orderSchemas.validate(modified);

        assert.notEqual(result.error, null, `Joi output: ${result.error}`);
      }
    );

    it('throws error when unknown fields are in request body', () => {
      const modified = {
        meals: [{
          id: '20a0dcc4-0a78-43f6-881b-884dd6f32861',
          quantity: 1,
          volume: 'high'
        },
        {
          id: '20a0dcc4-0a78-43f6-881b-884dd6f32861',
          quantity: 2
        }
        ]
      };
      const result = orderSchemas.validate(modified);

      assert.notEqual(result.error, null, `Joi output: ${result.error}`);
    });

    it(
      'does not throw error when all required fields are in request body',
      () => {
        const result = orderSchemas.validate(order);

        assert.equal(result.error, null, `Joi output: ${result.error}`);
      }
    );

    it(
      'converts strings to number data types in request body for number fields',
      () => {
        const modified = {
          meals: [{
            id: '20a0dcc4-0a78-43f6-881b-884dd6f32861',
            quantity: '1'
          },
          {
            id: '20a0dcc4-0a78-43f6-881b-884dd6f32861',
            quantity: 2
          }
          ]
        };
        // Make quantity a string
        const result = orderSchemas.validate(modified);

        assert.equal(result.error, null, `Joi output: ${result.error}`);
        assert.deepEqual(result.value, order, `Joi output: ${result.error}`);
      }
    );
  });

});
