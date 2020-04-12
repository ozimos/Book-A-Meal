/* global React:false, shallow:false toJson:false */

import { Nav } from '../../src/components/nav/ConnectedNav';

const props = {
  user: { isCaterer: true },
  authenticated: true,
  dispatch: jest.fn()
};

const propsCustomer = {
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

    const propsUnAuthenticated = {
      user: { isCaterer: false },
      authenticated: false,
      dispatch: jest.fn()
    };
    const wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();

    const wrapperCustomer = shallow(<Nav {...propsCustomer} />);
    expect(toJson(wrapperCustomer)).toMatchSnapshot();

    const wrapperUnAuthenticated = shallow(<Nav {...propsUnAuthenticated} />);
    expect(toJson(wrapperUnAuthenticated)).toMatchSnapshot();

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

