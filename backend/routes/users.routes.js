import express from 'express';
import { getUserProfile, followeUnfollowUser, updateUser, getSuggestedUsers } from '../controllers/users.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router =express.Router();

router.get('/profile/:username', protectRoute, getUserProfile)
router.get('/suggested', protectRoute, getSuggestedUsers)
router.post('/follow/:id', protectRoute, followeUnfollowUser)
router.post('update', protectRoute, updateUser)


export default router