import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const useFollow = () => {
  const queryClient = useQueryClient()
  const { mutate: follow, isPending } = useMutation(
  {  mutationFn: async (userId) => {
    try {
          const response = await fetch(`/api/users/follow/${userId}`, {
        method: 'POST',

      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return data
      
    } catch (error) {
 
      console.error('Error following user:', error)
      throw new Error('Failed to follow user')
      
    }
    },
      onSuccess: () => {
        Promise.all([
           queryClient.invalidateQueries({queryKey:['suggestedUsers']}),
           queryClient.invalidateQueries({queryKey:['authUser']})

        ])
      },
      onError: (error) => {
        toast.error(error.message)
      },
    
  }  
  )
  return ({ follow, isPending } )
  
}

export default useFollow
