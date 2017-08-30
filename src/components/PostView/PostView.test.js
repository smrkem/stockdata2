import React from 'react'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import PostView from './PostView'
import NotFound from '../NotFound/NotFound'

test('PostView should render ok', () => {
  const match = {
    params: {
      slug: "sample-post-1"
    }
  }
  const component = shallow(<PostView match={match} />)
  const tree = toJson(component)
  expect(tree).toMatchSnapshot()
})

test('PostView should return NotFound with invalid slug', () => {
  const match = {
    params: {
      slug: "invalid-slug"
    }
  }
  const component = mount(<PostView match={match} />)
  expect(component.find(NotFound).length).toBe(1)
})
