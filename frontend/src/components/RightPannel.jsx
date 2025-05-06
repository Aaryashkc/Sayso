import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton.jsx";
import { USERS_FOR_RIGHT_PANEL } from "../utils/dummy";

const RightPanel = () => {
  const isLoading = false;

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
          {!isLoading && USERS_FOR_RIGHT_PANEL?.map((user) => (
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
                      src={user.profileImg || "/avatar-placeholder.png"} 
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
                onClick={(e) => e.preventDefault()}
              >
                Follow
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;