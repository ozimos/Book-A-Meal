/* global React:false, shallow:false toJson:false */

import { Nav } from '../../src/components/nav/ConnectedNav';

const props = {
  user: { isCaterer: true },
  authenticated: true,
  dispatch: jest.fn()
};

const props2 = {
  user: { isCaterer: false },
  authenticated: true,
  dispatch: jest.fn()
};

describe('Nav Component', () => {
  const setup = () => shallow(<Nav {...props} />);

  it('should render without throwing an error', () => {
    const wrapper = setup();

    expect((wrapper)
      .exists(<nav className="flexbox" />)).toBe(true);
  });

  it('renders correctly', () => {

    const props3 = {
      user: { isCaterer: false },
      authenticated: false,
      dispatch: jest.fn()
    };
    const wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();

    const wrapper2 = shallow(<Nav {...props2} />);
    expect(toJson(wrapper2)).toMatchSnapshot();

    const wrapper3 = shallow(<Nav {...props3} />);
    expect(toJson(wrapper3)).toMatchSnapshot();

  });

  it('should call `logoutHandler`', () => {
    const wrapper = setup();
    wrapper.find('button').simulate('click');

    const logoutHandlerSpy = jest.spyOn(
      wrapper.instance(),
      'logoutHandler'
    );
    wrapper.instance().logoutHandler();
    expect(logoutHandlerSpy).toHaveBeenCalled();
  });
});

