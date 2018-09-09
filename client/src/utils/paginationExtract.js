const paginationExtract = (res) => {
  const { rows, ...rest } = res;
  return { ...rest };
};
export default paginationExtract;
