**ToC**
1. [Local setup (npm and webpack)](https://github.com/smrkem/stockdata2/blob/master/docs/local-setup.md)
2. [Initial React app and skeleton](https://github.com/smrkem/stockdata2/blob/master/docs/initial-react-app.md)
3. [Making the initial query](https://github.com/smrkem/stockdata2/blob/master/docs/making-initial-query.md)
4. [Building the API and first Lambda]
5. [Displaying Results]  

***  

# Making the initial query  

The CompanyNameInput component is pretty straightforward.  
```
import React from 'react'
import './CompanyNameInput.css'

const CompanyNameInput = () => (
  <div id="company-name-input">
    <p>Enter the company name to search for:</p>
    <p>
      <input type="text"></input>
      <button>GO</button>
    </p>
  </div>
)
export default CompanyNameInput
```  

We want the user to input some text and then click "GO" (or hit enter) and then we do something useful with the current value.

First, let's see if simply using a form will get us the 'enter' key for free.  
```
@@ -4,10 +4,15 @@ import './CompanyNameInput.css'
  const CompanyNameInput = () => (
    <div id="company-name-input">
      <p>Enter the company name to search for:</p>
 -    <p>
 -      <input type="text"></input>
 -      <button>GO</button>
 -    </p>
 +    <form onSubmit={(e) => {
 +        e.preventDefault()
 +        console.log('submitted')
 +      }}>
 +      <p>
 +        <input type="text"></input>
 +        <button>GO</button>
 +      </p>
 +    </form>
    </div>
  )
  export default CompanyNameInput
```  
yup :)

On every user submit, we want to do something with the input's value - so we need to be able to access that element. React seems to have 2 ways of accomplishing that:  
- keeping an internal state and using that state on submit  
- adding a ref to the input and accessing the element on submit  

I'm going to try the ref method and see where that gets me. Either way, it'll mean upgrading the CompanyNameInput to a proper React Component.
