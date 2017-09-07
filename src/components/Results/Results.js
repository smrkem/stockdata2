import React from 'react'
import './Results.css'

class Results extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      'query': props.query,
      'spam': [],
      'good': [],
      'discard': []
    }
  }

  render() {
    // Cases:
    // No query yet...
    let heading = "No query yet ..."
    let content = ""

    // Fetching results for
    if (this.props.query.length && !this.props.output) {
      heading = `Fetching results for "${this.props.query}" ... ${this.props.timer}s`
      content = <div className="loading">Loading ...</div>
    }

    // Showing results for
    if (this.props.query.length && this.props.output) {
      heading = `Results for "${this.props.query}":`
      let items = this.props.output.map((item, i) => (
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
      ))
      content = <div>
        <button>Submit Results</button>
        <hr />
        { items }
      </div>
    }

    return (
      <div className="results">
        <h2>{ heading }</h2>
        <hr />
        <div>{ content }</div>
      </div>
    )
  }

}

export default Results
