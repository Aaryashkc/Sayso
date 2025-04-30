import Notification from '../models/notification.model.js';
import {v2 as cloudinary} from 'cloudinary';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const getUserProfile = async(req, res)=>{
    const {username} = req.params;
    try {
      const user = await User.findOne({username}).select('-password')
      if(!user){
         return res.status(404).json({message: 'User not found'})
        }
        res.status(200).json(user)
      
    } catch (error) {
        console.log("error to find users", error.message);

        res.status(500).json({error: error.message})
      
    }

}
export const followeUnfollowUser = async(req, res)=>{
try {
  const {id} = req.params;
  const userToModify = await User.findById(id);
  const currentUser = await User.findById(req.user._id);

  if(id === req.user._id.toString()){
    return res.status(400).json({error: 'You cannot follow yourself'})
  }
  if(!userToModify || !currentUser){
    return res.status(404).json({message: 'User not found'})
  }
  
  // Check if the user is already following the user to modify
  const isFollowing = currentUser.following.includes(id);

  if(isFollowing){
    //unfollow the user
    await User.findByIdAndUpdate(id, {
      $pull: {followers: req.user._id}
    }, {new: true})
    await User.findByIdAndUpdate(req.user._id, {
      $pull: {following: id}
    }, {new: true})
    res.status(200).json({message: 'User unfollowed'})

  }else{
    //follow the user
    await User.findByIdAndUpdate(id, {
      $push: {followers: req.user._id}

    }, {new: true})
    await User.findByIdAndUpdate(req.user._id, {
      $push: {following: id}
    }, {new: true})

    // Send the updated user data as a response notification
    const notification = new Notification({
      from: req.user._id,
      to: userToModify._id,
      type: 'follow'
    });
    await notification.save();


    res.status(200).json({message: 'User followed'})
  }
  
} catch (error) {
  console.log("error in followingusfollowing user", error.message);
  res.status(500).json({error: error.message})
}

}
export const getSuggestedUsers= async(req, res)=>{
  try {
    const userId = req.user._id;
    const userFollowedByMe = await User.findById(userId).select('following');
    const users = await User.aggregate([
      {
        $match: {
          _id: {$ne: userId, $nin: userFollowedByMe.following}
        }
      },
      {
        $sample: {size: 10}
      },
    ])
    const filteredUsers = users.filter(user=> !userFollowedByMe.following.includes(user._id.toString()));

    const suggestedUsers = filteredUsers.slice(0, 4)
    suggestedUsers.forEach(user=>(
      user.password = null
    ))
    res.status(200).json(suggestedUsers)


  } catch (error) {
    console.log("error in getting suggested users", error.message);
    res.status(500).json({error: error.message})
  }
}
export const updateUser = async(req, res)=>{
  const {username, fullName, email, currentPassword, newPassword, bio, link} = req.body;
  let {profilePicture, coverPicture} = req.body;
  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if(!user){
      return res.status(404).json({message: 'User not found'})
    }
    if(username){
      }

      //this us just for password update

    if((!newPassword && currentPassword) || (newPassword && !currentPassword)){
      return res.status(400).json({error: 'Please provide both current and new password'})
    }
    if(currentPassword && newPassword){
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if(!isMatch){
        return res.status(400).json({error: 'Current password is incorrect'})
      }
      if(newPassword.length < 6){
        return res.status(400).json({error: 'New password must be at least 6 characters long'})
      }
      const salt = await bcrypt.genSalt(10); 
      user.password =  await bcrypt.hash(newPassword, salt);
    }

    //profile picture and cover picture
    if(profilePicture){
      if(user.profilePicture){
        const publicId = user.profilePicture.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const uploadedResopnse = await cloudinary.uploader.upload(profilePicture)
      profilePicture = uploadedResopnse.secure_url;

      
    }
    if(coverPicture){
      if(user.coverPicture){
        const publicId = user.coverPicture.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const uploadedResopnse = await cloudinary.uploader.upload(coverPicture)
      profilePicture = uploadedResopnse.secure_url;

    }

    user.username = username || user.username;
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profilePicture = profilePicture || user.profilePicture;
    user.coverPicture = coverPicture || user.coverPicture;

    user = await user.save();
    user.password = null; // Remove password from the response
    return res.status(200).json(user)


  } catch (error) {
    console.log("error in updating user", error.message);
    res.status(500).json({error: error.message})
  }
}