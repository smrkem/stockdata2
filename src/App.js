import React from 'react'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'

import styles from './app.css'
import Header from './components/Header/Header'
import About from './components/About/About'
import PostSummary from './components/PostSummary/PostSummary'

const App = () => (
  <Router>
    <div>
      <Header />
      <Route path="/about" component={About}/>
    </div>
  </Router>
)

export default App
