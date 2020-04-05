/* eslint import/no-extraneous-dependencies: off */
import { expect } from "chai";
import { userLoginValidator, userSignupValidator } from "../../../src/middleware/joi";

import { userFactory } from "../../../testHelpers/appHelper";

context("userSchemas validation", () => {

  const { id, ...validatedUserData } = userFactory({
    password: "abc123",
  });

  const userData = {
    ...validatedUserData,
    confirmPassword: "abc123",
    email: validatedUserData.email.toUpperCase(),
    extraKey: "yes"
  };

  const test = [
    {
      message: 'no firstName',
      get user(){
        const {firstName, ...rest} = userData
        return rest
      }
    },
    {
      message: 'no email',
      get user(){
        const {email, ...rest} = userData
        return rest
      }
    },
    {
      message: 'passwords not matching',
      get user(){
        return {...userData, password: 'wrong'}
      }
    },
  ];
  
  test.forEach(elem => {
    it(`fails test because ${elem.message}`, () => {
      
      userSignupValidator({ body: elem.user }, {}, err => {
        expect(err.error.name).to.equal("ValidationError");
      });
    });
  });

  it("login succeeds with correct input", () => {
    const req = { body: userData };
    const {email, password} = validatedUserData
    userLoginValidator(req, {}, () => "done");
    expect(req.body).to.deep.equal({email, password});
  });

  it("signup succeeds with correct input", () => {
    const req = { body: userData };
    userSignupValidator(req, {}, () => "done");
    expect(req.body).to.deep.equal(validatedUserData);
  });
});
