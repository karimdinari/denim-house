import { prisma } from '../lib/prisma.js'

export const userService = {

  async getAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        background: true,
        avatar: true,
        skills: true,
        expertises: true,
        absences: {
          where: { status: 'APPROVED' },
          select: { startDate: true, endDate: true, type: true }
        },
        _count: {
          select: { tasks: true, taskHistory: true }
        }
      }
    })
  },

  async getById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        skills: true,
        expertises: true,
        absences: true,
        tasks: {
          where: { status: { not: 'DONE' } },
          select: {
            id: true,
            title: true,
            type: true,
            priority: true,
            status: true,
            deadline: true,
            estimatedMin: true,
          }
        },
        taskHistory: {
          orderBy: { completedAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { tasks: true, taskHistory: true }
        }
      }
    })
    if (!user) throw new Error('User not found')
    const { password, ...safeUser } = user
    return safeUser
  },

  async update(id, data) {
    const { skills, expertises, ...rest } = data

    const user = await prisma.user.update({
      where: { id },
      data: rest,
    })

    // Replace skills if provided
    if (skills) {
      await prisma.userSkill.deleteMany({ where: { userId: id } })
      await prisma.userSkill.createMany({
        data: skills.map(s => ({ userId: id, software: s.software, level: s.level }))
      })
    }

    // Replace expertises if provided
    if (expertises) {
      await prisma.userExpertise.deleteMany({ where: { userId: id } })
      await prisma.userExpertise.createMany({
        data: expertises.map(e => ({ userId: id, domain: e.domain }))
      })
    }

    return userService.getById(id)
  },

  async delete(id) {
    await prisma.user.delete({ where: { id } })
    return { message: 'User deleted' }
  },

  async getWorkload(id) {
    // Returns total estimated minutes of active tasks for a user
    const tasks = await prisma.task.findMany({
      where: {
        assignedUserId: id,
        status: { in: ['TODO', 'IN_PROGRESS', 'IN_REVIEW'] }
      },
      select: { estimatedMin: true, priority: true, deadline: true }
    })

    const totalMin = tasks.reduce((sum, t) => sum + t.estimatedMin, 0)
    const totalHours = (totalMin / 60).toFixed(1)

    return { tasks, totalMin, totalHours }
  },

  async getSuccessRate(id) {
    const history = await prisma.taskHistory.findMany({
      where: { userId: id }
    })
    if (!history.length) return { rate: 0, total: 0 }

    const successful = history.filter(h => h.success).length
    const rate = ((successful / history.length) * 100).toFixed(1)

    return { rate: parseFloat(rate), total: history.length }
  }
}