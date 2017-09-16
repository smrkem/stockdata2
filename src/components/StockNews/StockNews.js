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
      errorState: false,
      timer: 0,
      postItems: []
    }
    this.apiUrl = 'https://1kddb733mf.execute-api.us-east-1.amazonaws.com/dev'
    this.timer = null
  }

  onNewQuery(query) {
    this.setState({
      query: query,
      isFetching: false,
      isShowingResults: false,
      errorState: false,
      timer: 0,
      postItems: []
    })

    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.setState({timer: this.state.timer + 1})
    }, 1000)

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

    let url = this.apiUrl + '/stocknews-items?q=' + query
    fetch(url, {
      mode: 'cors'
    })
    .then(response => {
      this.checkRespone(response)
      return response.json()
    })
    .then(data => {
      this.setResults(data)
    })
    .catch(err => {
      clearInterval(this.timer)
      this.setState({ errorState: err.toString() })
    })
  }

  setResults(data) {
    clearInterval(this.timer)
    let posts = data.posts.map(item => {
      item.category = 'uncategorized'
      return item
    })
    this.setState({
      isFetching: false,
      isShowingResults: true,
      postItems: posts
    })
  }

  checkRespone(response) {
    // check also for response.status == 200
    if (!response.ok) {
      console.log("Error...")
      throw Error("Api fetch failed :(")
    }
  }
}

export default StockNews
