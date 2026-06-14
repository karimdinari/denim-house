import { prisma } from '../lib/prisma.js'

export const notificationService = {

  async getByUser(userId) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  },

  async getUnreadCount(userId) {
    return prisma.notification.count({
      where: { userId, isRead: false }
    })
  },

  async create({ userId, message, link = null }) {
    return prisma.notification.create({
      data: { userId, message, link }
    })
  },

  async createBulk(userIds, message, link = null) {
    return prisma.notification.createMany({
      data: userIds.map(userId => ({ userId, message, link }))
    })
  },

  async markRead(id) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true }
    })
  },

  async markAllRead(userId) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    })
  },

  async delete(id) {
    await prisma.notification.delete({ where: { id } })
    return { message: 'Notification deleted' }
  },

  async clearAll(userId) {
    await prisma.notification.deleteMany({ where: { userId } })
    return { message: 'All notifications cleared' }
  },

  // ── Semantic helpers ─────────────────────

  async notifyTaskAssigned(userId, taskTitle) {
    return notificationService.create({
      userId,
      message: `You have been assigned to task: "${taskTitle}"`,
      link: '/tasks',
    })
  },

  async notifyAbsenceApproved(userId) {
    return notificationService.create({
      userId,
      message: 'Your absence request has been approved',
      link: '/absences',
    })
  },

  async notifyAbsenceRejected(userId) {
    return notificationService.create({
      userId,
      message: 'Your absence request has been rejected',
      link: '/absences',
    })
  },

  async notifyTaskStatusChanged(userId, taskTitle, status) {
    return notificationService.create({
      userId,
      message: `Task "${taskTitle}" status changed to ${status}`,
      link: '/tasks',
    })
  },

  async notifyDeadlineApproaching(userId, taskTitle, deadline) {
    const d = new Date(deadline).toLocaleDateString('fr-TN')
    return notificationService.create({
      userId,
      message: `Deadline approaching for "${taskTitle}" — due ${d}`,
      link: '/tasks',
    })
  }
}