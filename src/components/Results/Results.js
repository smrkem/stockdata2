import React from 'react'
import './Results.css'

const Results = (props) => {
  if (props.errorState) {
    console.log(props.errorState)
    return (
      <div id="stocknews-results">
        <h3>API Error :(</h3>
        <div><pre>{ props.errorState }</pre></div>
      </div>
    )
  }

  let heading = "No query"
  if (props.query && props.isFetching) {
    heading = `Fetching results for ${props.query} ...`
  }
  if (props.query && props.isShowingResults) {
    heading = `Showing results for ${props.query}`
  }


  return (
    <div id="stocknews-results">
      <h3>{ heading }</h3>
    </div>
  )
}
export default Results
