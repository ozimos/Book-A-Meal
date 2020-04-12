/* global React:false, shallow:false toJson:false */

import ProgressLoader from '../../src/components/helpers/ProgressLoader';

const props = {
  upload: 10
};
describe('Progress Loader', () => {

  const setup = () => shallow(<ProgressLoader {...props} />);

  it('renders correctly', () => {
    const wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
