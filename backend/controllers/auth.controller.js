import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetcookie } from '../utils/tokens.js';


//signup controller
export const signup = async(req, res) => {
  try{
    const { username, fullName, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    if(!emailRegex.test(email)){
      return res.status(400).json({ message: 'Invalid email address' });
    }
    const existingUser = await User.findOne( {username} );
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const existingEmail = await User.findOne( {email} );
    if (existingEmail) {
      return res.status(400).json({ message: 'email already exists' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPassword, 
    });

    if (newUser) {

      generateTokenAndSetcookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
        following: newUser.following,
        followers: newUser.followers,
        profilePicture: newUser.profilePicture,
        coverPicture: newUser.coverPicture,

      });
    } else{
      res.status(400).json({ message: 'Invalid user data' });
    }
    
  }catch(error){
    console.error(`Signup error: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
}

//login controller

export const login = async(req, res) => {

  try {
    const { username, password } = req.body;  
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    } 

    // Generate a token and set it in a cookie
    generateTokenAndSetcookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      following: user.following,
      followers: user.followers,
      profilePicture: user.profilePicture,
      coverPicture: user.coverPicture,
    });
    
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
    
  }
}

//logout controller
export const logout = async(req, res) => {
  try {
    res.cookie('jwt','',{maxAge:0});
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(`Logout error: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
}


export const getUser = async(req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(`Get user error: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
}