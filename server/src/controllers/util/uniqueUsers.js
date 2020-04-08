export default (rows) => {
  const id = rows.map(row => row.userId);

  return new Set(id).size;
};

