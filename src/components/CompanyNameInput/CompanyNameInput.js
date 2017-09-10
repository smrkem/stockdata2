import React from 'react'
import './CompanyNameInput.css'

class CompanyNameInput extends React.Component {

  onFormSubmit(e) {
    e.preventDefault()
    let input = e.target.elements[0]
    console.log(`Doing something with: ${input.value}`)
    // Do something ...
    input.value = null
  }

  render() {
    return (
     <div id="company-name-input">
       <p>Enter the company name to search for:</p>
       <form
         onSubmit={(e) => {this.onFormSubmit(e)}}
       >
         <p>
           <input type="text"></input>
           <button>GO</button>
         </p>
       </form>
     </div>
   )
  }
}

export default CompanyNameInput
