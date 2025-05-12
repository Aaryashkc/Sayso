import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton.jsx";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../hooks/useFollow.jsx";
import LoadingSpinner from "../skeletons/LoadingSpinner.jsx";

const RightPanel = () => {
  const {data:suggestedUsers, isLoading} = useQuery({
    queryKey: ['suggestedUsers'],
    queryFn: async () => {
     try {
      const response = await fetch('/api/users/suggested')
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch suggested users');
      }
      return data;
     } catch (error) {
      console.error('Error fetching suggested users:', error);
      throw error; 
     }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  })
  
  const {follow, isPending} = useFollow()

  if(suggestedUsers?.length === 0) return <div>
    <p className="text-center text-slate-500 md:w-64 w-0">No suggested users</p>  
  </div>;

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-primary/10 p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        
        <div className="flex flex-col gap-4 mt-3">
          {/* Loading Skeletons */}
          {isLoading && (
            Array(4).fill(0).map((_, index) => (
              <RightPanelSkeleton key={index} />
            ))
          )}

          {/* User List */}
          {!isLoading && suggestedUsers?.map((user) => (
            <Link
              to={`/profile/${user.username}`}
              className="flex items-center justify-between gap-4"
              key={user._id}
            >
              {/* User Info */}
              <div className="flex gap-2 items-center">
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img 
                      src={user.profilePicture || "/avatar-placeholder.png"} 
                      alt={user.fullName}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold tracking-tight truncate w-28">
                    {user.fullName}
                  </span>
                  <span className="text-sm text-slate-500">@{user.username}</span>
                </div>
              </div>

              {/* Follow Button */}
              <button
                className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                onClick={(e) =>{
                  e.preventDefault();
                  e.stopPropagation();
                  follow(user._id);
                }
                }
              >
                {isPending ? <LoadingSpinner size='sm'/> : 'Follow'}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;