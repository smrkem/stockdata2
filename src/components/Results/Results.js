import React from 'react'
import './Results.css'

const Results = (props) => (
  <div id="stocknews-results">
    { console.log(props) }
    <h3>Results for { props.query }</h3>
  </div>
)
export default Results
