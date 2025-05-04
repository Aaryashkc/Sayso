import Notification from '../models/notification.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import {v2 as cloudinary} from 'cloudinary';

export const createPost = async (req, res) => {
  try {
    const {text}= req.body;
    let {image}= req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!text && !image) {
      return res.status(400).json({ message: 'Text or image is required' });
    }

    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      image = uploadedResponse.secure_url;
    }

    const newPost = await Post({ text, image, user: userId });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error in post creation' });
    
  }

}

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
      const updatedPost = await Post.findById(postId);
      return res.status(200).json({ message: 'Post unliked', post: updatedPost });
    } else {
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $addToSet: { likedPosts: postId } });
      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: 'like',
      });
      await notification.save();

      return res.status(200).json({ message: 'Post liked', post });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

export const commentPost = async (req, res) => {
  try {
    const {text} = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ message: 'text is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {user: userId, text};
    post.comments.push(comment);
    await post.save();
    res.status(200).json(post);
    
    const notification = new Notification({
      from: userId,
      to: post.user,
      type: 'comment',
    });
    await notification.save();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error in comment creation' });
  }
}
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id.toString();

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== userId) {
      return res.status(401).json({ message: 'You are not authorized to delete this post' });
    }

    if (post.image) {
      const imageId = post.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(imageId);
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error in post deletion' });
  }

}

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate({path: 'user', select: '-password -email'}).populate({path: 'comments.user', select: '-password -email '}).exec();
    if (posts.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error in fetching posts' });
  }
}

export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({ path: 'user', select: '-password -email' })
      .populate({ path: 'comments.user', select: '-password -email' })
      .sort({ createdAt: -1 });

    res.status(200).json(likedPosts);
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error in fetching liked posts' });
  }
}
export const getFollowingPosts = async (req, res) => {

  try {
    const userId = req.user._id.toString();
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const following = user.following;
    const feedPosts = await Post.find({ user: { $in: following } })
      .populate({ path: 'user', select: '-password -email' })
      .populate({ path: 'comments.user', select: '-password -email' })
      .sort({ createdAt: -1 });

      res.status(200).json(feedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error in fetching following posts' });
    
  }
}
export const getUserPosts = async (req, res) => {

  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const posts = await Post.find({ user: user._id })
      .populate({ path: 'user', select: '-password -email' })
      .populate({ path: 'comments.user', select: '-password -email' })
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error in fetching user posts' });   
  }

}