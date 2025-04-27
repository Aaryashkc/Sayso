import e from 'express';
import User from '../models/user.model.js';

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

  if(id === req.user._id){
    return res.status(400).json({error: 'You cannot follow yourself'})
  }

  if(!userToModify || !currentUser){
    return res.status(404).json({message: 'User not found'})
  }

  
} catch (error) {
  console.log("error in followingusfollowing user", error.message);
  res.status(500).json({error: error.message})
}

}
export const updateUserProfile = async(req, res)=>{

}