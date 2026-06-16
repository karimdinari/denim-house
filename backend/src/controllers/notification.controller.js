import { notificationService } from '../services/notification.service.js'

export const notificationController = {

  async getByUser(req, res) {
    try {
      const notifications = await notificationService.getByUser(req.user.id)
      res.json(notifications)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async getUnreadCount(req, res) {
    try {
      const count = await notificationService.getUnreadCount(req.user.id)
      res.json({ count })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async markRead(req, res) {
    try {
      const notification = await notificationService.markRead(req.params.id)
      res.json(notification)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async markAllRead(req, res) {
    try {
      const result = await notificationService.markAllRead(req.user.id)
      res.json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async delete(req, res) {
    try {
      const result = await notificationService.delete(req.params.id)
      res.json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async clearAll(req, res) {
    try {
      const result = await notificationService.clearAll(req.user.id)
      res.json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },
}