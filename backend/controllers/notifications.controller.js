import Notification from "../models/notification.model.js";

export const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({to:userId}).populate({path:'from', select:'username profilePicture'}).sort({ createdAt: -1 });
    if (!notifications) {
      return res.status(404).json({ message: 'No notifications found' });
    }
    await Notification.updateMany({to:userId}, { read:true});
    
    res.status(200).json(notifications);


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error in fetching notifications' });
  }
}
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({to:userId});
    res.status(200).json({ message: 'Notifications deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error in deleting notifications' });
    
  }
}

// export const deleteOneNotification = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const notificationId = req.params.id;
//     const notification = await Notification.findById(notificationId);
//     if (!notification) {
//       return res.status(404).json({ message: 'Notification not found' });
//     }
//     if (notification.to.toString() !== userId.toString()) {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }
//     await Notification.findByIdAndDelete({notificationId });
//     res.status(200).json({ message: 'Notification deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error in deleting notification' }); 
//   }

// }