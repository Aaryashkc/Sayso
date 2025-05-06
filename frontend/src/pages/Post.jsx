import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Repeat, Heart, Bookmark, Trash2 } from "lucide-react";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const postOwner = post.user;
  const isLiked = true;
  const isMyPost = false;
  const formattedDate = "1h";
  const isCommenting = false;

  const handleDeletePost = () => {};
  const handlePostComment = (e) => {
    e.preventDefault();
  };
  const handleLikePost = () => {};

  return (
    <div className="flex gap-2 items-start p-4 border-b border-gray-700">
      {/* User Avatar */}
      <div className="avatar">
        <Link to={`/profile/${postOwner.username}`} className="w-8 rounded-full overflow-hidden">
          <img 
            src={postOwner.profileImg || "/avatar-placeholder.png"} 
            alt={postOwner.fullName}
          />
        </Link>
      </div>
      
      {/* Post Content */}
      <div className="flex flex-col flex-1">
        {/* Post Header */}
        <div className="flex gap-2 items-center">
          <Link to={`/profile/${postOwner.username}`} className="font-bold">
            {postOwner.fullName}
          </Link>
          <span className="text-gray-700 flex gap-1 text-sm">
            <Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>
          {isMyPost && (
            <span className="flex justify-end flex-1">
              <Trash2 
                size={16} 
                className="cursor-pointer hover:text-red-500" 
                onClick={handleDeletePost} 
              />
            </span>
          )}
        </div>
        
        {/* Post Body */}
        <div className="flex flex-col gap-3 overflow-hidden">
          <span>{post.text}</span>
          {post.img && (
            <img
              src={post.img}
              className="h-80 object-contain rounded-lg border border-gray-700"
              alt="Post image"
            />
          )}
        </div>
        
        {/* Post Actions */}
        <div className="flex justify-between mt-3">
          <div className="flex gap-4 items-center w-2/3 justify-between">
            {/* Comment Button */}
            <div
              className="flex gap-1 items-center cursor-pointer group"
              onClick={() => document.getElementById(`comments_modal${post._id}`).showModal()}
            >
              <MessageCircle size={16} className="text-slate-500 group-hover:text-sky-400" />
              <span className="text-sm text-slate-500 group-hover:text-sky-400">
                {post.comments.length}
              </span>
            </div>
            
            {/* Comments Modal */}
            <dialog id={`comments_modal${post._id}`} className="modal border-none outline-none">
              <div className="modal-box rounded border border-gray-600">
                <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                  {post.comments.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No comments yet 🤔 Be the first one 😉
                    </p>
                  )}
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-2 items-start">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={comment.user.profileImg || "/avatar-placeholder.png"}
                            alt={comment.user.fullName}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-bold">{comment.user.fullName}</span>
                          <span className="text-gray-700 text-sm">
                            @{comment.user.username}
                          </span>
                        </div>
                        <div className="text-sm">{comment.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                  onSubmit={handlePostComment}
                >
                  <textarea
                    className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                    {isCommenting ? (
                      <span className="loading loading-spinner loading-md"></span>
                    ) : (
                      "Post"
                    )}
                  </button>
                </form>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button className="outline-none">close</button>
              </form>
            </dialog>
            
            {/* Repost Button */}
            <div className="flex gap-1 items-center group cursor-pointer">
              <Repeat size={20} className="text-slate-500 group-hover:text-green-500" />
              <span className="text-sm text-slate-500 group-hover:text-green-500">0</span>
            </div>
            
            {/* Like Button */}
            <div className="flex gap-1 items-center group cursor-pointer" onClick={handleLikePost}>
              <Heart 
                size={16} 
                className={`cursor-pointer ${isLiked ? "text-pink-500 fill-pink-500" : "text-slate-500 group-hover:text-pink-500"}`} 
              />
              <span
                className={`text-sm text-slate-500 group-hover:text-pink-500 ${
                  isLiked ? "text-pink-500" : ""
                }`}
              >
                {post.likes.length}
              </span>
            </div>
          </div>
          
          {/* Bookmark Button */}
          <div className="flex w-1/3 justify-end gap-2 items-center">
            <Bookmark size={16} className="text-slate-500 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;