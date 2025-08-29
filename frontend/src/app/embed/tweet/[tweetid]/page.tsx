"use client"
import { useParams } from 'next/navigation';
import React from 'react'

const EmbedTweet = () => {
    const { tweetid } = useParams();
  return (
    <div className='text-white'>
      <h1>Tweet</h1>
      <p>{tweetid}</p>
    </div>
  )
}

export default EmbedTweet
