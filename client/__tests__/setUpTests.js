/* eslint import/no-extraneous-dependencies: off */
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';
import localStorageMock from './__mocks__/localStorageMock';

configure({ adapter: new Adapter() });

global.React = React;
global.shallow = shallow;
global.mount = mount;
global.toJson = toJson;
global.rrcMock = new ReactRouterEnzymeContext();

window.localStorage = localStorageMock;
