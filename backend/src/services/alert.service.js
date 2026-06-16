import { prisma } from '../lib/prisma.js'
import { TASK_REQUIREMENTS } from '../constants/task-requirements.js'

export const alertService = {

  async getAll(userId = null) {
    return prisma.alert.findMany({
      where: {
        ...(userId && { userId }),
        isRead: false,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true }
        },
        task: {
          select: { id: true, title: true, priority: true, deadline: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  async markRead(id) {
    return prisma.alert.update({
      where: { id },
      data: { isRead: true }
    })
  },

  async markAllRead(userId) {
    return prisma.alert.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    })
  },

  async delete(id) {
    await prisma.alert.delete({ where: { id } })
    return { message: 'Alert deleted' }
  },

  // ── Alert Detectors ──────────────────────

  async detectOverloads() {
    const today = new Date()
    const blocks = await prisma.planningBlock.findMany({
      where: {
        date: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
          lte: new Date(today.setHours(23, 59, 59, 999)),
        }
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } }
      }
    })

    // Group by user
    const byUser = {}
    for (const block of blocks) {
      if (!byUser[block.userId]) {
        byUser[block.userId] = { user: block.user, totalMin: 0 }
      }
      byUser[block.userId].totalMin += block.durationMin
    }

    const alerts = []
    for (const entry of Object.values(byUser)) {
      if (entry.totalMin > 480) {
        const existing = await prisma.alert.findFirst({
          where: {
            userId: entry.user.id,
            type: 'OVERLOAD',
            createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
          }
        })
        if (!existing) {
          const alert = await prisma.alert.create({
            data: {
              type: 'OVERLOAD',
              message: `${entry.user.firstName} ${entry.user.lastName} is overloaded today (${(entry.totalMin / 60).toFixed(1)}h)`,
              userId: entry.user.id,
            }
          })
          alerts.push(alert)
        }
      }
    }
    return alerts
  },

  async detectCriticalDeadlines() {
    const in48h = new Date()
    in48h.setHours(in48h.getHours() + 48)

    const tasks = await prisma.task.findMany({
      where: {
        status: { not: 'DONE' },
        deadline: { lte: in48h },
        priority: { in: ['CRITICAL', 'HIGH'] },
      }
    })

    const alerts = []
    for (const task of tasks) {
      const existing = await prisma.alert.findFirst({
        where: {
          taskId: task.id,
          type: 'CRITICAL_DEADLINE',
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }
      })
      if (!existing) {
        const alert = await prisma.alert.create({
          data: {
            type: 'CRITICAL_DEADLINE',
            message: `Task "${task.title}" has a critical deadline within 48h`,
            taskId: task.id,
            userId: task.assignedUserId,
          }
        })
        alerts.push(alert)
      }
    }
    return alerts
  },

  async detectMissingSkills() {

    const unassignedTasks = await prisma.task.findMany({
      where: {
        assignedUserId: null,
        status: 'TODO',
      }
    })

    const members = await prisma.user.findMany({
      where: { role: 'MEMBER' },
      include: { skills: true, expertises: true }
    })

    const alerts = []
    for (const task of unassignedTasks) {
      const req = TASK_REQUIREMENTS?.[task.type]
      if (!req) continue

      const hasQualified = members.some(m =>
        req.skills.every(rs => {
          const found = m.skills.find(s => s.software === rs.software)
          return found && found.level >= rs.minLevel
        })
      )

      if (!hasQualified) {
        const existing = await prisma.alert.findFirst({
          where: { taskId: task.id, type: 'MISSING_SKILL' }
        })
        if (!existing) {
          const alert = await prisma.alert.create({
            data: {
              type: 'MISSING_SKILL',
              message: `No qualified member found for task "${task.title}" (${task.type})`,
              taskId: task.id,
            }
          })
          alerts.push(alert)
        }
      }
    }
    return alerts
  },

  async detectBottlenecks() {
    // Detect when multiple tasks need the same rare skill
    const unassigned = await prisma.task.findMany({
      where: { assignedUserId: null, status: 'TODO' }
    })

    const typeCount = {}
    for (const task of unassigned) {
      typeCount[task.type] = (typeCount[task.type] || 0) + 1
    }

    const alerts = []
    for (const [type, count] of Object.entries(typeCount)) {
      if (count >= 3) {
        const existing = await prisma.alert.findFirst({
          where: {
            type: 'BOTTLENECK',
            message: { contains: type },
            createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
          }
        })
        if (!existing) {
          const alert = await prisma.alert.create({
            data: {
              type: 'BOTTLENECK',
              message: `Bottleneck detected: ${count} unassigned tasks of type ${type}`,
            }
          })
          alerts.push(alert)
        }
      }
    }
    return alerts
  },

  async detectCascadeDelays() {
    // Find tasks that are overdue and check what they block
    const overdue = await prisma.task.findMany({
      where: {
        status: { not: 'DONE' },
        deadline: { lt: new Date() },
      },
      include: {
        blocks: {
          include: {
            blockedTask: {
              select: { id: true, title: true, assignedUserId: true }
            }
          }
        }
      }
    })

    const alerts = []
    for (const task of overdue) {
      if (task.blocks.length > 0) {
        const existing = await prisma.alert.findFirst({
          where: {
            taskId: task.id,
            type: 'CASCADE_DELAY',
            createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
          }
        })
        if (!existing) {
          const blocked = task.blocks.map(b => b.blockedTask.title).join(', ')
          const alert = await prisma.alert.create({
            data: {
              type: 'CASCADE_DELAY',
              message: `Task "${task.title}" is overdue and is blocking: ${blocked}`,
              taskId: task.id,
            }
          })
          alerts.push(alert)
        }
      }
    }
    return alerts
  },

  async detectLeaveConflicts() {
    const approvedAbsences = await prisma.absence.findMany({
      where: { status: 'APPROVED' },
      include: { user: true }
    })

    const alerts = []
    for (const absence of approvedAbsences) {
      const conflictingTasks = await prisma.task.findMany({
        where: {
          assignedUserId: absence.userId,
          status: { not: 'DONE' },
          deadline: {
            gte: absence.startDate,
            lte: absence.endDate,
          }
        }
      })

      for (const task of conflictingTasks) {
        const existing = await prisma.alert.findFirst({
          where: { taskId: task.id, type: 'LEAVE_CONFLICT' }
        })
        if (!existing) {
          const alert = await prisma.alert.create({
            data: {
              type: 'LEAVE_CONFLICT',
              message: `${absence.user.firstName} ${absence.user.lastName} is on leave but has task "${task.title}" due during absence`,
              userId: absence.userId,
              taskId: task.id,
            }
          })
          alerts.push(alert)
        }
      }
    }
    return alerts
  },

  // Run all detectors at once
  async runAllDetectors() {
    const [overloads, deadlines, skills, bottlenecks, cascades, leaves] = await Promise.all([
      alertService.detectOverloads(),
      alertService.detectCriticalDeadlines(),
      alertService.detectMissingSkills(),
      alertService.detectBottlenecks(),
      alertService.detectCascadeDelays(),
      alertService.detectLeaveConflicts(),
    ])

    return {
      overloads,
      deadlines,
      skills,
      bottlenecks,
      cascades,
      leaves,
      total: overloads.length + deadlines.length + skills.length +
             bottlenecks.length + cascades.length + leaves.length,
    }
  }
}