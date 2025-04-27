import express from 'express';
import { getUserProfile, followeUnfollowUser, updateUserProfile } from '../controllers/users.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router =express.Router();

router.get('/profile/:username', protectRoute, getUserProfile)
router.get('/suggested', protectRoute, getUserProfile)
router.post('/follow/:id', protectRoute, followeUnfollowUser)
router.post('update', protectRoute, updateUserProfile)


export default router