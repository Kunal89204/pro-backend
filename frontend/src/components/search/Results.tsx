import React from 'react'
import Result from './Result'

const Results = () => {
  return (
    <div>
      {Array.from({ length: 10 }).map((_, index) => (
        <Result key={index} />
      ))}
    </div>
  )
}

export default Results
