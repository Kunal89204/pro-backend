
import Hero from '@/components/playlists/Hero'
import Playlist from '@/components/playlists/Playlist'
import { Box} from '@chakra-ui/react'
import React from 'react'


const Playlists:React.FC = () => {
    // Color schemes

  return (
    <Box>
      <Hero />
      <div className='grid grid-cols-4 '>
      <Playlist/>
      <Playlist/>
      <Playlist/>
      <Playlist/>
      </div>
    </Box>
  )
}

export default Playlists
