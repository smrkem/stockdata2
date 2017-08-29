import React from 'react'
import { Link } from 'react-router-dom'

import './header.css'

const Header = () => (
  <header>
    <div className="container header-container">
      <h1>Matt Smrke</h1>
      <nav>
        <ul>
          <li><Link to='/'>Posts</Link></li>
          <li><Link to='/about'>About</Link></li>
        </ul>
      </nav>
    </div>
  </header>
)

export default Header
