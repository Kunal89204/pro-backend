"use client"
import { useThemeColors } from '@/hooks/useThemeColors'
import { Box, Heading } from '@chakra-ui/react'
import React from 'react'


const Hero:React.FC = () => {
    // Color schemes
    const {textColor} = useThemeColors()
  return (
    <Box m={10}>
      <Heading color={textColor} as={"h2"}>Playlists</Heading> 
    </Box>
  )
}

export default Hero