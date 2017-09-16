import React from 'react'
import './PostItem.css'

const PostItem = (props) => {
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

      <div className={ `item-cat cat-${props.category}` }>
        <div className="cat-label">{ props.category }</div>
        <div className="cat-actions">
          <button className="spam-button"
            onClick={() => props.setPostCategory(props.link, "spam") }>
              SPAM
          </button>
          <button className="good-button"
            onClick={() => props.setPostCategory(props.link, "good") }>
              GOOD
          </button>
          <button className="trash-button"
            onClick={() => props.setPostCategory(props.link, "trash") }>
              DISCARD
          </button>
        </div>
      </div>

      <div className={(props.category != 'uncategorized' ? 'collapsed ':'') + "post-contents"}>
        <h4 className="post-title">{ props.title }</h4>
        { props.contents.map((p,i) => <p key={i}>{p}</p>) }
      </div>
    </div>
  )
}

export default PostItem
