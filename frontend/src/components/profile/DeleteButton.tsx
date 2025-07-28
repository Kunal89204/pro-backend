import { myQuery } from '@/api/query'
import { RootState } from '@/lib/store'
import { MenuItem } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux'

const DeleteButton = ({ id, children }: { id: string; children: ReactNode }) => {
    const token = useSelector((state: RootState) => state.token)

    const mutation = useMutation({
        mutationFn: ({ token, id }: { token: string; id: string }) => myQuery.deleteVideo(token, id),
        onSuccess: (data) => {
            console.log('Video deleted successfully:', data)
        },
        onError: (error) => {
            console.error('Error deleting video:', error)
        },
    })

    return (
        <MenuItem onClick={() => mutation.mutate({ token, id })} bg={'transparent'} _hover={{bg: 'transparent'}}>
            {children}
        </MenuItem>
    )
}

export default DeleteButton
