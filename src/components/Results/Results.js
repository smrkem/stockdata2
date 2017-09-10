import React from 'react'
import './Results.css'

const Results = (props) => {
  if (props.errorState) {
    return (
      <div id="stocknews-results">
        <h3>API Error :(</h3>
        <div><pre>{ props.errorState }</pre></div>
        <p>Could not fetch results for { props.query}</p>
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
