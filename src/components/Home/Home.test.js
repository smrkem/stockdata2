import React from 'react'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import Home from './Home'

test('Home should render ok', () => {
  const component = shallow(<Home />)
  const tree = toJson(component)
  expect(tree).toMatchSnapshot()
})
