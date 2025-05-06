import { useRef, useState } from "react";
import { Image, Smile, X } from "lucide-react";
import toast from "react-hot-toast";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);
  const isPending = false;
  const isError = false;
  const data = {
    profileImg: "/avatars/girl1.png",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Post created successfully");
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImg(null);
    if (imgRef.current) imgRef.current.value = null;
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      {/* User Avatar */}
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img 
            src={data.profileImg || "/avatar-placeholder.png"} 
            alt="User Avatar" 
          />
        </div>
      </div>
      
      {/* Post Creation Form */}
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        {/* Text Input */}
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        {/* Image Preview */}
        {img && (
          <div className="relative w-full h-72 rounded overflow-hidden mx-auto">
            <X
              size={20}
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full p-1 cursor-pointer"
              onClick={clearImage}
            />
            <img 
              src={img} 
              className="w-full mx-auto h-72 object-contain rounded" 
              alt="Image Preview"
            />
          </div>
        )}
        
        {/* Action Bar */}
        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <Image
              size={24}
              className="text-primary cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <Smile 
              size={20} 
              className="text-primary cursor-pointer" 
            />
          </div>
          
          {/* Hidden File Input */}
          <input 
            type="file" 
            hidden 
            ref={imgRef} 
            onChange={handleImgChange} 
            accept="image/*"
          />
          
          {/* Post Button */}
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        
        {/* Error Message */}
        {isError && <div className="text-red-500">Something went wrong</div>}
      </form>
    </div>
  );
};

export default CreatePost;