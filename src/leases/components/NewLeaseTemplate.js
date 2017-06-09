export default ({preparer, ...rest}) => ({
  state: 'draft',
  preparer,
  ...rest,
});
