import { prisma } from '../lib/prisma.js'

const MAX_DAILY_MIN = 8 * 60 // 480 minutes
const SLOT_MIN = 30

export const planningService = {

  async getWeek(userId, weekStart) {
    const start = new Date(weekStart)
    const end   = new Date(weekStart)
    end.setDate(end.getDate() + 6)

    return prisma.planningBlock.findMany({
      where: {
        userId,
        date: { gte: start, lte: end }
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            type: true,
            priority: true,
            status: true,
            family: true,
          }
        }
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }]
    })
  },

  async getAllWeek(weekStart) {
    const start = new Date(weekStart)
    const end   = new Date(weekStart)
    end.setDate(end.getDate() + 6)

    return prisma.planningBlock.findMany({
      where: {
        date: { gte: start, lte: end }
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, avatar: true }
        },
        task: {
          select: {
            id: true,
            title: true,
            type: true,
            priority: true,
            status: true,
            family: true,
          }
        }
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }]
    })
  },

  async create({ userId, taskId, date, startTime, endTime }) {
    const durationMin = _calcDuration(startTime, endTime)

    if (durationMin % SLOT_MIN !== 0)
      throw new Error('Duration must be in 30-minute slots')

    // Check daily capacity
    await _checkDailyCapacity(userId, date, durationMin)

    // Check holiday
    await _checkHoliday(date)

    // Check absence
    await _checkAbsence(userId, date)

    return prisma.planningBlock.create({
      data: {
        userId,
        taskId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        durationMin,
      }
    })
  },

  async update(id, { startTime, endTime }) {
    const block = await prisma.planningBlock.findUnique({ where: { id } })
    if (!block) throw new Error('Planning block not found')

    const durationMin = _calcDuration(startTime, endTime)

    if (durationMin % SLOT_MIN !== 0)
      throw new Error('Duration must be in 30-minute slots')

    // Check daily capacity excluding current block
    const dayBlocks = await prisma.planningBlock.findMany({
      where: {
        userId: block.userId,
        date: block.date,
        id: { not: id }
      }
    })
    const usedMin = dayBlocks.reduce((sum, b) => sum + b.durationMin, 0)
    if (usedMin + durationMin > MAX_DAILY_MIN)
      throw new Error(`Daily limit exceeded: max ${MAX_DAILY_MIN / 60}h/day`)

    return prisma.planningBlock.update({
      where: { id },
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        durationMin,
      }
    })
  },

  async delete(id) {
    await prisma.planningBlock.delete({ where: { id } })
    return { message: 'Planning block deleted' }
  },

  async getDailyLoad(userId, date) {
    const d = new Date(date)
    const blocks = await prisma.planningBlock.findMany({
      where: { userId, date: d },
    })
    const totalMin = blocks.reduce((sum, b) => sum + b.durationMin, 0)
    return {
      totalMin,
      totalHours: (totalMin / 60).toFixed(1),
      remainingMin: MAX_DAILY_MIN - totalMin,
      isOverloaded: totalMin > MAX_DAILY_MIN,
    }
  },

  async exportCSV(weekStart) {
    const blocks = await planningService.getAllWeek(weekStart)

    const rows = blocks.map(b => ({
      member:    `${b.user.firstName} ${b.user.lastName}`,
      task:      b.task.title,
      type:      b.task.type,
      date:      new Date(b.date).toLocaleDateString('fr-TN'),
      start:     new Date(b.startTime).toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' }),
      end:       new Date(b.endTime).toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' }),
      duration:  `${b.durationMin}min`,
      priority:  b.task.priority,
    }))

    const header = 'Member,Task,Type,Date,Start,End,Duration,Priority\n'
    const csv    = header + rows.map(r => Object.values(r).join(',')).join('\n')
    return csv
  }
}

// ─────────────────────────────────────────
// PRIVATE HELPERS
// ─────────────────────────────────────────

function _calcDuration(startTime, endTime) {
  const start = new Date(startTime)
  const end   = new Date(endTime)
  return (end - start) / 60000 // ms to minutes
}

async function _checkDailyCapacity(userId, date, newDurationMin) {
  const d = new Date(date)
  const blocks = await prisma.planningBlock.findMany({
    where: { userId, date: d }
  })
  const usedMin = blocks.reduce((sum, b) => sum + b.durationMin, 0)
  if (usedMin + newDurationMin > MAX_DAILY_MIN)
    throw new Error(`Daily limit exceeded: max ${MAX_DAILY_MIN / 60}h/day`)
}

async function _checkHoliday(date) {
  const d = new Date(date)
  const holiday = await prisma.publicHoliday.findFirst({
    where: {
      date: {
        gte: new Date(d.setHours(0, 0, 0, 0)),
        lte: new Date(d.setHours(23, 59, 59, 999)),
      }
    }
  })
  if (holiday) throw new Error(`Cannot plan on public holiday: ${holiday.name}`)
}

async function _checkAbsence(userId, date) {
  const d = new Date(date)
  const absence = await prisma.absence.findFirst({
    where: {
      userId,
      status: 'APPROVED',
      startDate: { lte: d },
      endDate:   { gte: d },
    }
  })
  if (absence) throw new Error('Member is absent on this date')
}