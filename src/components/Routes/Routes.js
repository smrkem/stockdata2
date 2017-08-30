import React from 'react'
import {
  Route,
  Switch
} from 'react-router-dom'

import Home from '../Home/Home'
import About from '../About/About'
import PostView from '../PostView/PostView'
import NotFound from '../NotFound/NotFound'

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Home}/>
    <Route path="/about" component={About}/>
    <Route path="/posts/:slug" component={PostView}/>
    <Route component={NotFound}/>
  </Switch>
)

export default Routes
