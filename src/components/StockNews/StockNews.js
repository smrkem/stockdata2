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
      output: []
    }
  }

  onNewQuery(query) {
    console.log('Setting new state.', query)
    this.setState({
      query: query,
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
    console.log('making fetch')
    fetch(apiUrl + '/stock-news-items?q=' + query, { mode: 'cors' })
      .then(d => d.json())
      .then(d => {
        console.log(query, d)

        clearInterval(timer)
        this.setState({
          output: d
        })
      })
  }

  render() {
    return (
      <div className="container" id="stocknews-container">
        <CompanyNameInput newQuery={(val) => this.onNewQuery(val)} />
        <Results query={this.state.query} output={this.state.output} timer={this.state.timer}/>
      </div>
    )
  }
}

export default StockNews
