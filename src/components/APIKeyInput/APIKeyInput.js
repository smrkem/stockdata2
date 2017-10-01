import React from 'react'
import './APIKeyInput.css'

const APIKeyInput = (props) => (
  <div className="api-key-input">
    <strong>API Key: </strong>
    <input
      onChange={e => props.onApiKeyChange(e.target.value)} value={props.apiKey}
    />
  </div>
)

export default APIKeyInput
