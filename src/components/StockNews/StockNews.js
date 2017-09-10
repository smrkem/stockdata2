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
    console.log('in fetch results with: ' + query)
    this.setState({isFetching: true})
    // code to actually fetch the results from the api
    // for now fake it
    window.setTimeout(() => {
      this.setState({ isShowingResults: true })
    }, 2000)
  }

  render() {
    return (
      <div className="container" id="stocknews-container">
        <CompanyNameInput setQuery={(q) => this.onNewQuery(q)} />
        <Results {...this.state} />
      </div>
    )
  }
}

export default StockNews
