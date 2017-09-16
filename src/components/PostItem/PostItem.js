import React from 'react'
import './PostItem.css'

const PostItem = (props) => {
  console.log("postItem:", props)
  return(
    <div className="post-item">
      <p>
        <strong>Date: </strong>
        <span>{ props.published }</span>
        <br />
        <strong>Link: </strong>
        <span>
          <a href={props.link} target='_blank'>{ props.link }</a>
        </span>
      </p>
    </div>
  )
}

export default PostItem
