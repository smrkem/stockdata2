import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import PostSummary from './PostSummary'

import post from './sample-post.json'

test('PostSummary should render ok', () => {
  const component = shallow(<PostSummary {...post} />)
  const tree = toJson(component)
  expect(tree).toMatchSnapshot()
})
