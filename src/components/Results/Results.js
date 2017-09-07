import React from 'react'
import './Results.css'

class Results extends React.Component {

  render() {
    let heading = "No query yet ..."
    if (this.props.query.length) {
      heading = this.props.output ? `Results for "${this.props.query}":` : `Fetching results for "${this.props.query}" ... ${this.props.timer}s`
    }

    let content = this.props.output ? this.props.output.map((item, i) => (
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
    )
  }

}

export default Results
