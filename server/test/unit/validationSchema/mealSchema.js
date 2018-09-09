/* eslint import/no-extraneous-dependencies: off */
import {
  assert
} from 'chai';
import schema from '../../../src/middleware/mealSchemas';

context('Validation with Joi schemas', () => {
  // sample request body data
  const meal = {
    title: 'Spaghetti',
    description: 'very good',
    // eslint-disable-next-line max-len
    imageUrl: 'https://cdn.pixabay.com/photo/2017/11/23/13/50/pumpkin-soup-2972858_960_720.jpg',
    price: 1500,
  };

  describe('for POST requests on /api/v1/meals, validation', () => {

    it('throws error when some required fields are not in request body', () => {
      const modified = { ...meal };
      delete modified.title;
      const result = schema.createMeal.validate(modified);

      assert.notEqual(result.error, null, `Joi output: ${result.error}`);
    });

    it('throws error when unknown fields are in request body', () => {
      const modified = { ...meal };
      modified.volume = 'high';
      const result = schema.createMeal.validate(modified);

      assert.notEqual(result.error, null, `Joi output: ${result.error}`);
    });

    it(
      'does not throw error when all required fields are in request body',
      () => {
        const result = schema.createMeal.validate(meal);

        assert.equal(result.error, null, `Joi output: ${result.error}`);
      }
    );

    it(
      'converts strings to number data types in request body for number fields',
      () => {
        const modified = { ...meal };
        modified.price = '1500'; // Make price a string
        const result = schema.createMeal.validate(modified);

        assert.equal(result.error, null, `Joi output: ${result.error}`);
        assert.deepEqual(result.value, meal, `Joi output: ${result.error}`);
      }
    );
  });

  describe('for PUT requests on /api/v1/meals/:id, validation', () => {

    it(
      'does not throw error when request body is empty',
      () => {
        const result = schema.modifyMeal.validate({});

        assert.equal(result.error, null, `Joi output: ${result.error}`);
      }
    );

    it(
      'does not throw error when not all available fields are in request body',
      () => {
        const modified = { ...meal };
        delete modified.price;
        const result = schema.modifyMeal.validate(modified);

        assert.equal(result.error, null, `Joi output: ${result.error}`);
      }
    );

    it(
      'throws error when unknown fields are in request body',
      () => {
        const modified = { ...meal };
        modified.volume = 'high';
        const result = schema.modifyMeal.validate(modified);

        assert.notEqual(result.error, null, `Joi output: ${result.error}`);
      }
    );

    it(
      'converts strings to number data types in request body for number fields',
      () => {
        const modified = { ...meal };
        modified.price = '1500'; // Make price a string
        const result = schema.modifyMeal.validate(modified);

        assert.equal(result.error, null, `Joi output: ${result.error}`);
        assert.deepEqual(result.value, meal, `Joi output: ${result.error}`);
      }
    );
  });

});
