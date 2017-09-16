import React from 'react'
import './Results.css'
import PostItem from '../PostItem/PostItem'

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
  let contents = ""
  if (props.query && props.isFetching) {
    heading = `Fetching results for ${props.query} ... ${props.timer}s`
  }
  if (props.query && props.isShowingResults) {
    heading = `Showing results for ${props.query}`
    contents = props.postItems.map(
      (item, i) => <PostItem key={i} {...item} setPostCategory={props.setPostCategory} />
    )
  }


  return (
    <div id="stocknews-results">
      <h3>{ heading }</h3>
      <div>{ contents }</div>
    </div>
  )
}
export default Results
