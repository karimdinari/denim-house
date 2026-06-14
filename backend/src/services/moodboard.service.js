import { prisma } from '../lib/prisma.js'

export const moodboardService = {

  async getAll() {
    return prisma.moodBoard.findMany({
      include: {
        colors: true,
        images: true,
        _count: { select: { images: true, colors: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  async getById(id) {
    const board = await prisma.moodBoard.findUnique({
      where: { id },
      include: { colors: true, images: true }
    })
    if (!board) throw new Error('Mood board not found')
    return board
  },

  async create({ title, collection, colors = [], images = [] }) {
    return prisma.moodBoard.create({
      data: {
        title,
        collection: collection ?? null,
        colors: { create: colors.map(hex => ({ hex })) },
        images: { create: images.map(i => ({ url: i.url, caption: i.caption ?? null })) },
      },
      include: { colors: true, images: true }
    })
  },

  async update(id, { title, collection }) {
    return prisma.moodBoard.update({
      where: { id },
      data: { title, collection }
    })
  },

  async delete(id) {
    await prisma.moodBoard.delete({ where: { id } })
    return { message: 'Mood board deleted' }
  },

  async addColor(moodBoardId, hex) {
    return prisma.moodBoardColor.create({
      data: { moodBoardId, hex }
    })
  },

  async removeColor(id) {
    await prisma.moodBoardColor.delete({ where: { id } })
    return { message: 'Color removed' }
  },

  async addImage(moodBoardId, { url, caption }) {
    return prisma.moodBoardImage.create({
      data: { moodBoardId, url, caption: caption ?? null }
    })
  },

  async removeImage(id) {
    await prisma.moodBoardImage.delete({ where: { id } })
    return { message: 'Image removed' }
  }
}