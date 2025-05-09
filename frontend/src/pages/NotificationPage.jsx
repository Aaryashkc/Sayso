import { Link } from "react-router-dom";
import LoadingSpinner from "../skeletons/LoadingSpinner.jsx";
import { Settings, User, Heart, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

const NotificationPage = () => {
  const isLoading = false;
  const notifications = [
    {
      _id: "1",
      from: {
        _id: "1",
        username: "johndoe",
        profileImg: "/avatars/boy2.png",
      },
      type: "follow",
    },
    {
      _id: "2",
      from: {
        _id: "2",
        username: "janedoe",
        profileImg: "/avatars/girl1.png",
      },
      type: "like",
    },
    {
      _id: "3",
      from: {
        _id: "3",
        username: "janedoe",
        profileImg: "/avatars/girl1.png",
      },
      type: "comment",
    },
  ];

  const deleteNotifications = () => {
    toast.error("All notifications deleted");
  };

  return (
    <div className="flex-[4_4_0] border-l border-r border-none min-h-screen">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <p className="font-bold">Notifications</p>
        <div className="dropdown">
          <div tabIndex={0} role="button" className="m-1">
            <Settings size={16} />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a onClick={deleteNotifications}>Delete all notifications</a>
            </li>
          </ul>
        </div>
      </div>
      
      {isLoading && (
        <div className="flex justify-center h-full items-center">
          <LoadingSpinner size="lg" />
        </div>
      )}
      
      {notifications?.length === 0 && (
        <div className="text-center p-4 font-bold">No notifications 🤔</div>
      )}
      
      {notifications?.map((notification) => (
        <div className="border-b border-gray-700" key={notification._id}>
          <div className="flex gap-2 p-4">
            {notification.type === "follow" && (
              <User className="w-7 h-7 text-indigo-500" />
            )}
            {notification.type === "like" && (
              <Heart className="w-7 h-7 text-red-500" />
            )}
            {notification.type === "comment" && (
              <MessageCircle className="w-7 h-7 text-blue-400" />
            )}
            
            <Link to={`/profile/${notification.from.username}`}>
              <div className="flex items-center gap-2">
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img 
                      src={notification.from.profileImg || "/avatar-placeholder.png"}
                      alt={`${notification.from.username}'s avatar`}
                    />
                  </div>
                </div>
                <div>
                  <span className="font-bold">@{notification.from.username}</span>{" "}
                  {notification.type === "follow" && (
                    <span> started following you</span>
                  )}
                  {notification.type === "like" && (
                    <span> liked your post</span>
                  )}
                  {notification.type === "comment" && (
                    <span> commented on your post</span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationPage;