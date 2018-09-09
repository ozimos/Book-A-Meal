import jwt from 'jsonwebtoken';

const validateToken = (token) => {
  let valid = true;
  const decoded = jwt.decode(token);

  const { exp, isCaterer, userId, firstName } = decoded;

  if (exp < Math.floor(Date.now() / 1000)) {
    valid = false;
  }

  return { valid, isCaterer, userId, firstName };
};

export default validateToken;
