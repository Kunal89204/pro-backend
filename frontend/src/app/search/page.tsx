"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { Text } from '@chakra-ui/react'

const Search = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");


  return (
    <div>
      <Text>{query} search page</Text>
    </div>
  )
}

export default Search
