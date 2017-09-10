import React from 'react'
import Results from '../Results/Results'
import CompanyNameInput from '../CompanyNameInput/CompanyNameInput'

class StockNews extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      query: false,
      isFetching: false,
      isShowingResults: false
    }
  }

  onNewQuery(query) {
    this.setState({
      query: query,
      isFetching: false,
      isShowingResults: false
    })

    // Fetch results from API
    this.fetchResults(query)
  }

  fetchResults(query) {
    this.setState({isfetching: true})
    // code to actually fetch the results from the api
  }

  render() {
    return (
      <div className="container" id="stocknews-container">
        <CompanyNameInput setQuery={(q) => this.onChangeQuery(q)} />
        <Results {...this.state} />
      </div>
    )
  }
}

export default StockNews
