import React from 'react'
import Tweet from './Tweet'

const Tweets = () => {
    const fakeArray = [1, 2, 3, 4, 5, 6]
  return (
    <div className='px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 '>
      {fakeArray.map((item, i) => (
        <Tweet key={i} />
      ))}
    </div>
  )
}

export default Tweets
