import React from 'react'
import './Results.css'
import PostItem from '../PostItem/PostItem'

const SubmitControls = ({onPostItems}) => (
    <div className="submit-controls">
      <button onClick={onPostItems}>
          Submit Results
      </button>
    </div>
)

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
  let submitControls = ""

  if (props.query && props.isFetching) {
    heading = `Fetching results for ${props.query} ... ${props.timer}s`
  }
  else if (props.query && props.isShowingResults) {
    heading = `Showing ${props.postItems.length} results for ${props.query}`
    contents = props.postItems.map(
      (item, i) => <PostItem key={i} {...item} setPostCategory={props.setPostCategory} />
    )
    submitControls = <SubmitControls onPostItems={props.onPostItems} />
  }
  else if (props.query && props.submittedResults) {
    heading = `Submitted results for ${props.query}`
  }

  return (
    <div id="stocknews-results">
      <h3>{ heading }</h3>
      { submitControls }
      <div>{ contents }</div>
      { submitControls }
    </div>
  )
}
export default Results
