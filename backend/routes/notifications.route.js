import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { deleteNotification, getAllNotifications } from '../controllers/notifications.controller.js';

const router = express.Router();

router.get('/', protectRoute, getAllNotifications);
router.delete('/', protectRoute, deleteNotification);
// router.delete('/:id', protectRoute, deleteOneNotification);



export default router;