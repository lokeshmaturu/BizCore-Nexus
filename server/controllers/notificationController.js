const Notification = require('../models/Notification');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Get current user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
exports.getNotifications = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    const userId = req.user._id;

    // Find notifications sent directly to user OR targeted to user's role
    const query = {
      $or: [
        { recipient: userId },
        { targetRoles: userRole },
        { targetRoles: { $size: 0 } }, // Broadcast to all
      ],
    };

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return res.status(200).json(
      ApiResponse.success(
        {
          notifications,
          unreadCount,
        },
        'Notifications retrieved'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark single notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json(ApiResponse.error('Notification not found', 404));
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json(ApiResponse.success(notification, 'Notification marked as read'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark all notifications as read
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    return res.status(200).json(ApiResponse.success(null, 'All notifications marked as read'));
  } catch (error) {
    next(error);
  }
};
