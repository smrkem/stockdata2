import React from 'react'
import PostSummary from '../PostSummary/PostSummary'

import posts from '../../posts.json'

const Home = () => (
  <div className="container">
    {posts.map(post => (
      <PostSummary key={post.slug} {...post} />
    ))}
  </div>
)

export default Home
