import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Repeat, Heart, Bookmark, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../skeletons/LoadingSpinner";
import { formatPostDate } from "../utils/functions";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const {data: authUser} = useQuery({queryKey : ["authUser"]});
  const queryClient = useQueryClient();
  const{mutate: deletepost, isPending: isDeleting} = useMutation({
    mutationFn: async (postId) => {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      return data;
    }, 
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });

    },
    onError: (error) => {

    },
  })

  const {mutate: likePost, isPending: isLiking} = useMutation({
    mutationFn: async (postId) => {
      try {
        const response = await fetch(`/api/posts//like/${post._id}`, {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to like post");
      }
      return data;
        
      } catch (error) {
        console.error("Error liking post:", error);
        throw new Error("Failed to like post");
        
      } 
    },
    onSuccess: (updatedLikes) => {
      toast.success("Post liked successfully");
      // queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.setQueryData(["posts"], (oldPosts) => {
        return oldPosts.map((p) => {
          if (p._id === post._id) {
            return {
              ...p,
              likes: updatedLikes
            };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  })

  const {mutate: commentPost, isPending: isCommenting} = useMutation({
    mutationFn: async (postId) => {
      try {
        const response = await fetch(`/api/posts/comment/${post._id}`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUser.token}`,
          },
          body: JSON.stringify({ text:comment })
        })
        const data = await response.json();
        if (!response.ok){
          throw new Error(data.error || 'Something went wrong')
        } 
        return data; 
      } catch (error) {
        throw new Error(error)
      }
    },
    onSuccess: () => {
      toast.success("Comment added successfully");
      setComment("");
      // queryClient.invalidateQueries({ queryKey: ["posts"] })
       queryClient.setQueryData(["posts"], (oldPosts) => {
        return oldPosts.map((p) => {
          if (p._id === post._id) {
            return {
              ...p,
              comments: [...p.comments, { text: comment, user: authUser._id }],
            };
          }
          return p;

       })
      })
    },
    onError: (error) => {
      toast.error(error.message);
    }


      
  })
  const postOwner = post.user;
  const isLiked = post.likes.includes(authUser._id);
  const isMyPost = authUser._id === postOwner._id;
  const formattedDate = formatPostDate(post.createdAt);

  const handleDeletePost = () => {
    deletepost();

  };
  const handlePostComment = (e) => {
    e.preventDefault();
    commentPost()
    if (isCommenting) return;

  };
  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

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
              {isDeleting && (
                <LoadingSpinner size={16} className="text-red-500" />
              )}
            </span>
          )}
        </div>
        
        {/* Post Body */}
        <div className="flex flex-col gap-3 overflow-hidden">
          <span>{post.text}</span>
          {post.image && (
            <img
              src={post.image}
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
                  <button className="btn bg-blue-400 rounded-full btn-sm text-white px-4">
                    {isCommenting ? (
                      <LoadingSpinner size='sm' className="text-white" />
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
        	  <div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
								{isLiking && <LoadingSpinner size='sm' />}
								{!isLiked && !isLiking && (
									<Heart className='w-4 h-4 cursor-pointer text-slate-500 fill-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && !isLiking && (
									<Heart className='w-4 h-4 cursor-pointer fill-pink-500 text-pink-500 ' />
								)}

								<span
									className={`text-sm  group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : "text-slate-500"
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