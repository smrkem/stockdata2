import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'

import Routes from './Routes'
import Home from '../Home/Home'
import About from '../About/About'
import PostView from '../PostView/PostView'
import NotFound from '../NotFound/NotFound'

test("should render the Home component when visiting /", () => {
  let routes = {
    "/": Home,
    "/about": About,
    "/posts/sample-post-1": PostView,
    "/posts/invalid-slug": NotFound
  }

  for (var key in routes) {
    const component = mount(
      <MemoryRouter initialEntries={[key]} initialIndex={0} >
        <Routes />
      </MemoryRouter>
    )

    expect(component.find(routes[key]).length).toBe(1)
  }

})
