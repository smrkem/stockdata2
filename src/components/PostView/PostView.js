import React from 'react'
import posts from '../../posts.json'
import NotFound from '../NotFound/NotFound'
import './PostView.css'

const PostView = ({match}) => {
  let slug = match.params.slug
  let post = posts.filter(post => post.slug === slug)[0]
  if (typeof post == 'undefined') {
    return <NotFound />
  }

  return (
    <div className="container post-view">
      <h2>{ post.title }</h2>
      <div className="post-content">
        { post.content.split('\n\n').map((paragraph, i) => (
          <p key={i}>{ paragraph }</p>
        ))}
      </div>
    </div>
  )
}

export default PostView
