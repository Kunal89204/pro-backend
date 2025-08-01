import { myQuery } from '@/api/query'
import { RootState } from '@/lib/store'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useSelector } from 'react-redux'
import Video from './Video'
import { VideoProps } from '@/types/types'




const Myvideos: React.FC<{username: string | undefined}> = ({username}) => {
    const token = useSelector((state: RootState) => state.token)
  

    const { data } = useQuery({
        queryKey: ['myvideos'],
        queryFn: () => myQuery.getUserVideos(token, username as string)
    })





    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-6 gap-4'>
           
            {data?.videos?.map((vdo: VideoProps, i: number) => (
                <Video
                    key={i}
                    duration={vdo.duration}
                    thumbnail={vdo.thumbnail}
                    _id={vdo._id}
                    createdAt={vdo.createdAt}
                    title={vdo.title}
                    views={vdo.views}
                    owner={vdo?.owner}
                />
            ))}
        </div>
    )
}

export default Myvideos
