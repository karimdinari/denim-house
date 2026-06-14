import { prisma } from '../lib/prisma.js'

const PHASES = ['ESQUISSE', 'PATRONAGE', 'COUPE', 'ASSEMBLAGE', 'LAVAGE', 'QC']

export const prototypeService = {

  async getAll() {
    return prisma.prototype.findMany({
      include: {
        phases: { orderBy: { completedAt: 'asc' } },
        _count: { select: { phases: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  async getById(id) {
    const proto = await prisma.prototype.findUnique({
      where: { id },
      include: {
        phases: { orderBy: { completedAt: 'asc' } }
      }
    })
    if (!proto) throw new Error('Prototype not found')

    // Calculate progress
    const completedPhases = proto.phases.map(p => p.phase)
    const progress = Math.round((completedPhases.length / PHASES.length) * 100)

    return { ...proto, progress, totalPhases: PHASES.length }
  },

  async create({ name, collection }) {
    return prisma.prototype.create({
      data: {
        name,
        collection: collection ?? null,
        currentPhase: 'ESQUISSE',
      }
    })
  },

  async advancePhase(id, note = null) {
    const proto = await prisma.prototype.findUnique({
      where: { id },
      include: { phases: true }
    })
    if (!proto) throw new Error('Prototype not found')

    const currentIndex = PHASES.indexOf(proto.currentPhase)
    if (currentIndex === PHASES.length - 1)
      throw new Error('Prototype has already completed all phases')

    const nextPhase = PHASES[currentIndex + 1]

    // Log completed phase
    await prisma.prototypePhaseLog.create({
      data: {
        prototypeId: id,
        phase: proto.currentPhase,
        note: note ?? null,
      }
    })

    // Advance to next
    return prisma.prototype.update({
      where: { id },
      data: { currentPhase: nextPhase },
      include: { phases: true }
    })
  },

  async complete(id, note = null) {
    const proto = await prisma.prototype.findUnique({ where: { id } })
    if (!proto) throw new Error('Prototype not found')

    // Log final phase
    await prisma.prototypePhaseLog.create({
      data: {
        prototypeId: id,
        phase: 'QC',
        note: note ?? null,
      }
    })

    return prisma.prototype.update({
      where: { id },
      data: { currentPhase: 'QC' }
    })
  },

  async delete(id) {
    await prisma.prototype.delete({ where: { id } })
    return { message: 'Prototype deleted' }
  },

  async getProgress(id) {
    const proto = await prisma.prototype.findUnique({
      where: { id },
      include: { phases: true }
    })
    if (!proto) throw new Error('Prototype not found')

    const completedPhases = proto.phases.map(p => p.phase)
    const progress = Math.round((completedPhases.length / PHASES.length) * 100)

    return {
      currentPhase: proto.currentPhase,
      completedPhases,
      remainingPhases: PHASES.filter(p => !completedPhases.includes(p)),
      progress,
      isComplete: proto.currentPhase === 'QC' && completedPhases.length === PHASES.length,
    }
  }
}