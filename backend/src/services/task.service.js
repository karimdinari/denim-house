import { prisma } from '../lib/prisma.js'

export const taskService = {

  async getAll(filters = {}) {
    const { status, priority, type, assignedUserId, family } = filters

    return prisma.task.findMany({
      where: {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(type && { type }),
        ...(family && { family }),
        ...(assignedUserId && { assignedUserId }),
      },
      include: {
        assignedTo: {
          select: { id: true, firstName: true, lastName: true, avatar: true }
        },
        blockedBy: {
          include: {
            blockingTask: { select: { id: true, title: true, status: true } }
          }
        },
        blocks: {
          include: {
            blockedTask: { select: { id: true, title: true, status: true } }
          }
        },
      },
      orderBy: [
        { priority: 'asc' },
        { deadline: 'asc' },
        { createdAt: 'desc' }
      ]
    })
  },

  async getById(id) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, firstName: true, lastName: true, avatar: true }
        },
        blockedBy: {
          include: {
            blockingTask: { select: { id: true, title: true, status: true } }
          }
        },
        blocks: {
          include: {
            blockedTask: { select: { id: true, title: true, status: true } }
          }
        },
        planningBlocks: true,
        taskHistory: {
          orderBy: { completedAt: 'desc' }
        }
      }
    })
    if (!task) throw new Error('Task not found')
    return task
  },

  async create(data) {
    const { dependencies, ...rest } = data

    const task = await prisma.task.create({
      data: rest,
    })

    // Add dependencies if provided
    if (dependencies?.length) {
      await prisma.taskDependency.createMany({
        data: dependencies.map(depId => ({
          blockedTaskId: task.id,
          blockingTaskId: depId,
        }))
      })
    }

    return taskService.getById(task.id)
  },

  async update(id, data) {
    const { dependencies, ...rest } = data

    await prisma.task.update({
      where: { id },
      data: rest,
    })

    // Replace dependencies if provided
    if (dependencies !== undefined) {
      await prisma.taskDependency.deleteMany({ where: { blockedTaskId: id } })
      if (dependencies.length) {
        await prisma.taskDependency.createMany({
          data: dependencies.map(depId => ({
            blockedTaskId: id,
            blockingTaskId: depId,
          }))
        })
      }
    }

    return taskService.getById(id)
  },

  async updateStatus(id, status, userId) {
    const task = await prisma.task.update({
      where: { id },
      data: { status },
    })

    // If task is done, log to history
    if (status === 'DONE' && task.assignedUserId) {
      await prisma.taskHistory.create({
        data: {
          userId: task.assignedUserId,
          taskId: task.id,
          type: task.type,
          actualMin: task.estimatedMin, // will be refined later
          success: true,
        }
      })
    }

    return task
  },

  async delete(id) {
    await prisma.task.delete({ where: { id } })
    return { message: 'Task deleted' }
  },

  async assign(taskId, userId) {
    return prisma.task.update({
      where: { id: taskId },
      data: {
        assignedUserId: userId,
        status: 'IN_PROGRESS',
      }
    })
  },

  async getCascadeChain(taskId) {
    // Returns all tasks that would be impacted if this task is delayed
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        blocks: {
          include: {
            blockedTask: true
          }
        }
      }
    })
    if (!task) throw new Error('Task not found')
    return task.blocks.map(b => b.blockedTask)
  },

  async getBlocked() {
    // Returns tasks that are blocked because their dependencies are not done
    const dependencies = await prisma.taskDependency.findMany({
      include: {
        blockingTask: { select: { id: true, status: true } },
        blockedTask: true,
      }
    })

    return dependencies
      .filter(d => d.blockingTask.status !== 'DONE')
      .map(d => d.blockedTask)
  },

  async getMyTasks(userId) {
    return prisma.task.findMany({
      where: { assignedUserId: userId },
      include: {
        assignedTo: {
          select: { id: true, firstName: true, lastName: true, avatar: true }
        },
        blockedBy: {
          include: {
            blockingTask: { select: { id: true, title: true, status: true } }
          }
        },
      },
      orderBy: [
        { priority: 'asc' },
        { deadline: 'asc' },
        { createdAt: 'desc' }
      ]
    })
  }
}