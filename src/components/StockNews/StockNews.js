import React from 'react'
import Results from '../Results/Results'
import CompanyNameInput from '../CompanyNameInput/CompanyNameInput'

const StockNews = () => (
  <div className="container" id="stocknews-container">
    <CompanyNameInput />
    <Results />
  </div>
)
export default StockNews
