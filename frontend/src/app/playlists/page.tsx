
import Hero from '@/components/playlists/Hero'
import Playlist from '@/components/playlists/Playlist'
import { Box} from '@chakra-ui/react'
import React from 'react'


const Playlists:React.FC = () => {
    // Color schemes

  return (
    <Box>
      <Hero />
      <Playlist></Playlist>
    </Box>
  )
}

export default Playlists
