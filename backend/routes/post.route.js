import express from 'express';
import {protectRoute} from '../middleware/protectRoute.js';
import {createPost, likeUnlikePost, commentPost, deletePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts} from '../controllers/post.controller.js';
import { get } from 'mongoose';

const router = express.Router();

router.get('/all', protectRoute, getAllPosts);
router.get('/following', protectRoute, getFollowingPosts);
router.get('/user/:username', protectRoute, getUserPosts);
router.get('/likes/:id', protectRoute, getLikedPosts);

router.post('/create', protectRoute, createPost)
router.post('/like/:id', protectRoute, likeUnlikePost)
router.post('/comment/:id', protectRoute, commentPost)

router.delete('/:id', protectRoute, deletePost)


export default router;