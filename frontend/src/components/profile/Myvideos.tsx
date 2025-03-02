import { myQuery } from '@/api/query'
import { RootState } from '@/lib/store'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useSelector } from 'react-redux'
import Video from '../Video'




const Myvideos: React.FC = () => {
    const token = useSelector((state: RootState) => state.token)
    console.log(token)

    const { data, isError, error, isLoading } = useQuery({
        queryKey: ['myvideos'],
        queryFn: () => myQuery.getUserVideos(token)
    })

    console.log(data)
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-6 gap-4'>
            {data?.videos?.map((vdo, i) => (
                <Video
                key={i}
                duration={vdo.duration}
                thumbnail={vdo.thumbnail}
                videoId={vdo._id}
                uploadTime={vdo.createdAt}
                title={vdo.title}
                views={vdo.views}

                 />
            ))}
        </div>
    )
}

export default Myvideos
