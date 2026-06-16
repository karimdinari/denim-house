import { Router } from 'express'
import { notificationController } from '../controllers/notification.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = Router()

router.use(authenticate)

// All scoped to the authenticated user
router.get('/',              notificationController.getByUser)
router.get('/unread-count',  notificationController.getUnreadCount)
router.patch('/:id/read',    notificationController.markRead)
router.patch('/read-all',    notificationController.markAllRead)
router.delete('/clear-all',  notificationController.clearAll)
router.delete('/:id',        notificationController.delete)

export default router