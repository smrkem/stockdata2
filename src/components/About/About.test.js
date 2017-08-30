import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import About from './About'

test('About should be ok', () => {
  const component = shallow(<About />)
  const tree = toJson(component)
  expect(tree).toMatchSnapshot()
})
