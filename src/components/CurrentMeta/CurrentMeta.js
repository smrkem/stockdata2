import React from 'react'
import './CurrentMeta.css'

const CurrentMeta = ({meta}) => (
    <div className="current-meta">
      <div>
        <strong>Current Good:</strong>
        <span>{ meta.current_good_posts }</span>
      </div>
      <div>
        <strong>Current Spam:</strong>
        <span>{ meta.current_spam_posts }</span>
      </div>
      <div>
        <strong>Total Urls:</strong>
        <span>{ meta.total_urls }</span>
      </div>
    </div>
)

export default CurrentMeta
