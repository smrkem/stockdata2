import React from 'react'
import './Results.css'

const Results = (props) => {
  let heading = "No query yet ..."
  if (props.query.length) {
    heading = props.output ? `Results for "${props.query}":` : `Fetching results for "${props.query}" ... ${props.timer}s`
  }

  let content = props.output ? props.output.map((item, i) => (
    <div
      data-item={ JSON.stringify(item) }
      key={i}
      >
      <p>
        <strong>Date: </strong><span>{ item.published }</span>
        <br />
        <strong>Link: </strong><span><a href={ item.link } target='_blank'>{ item.link}</a></span>
      </p>
      <hr />
      <div className="post-contents">
        <h4 className="post-title">{ item.contents.title }</h4>
        { item.contents.paragraphs.map( (par, i) => <p key={`inner-${i}`}>{ par }</p>) }
      </div>
    </div>
  )) : <div className="loading">Loading ...</div>

  return (
    <div className="results">
      <h2>{ heading }</h2>
      <hr />
      <button>Submit Results</button>
      <hr />
      <div>{ content }</div>
    </div>
)}

export default Results
