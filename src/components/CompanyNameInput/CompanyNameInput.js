import React from 'react'
import './CompanyNameInput.css'

class CompanyNameInput extends React.Component {
  goClick() {
    console.log('clicked')
    console.log(this.refs.companyName.value)
    this.props.newQuery(this.refs.companyName.value)
  }

  companyNameInputKeyUp(ev) {
    if (ev.key == 'Enter') {
      console.log("ENTER!!!!")
      this.props.newQuery(this.refs.companyName.value)
    }
  }

  render() {
    return (
      <div id="company-name-input">
        <p>Enter the company name to search for:</p>
        <input type="text" ref="companyName" onKeyUp={e => this.companyNameInputKeyUp(e) }></input>
        <button onClick={() => this.goClick()} >GO</button>
      </div>
    )
  }
}

export default CompanyNameInput
