import React from 'react'
import Results from '../Results/Results'
import CompanyNameInput from '../CompanyNameInput/CompanyNameInput'
import CurrentMeta from '../CurrentMeta/CurrentMeta'
import APIKeyInput from '../APIKeyInput/APIKeyInput'

class StockNews extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      apiKey: "",
      query: false,
      isFetching: false,
      isShowingResults: false,
      submittedResults: false,
      errorState: false,
      timer: 0,
      postItems: [],
      meta: {
        current_good_posts: 'x',
        current_spam_posts: 'x',
        total_urls: 'x'
      }
    }
    this.apiUrl = 'https://1kddb733mf.execute-api.us-east-1.amazonaws.com/dev'
    this.timer = null
  }

  onApiKeyChange(newval) {
    this.setState({
      apiKey: newval
    })
  }

  onSetPostCategory(link, cat) {
    let index = this.state.postItems.findIndex(match => match.link == link)
    let postItems = this.state.postItems
    if (postItems[index].category == cat) {
      postItems[index].category = 'uncategorized'
    }
    else {
      postItems[index].category = cat
    }

    this.setState({ postItems })
  }

  onNewQuery(query) {
    this.setState({
      query: query,
      isFetching: false,
      isShowingResults: false,
      errorState: false,
      submittedResults: false,
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

  onPostItems(data) {
    fetch(this.apiUrl + '/stocknews-items', {
      method: 'post',
      headers: {
      "X-API-KEY": this.state.apiKey
    },
      body: JSON.stringify(this.state.postItems),
      mode: 'cors'
    })
      .then(d => d.json())
      .then(d => {
        console.log('got response', d)
        this.setState({
          meta: d.meta,
          isFetching: false,
          isShowingResults: false,
          submittedResults: true
        })
      })
  }

  render() {
    let apiKeyInput = ""
    if (this.state.errorState) {
      apiKeyInput = <APIKeyInput
        onApiKeyChange={(newVal) => this.onApiKeyChange(newVal) }
        apiKey={this.state.apiKey}
      />
    }
    return (
      <div className="container" id="stocknews-container">
        <CompanyNameInput setQuery={(q) => this.onNewQuery(q)} />
        { apiKeyInput }
        <CurrentMeta meta={this.state.meta} />
        <Results
          {...this.state}
          setPostCategory={(link, cat) => this.onSetPostCategory(link, cat)}
          onPostItems={(posts) => this.onPostItems(posts)}
        />
      </div>
    )
  }

  fetchResults(query) {
    this.setState({isFetching: true})

    let url = this.apiUrl + '/stocknews-items?q=' + query
    fetch(url, {
      headers: {
        "X-API-KEY": this.state.apiKey
      },
      mode: 'cors'
    })
    .then(response => {
      console.log("RESPONSE:", response)
      this.checkRespone(response)
      return response.json()
    })
    .then(data => {
      this.setResults(data)
    })
    .catch((err) => {
      clearInterval(this.timer)
      console.log("IN CATCH:", err)
      console.log("IN CATCH:", typeof err)
      this.setState({ errorState: err.toString() })
    })
  }

  setResults(data) {
    console.log(data)
    clearInterval(this.timer)
    let posts = data.posts.map(item => {
      item.category = 'uncategorized'
      return item
    })
    this.setState({
      isFetching: false,
      isShowingResults: true,
      postItems: posts,
      meta: data.meta
    })
  }

  checkRespone(response) {
    console.log("CHECKING RESPONSE", response)
    // check also for response.status == 200
    if (!response.ok) {
      console.log("Error...")
      throw Error("Api fetch failed :(")
    }
  }
}

export default StockNews
