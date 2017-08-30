import React from 'react'
import PostSummary from '../PostSummary/PostSummary'

import posts from '../../posts.json'
// console.log(posts)

const Home = () => (
  <div className="container">
    {posts.map(post => (
      <PostSummary key={post.slug} {...post} />
    ))}
  </div>
)

export default Home
