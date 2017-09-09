import React from 'react'
import './Results.css'

import ResultItem from '../ResultItem/ResultItem'

class Results extends React.Component {

  constructor(props) {
    super(props)
    this.state = { items: false }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.postResponse) {
      // items have been submitted

    }
    else if (nextProps.output) {
      let items = nextProps.output.map(item => {
        item.category = 'uncategorized'
        return item
      })
      this.setState({items})
    }
  }

  onSetItemCategory(item, cat) {
    let index = this.state.items.findIndex(match => match.link == item.link)
    let items = this.state.items
    if (items[index].category == cat) {
      items[index].category = 'uncategorized'
    } else {
      items[index].category = cat
    }

    this.setState({ items })
  }

  onSubmitResults() {
    this.props.postItems(this.state.items)
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
    if (this.props.query.length && this.state.items) {
      heading = `Results for "${this.props.query}":`
      let items = this.state.items.map((item, i) => (
        <ResultItem
          item={item}
          key={i}
          setItemCategory={(item, cat) => this.onSetItemCategory(item, cat)}
          />
      ))

      let apiInfo = <div className="api-info">
        <button onClick={() => this.onSubmitResults() }>Submit Results</button>
      </div>
      if (this.props.postResponse) {
        let response = this.props.postResponse
        apiInfo = <div className="api-info">
          <h3>{ response.message }</h3>
          <p>
            <span className="results-label">Total Urls: </span>
            <span className="results-value">{response.post_urls}</span>
            <span className="results-label">Spam Posts: </span>
            <span className="results-value">{response.spam_posts}</span>
            <span className="results-label">Good Posts: </span>
            <span className="results-value">{response.good_posts}</span>
          </p>
        </div>
      }
      content = <div>
        { apiInfo }
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
