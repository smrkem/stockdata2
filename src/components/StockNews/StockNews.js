import React from 'react'
import Results from '../Results/Results'
import CompanyNameInput from '../CompanyNameInput/CompanyNameInput'

class StockNews extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      query: false,
      isFetching: false,
      isShowingResults: false,
      errorState: false
    }
  }

  onNewQuery(query) {
    this.setState({
      query: query,
      isFetching: false,
      isShowingResults: false,
      errorState: false
    })

    // Fetch results from API
    this.fetchResults(query)
  }

  render() {
    return (
      <div className="container" id="stocknews-container">
        <CompanyNameInput setQuery={(q) => this.onNewQuery(q)} />
        <Results {...this.state} />
      </div>
    )
  }

  fetchResults(query) {
    this.setState({isFetching: true})

    const apiUrl = 'http://not-valid-api/fj9edk90'
    fetch(apiUrl, {
      mode: 'cors'
    })
    .then(response => {
      this.checkRespone(response)
    })
    .then(data => {
      // Pass data to results (make own function)
      this.setState({
        isFetching: false,
        isShowingResults: true
      })
    })
    .catch(err => {
      this.setState({ errorState: err.toString() })
    })
  }

  checkRespone(response) {
    console.log("got response", response)
    // check also for response.status == 200
    if (!response.ok) {
      console.log("Error...")
      throw Error("Api fetch failed :(")
    }
    return response.json()
  }
}

export default StockNews
