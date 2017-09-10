import React from 'react'
import './CompanyNameInput.css'

const onFormSubmit = (e, callback) => {
  e.preventDefault()
  let input = e.target.elements[0]
  callback(input.value)

  input.value = null
}

const CompanyNameInput = (props) => (
  <div id="company-name-input">
   <p>Enter the company name to search for:</p>
   <form
     onSubmit={e => onFormSubmit(e, props.setQuery)}
   >
     <p>
       <input type="text"></input>
       <button>GO</button>
     </p>
   </form>
  </div>
)
export default CompanyNameInput
