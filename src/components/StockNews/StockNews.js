import React from 'react'
import Results from '../Results/Results'
import CompanyNameInput from '../CompanyNameInput/CompanyNameInput'

class StockNews extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      query: false
    }
  }

  onChangeQuery(query) {
    console.log("changing query with: " + query)
    this.setState({query})
  }

  render() {
    return (
      <div className="container" id="stocknews-container">
        <CompanyNameInput setQuery={this.onChangeQuery} />
        <Results />
      </div>
    )
  }
}

export default StockNews
