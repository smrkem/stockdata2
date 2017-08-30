import React from 'react'
import { Link } from 'react-router-dom'

import './PostSummary.css'

const PostSummary = (props) => (
  <div className="post-summary">
    <h2>
      <Link to={`posts/${props.slug}`}>
        { props.title }
      </Link>
    </h2>
    <div className="post-excerpt">
      { props.excerpt }
    </div>
  </div>
)

export default PostSummary
