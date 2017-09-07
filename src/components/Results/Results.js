import React from 'react'
import './Results.css'

import ResultItem from '../ResultItem/ResultItem'

class Results extends React.Component {

  constructor(props) {
    super(props)
    this.state = { items: false }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.output) {
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
      content = <div>
        <button onClick={() => this.onSubmitResults() }>Submit Results</button>
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
