import { useState } from "react";
import CreatePost from "./CreatePost";
import Posts from "./Posts";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");
  
  // Tab options for feed selection
  const tabOptions = [
    { id: "forYou", label: "For you" },
    { id: "following", label: "Following" }
  ];

  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
      {/* Feed Selection Header */}
      <div className="flex w-full border-b border-gray-700">
        {tabOptions.map((tab) => (
          <div
            key={tab.id}
            className="flex justify-center flex-1 p-3 hover:bg-primary/20 transition duration-300 cursor-pointer relative"
            onClick={() => setFeedType(tab.id)}
          >
            {tab.label}
            {feedType === tab.id && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </div>
        ))}
      </div>

      {/* Create Post Input */}
      <CreatePost />
      
      {/* Posts Feed */}
      <Posts />
    </div>
  );
};

export default HomePage;