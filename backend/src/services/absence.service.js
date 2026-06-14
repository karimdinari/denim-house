import { prisma } from '../lib/prisma.js'

export const absenceService = {

  async getAll() {
    return prisma.absence.findMany({
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, avatar: true }
        }
      },
      orderBy: { startDate: 'asc' }
    })
  },

  async getByUser(userId) {
    return prisma.absence.findMany({
      where: { userId },
      orderBy: { startDate: 'asc' }
    })
  },

  async create({ userId, type, startDate, endDate, note }) {
    // Check for overlap with existing absences
    const overlap = await prisma.absence.findFirst({
      where: {
        userId,
        status: { not: 'REJECTED' },
        OR: [
          { startDate: { lte: new Date(endDate) }, endDate: { gte: new Date(startDate) } }
        ]
      }
    })
    if (overlap) throw new Error('Absence overlaps with an existing request')

    return prisma.absence.create({
      data: {
        userId,
        type,
        startDate: new Date(startDate),
        endDate:   new Date(endDate),
        note:      note ?? null,
        status:    'PENDING',
      }
    })
  },

  async approve(id) {
    return prisma.absence.update({
      where: { id },
      data: { status: 'APPROVED' }
    })
  },

  async reject(id) {
    return prisma.absence.update({
      where: { id },
      data: { status: 'REJECTED' }
    })
  },

  async delete(id) {
    await prisma.absence.delete({ where: { id } })
    return { message: 'Absence deleted' }
  },

  // ── Public Holidays ──────────────────────

  async getHolidays(country = 'TN') {
    return prisma.publicHoliday.findMany({
      where: { country },
      orderBy: { date: 'asc' }
    })
  },

  async createHoliday({ name, date, country, isRecurring }) {
    return prisma.publicHoliday.create({
      data: {
        name,
        date:        new Date(date),
        country:     country ?? 'TN',
        isRecurring: isRecurring ?? true,
      }
    })
  },

  async deleteHoliday(id) {
    await prisma.publicHoliday.delete({ where: { id } })
    return { message: 'Holiday deleted' }
  },

  async isAvailable(userId, date) {
    const d = new Date(date)

    const absence = await prisma.absence.findFirst({
      where: {
        userId,
        status: 'APPROVED',
        startDate: { lte: d },
        endDate:   { gte: d },
      }
    })

    const holiday = await prisma.publicHoliday.findFirst({
      where: {
        date: {
          gte: new Date(d.setHours(0, 0, 0, 0)),
          lte: new Date(d.setHours(23, 59, 59, 999)),
        }
      }
    })

    return {
      available: !absence && !holiday,
      reason: absence ? 'ABSENCE' : holiday ? 'HOLIDAY' : null,
    }
  }
}