import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import styles from './app.css'
import Header from './components/Header/Header'
import Home from './components/Home/Home'
import About from './components/About/About'
import PostView from './components/PostView/PostView'
import NotFound from './components/NotFound/NotFound'

const App = () => (
  <Router>
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
        <Route path="/posts/:slug" component={PostView}/>
        <Route component={NotFound}/>
      </Switch>
    </div>
  </Router>
)

export default App
