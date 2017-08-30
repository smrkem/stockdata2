import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import NotFound from './NotFound'

test('NotFound should render ok', () => {
  const component = shallow(<NotFound />)
  const tree = toJson(component)
  expect(tree).toMatchSnapshot()
})
