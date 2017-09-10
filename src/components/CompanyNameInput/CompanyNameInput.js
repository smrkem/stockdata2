import React from 'react'
import './CompanyNameInput.css'

const CompanyNameInput = () => (
  <div id="company-name-input">
    <p>Enter the company name to search for:</p>
    <form onSubmit={(e) => {
        e.preventDefault()
        console.log('submitted')
      }}>
      <p>
        <input type="text"></input>
        <button>GO</button>
      </p>
    </form>
  </div>
)
export default CompanyNameInput
