import { moodboardService } from '../services/moodboard.service.js'

export const moodboardController = {

  async getAll(req, res) {
    try {
      const boards = await moodboardService.getAll()
      res.json(boards)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async getById(req, res) {
    try {
      const board = await moodboardService.getById(req.params.id)
      res.json(board)
    } catch (err) {
      const status = err.message === 'Mood board not found' ? 404 : 500
      res.status(status).json({ error: err.message })
    }
  },

  async create(req, res) {
    try {
      const board = await moodboardService.create(req.body)
      res.status(201).json(board)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async update(req, res) {
    try {
      const board = await moodboardService.update(req.params.id, req.body)
      res.json(board)
    } catch (err) {
      const status = err.message === 'Mood board not found' ? 404 : 400
      res.status(status).json({ error: err.message })
    }
  },

  async delete(req, res) {
    try {
      const result = await moodboardService.delete(req.params.id)
      res.json(result)
    } catch (err) {
      const status = err.message === 'Mood board not found' ? 404 : 400
      res.status(status).json({ error: err.message })
    }
  },

  // ── Colors ───────────────────────────────

  async addColor(req, res) {
    try {
      const { hex } = req.body
      const color = await moodboardService.addColor(req.params.id, hex)
      res.status(201).json(color)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async removeColor(req, res) {
    try {
      const result = await moodboardService.removeColor(req.params.colorId)
      res.json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  // ── Images ───────────────────────────────

  async addImage(req, res) {
    try {
      const image = await moodboardService.addImage(req.params.id, req.body)
      res.status(201).json(image)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async removeImage(req, res) {
    try {
      const result = await moodboardService.removeImage(req.params.imageId)
      res.json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },
}