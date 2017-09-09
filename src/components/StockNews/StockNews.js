import React from 'react'
import './StockNews.css'
import CompanyNameInput from '../CompanyNameInput/CompanyNameInput'
import Results from '../Results/Results'

const apiUrl = "https://rdvc0wgvl1.execute-api.us-east-1.amazonaws.com/dev"
let timer

class StockNews extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      query: "",
      timer: 0,
      output: false,
      outputQuery: "",
      postResponse: false
    }
  }

  onPostItems(data) {
    fetch(apiUrl + '/stock-news-items', {
      method: 'post',
      body: JSON.stringify(data),
      mode: 'cors'
    })
      .then(d => d.json())
      .then(d => {
        console.log(d)
        this.setState({postResponse: d})
      })
  }

  onNewQuery(query) {
    clearInterval(timer)
    this.setState({
      query: query,
      outputQuery: false,
      output: false,
      timer: 0
    })

    // update timer
    timer = setInterval(() => {
      this.setState({
        timer: this.state.timer + 1
      })
    }, 1000)

    // query for new data at this point
    fetch(apiUrl + '/stock-news-items?q=' + query, { mode: 'cors' })
      .then(d => d.json())
      .then(d => {
        clearInterval(timer)
        this.setState({
          query: "",
          outputQuery: query,
          output: d
        })
      })
  }

  render() {
    return (
      <div className="container" id="stocknews-container">
        <CompanyNameInput newQuery={(val) => this.onNewQuery(val)} />
        <Results
          query={this.state.query}
          output={this.state.output}
          outputQuery={this.state.outputQuery}
          timer={this.state.timer}
          postResponse={this.state.postResponse}
          postItems={d => this.onPostItems(d)}
          />
      </div>
    )
  }
}

export default StockNews
