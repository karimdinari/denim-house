import { planningService } from '../services/planning.service.js'

export const planningController = {

  async getWeek(req, res) {
    try {
      const { userId, weekStart } = req.query
      const blocks = await planningService.getWeek(userId, weekStart)
      res.json(blocks)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async getAllWeek(req, res) {
    try {
      const { weekStart } = req.query
      const blocks = await planningService.getAllWeek(weekStart)
      res.json(blocks)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async create(req, res) {
    try {
      const block = await planningService.create(req.body)
      res.status(201).json(block)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async update(req, res) {
    try {
      const block = await planningService.update(req.params.id, req.body)
      res.json(block)
    } catch (err) {
      const status = err.message === 'Planning block not found' ? 404 : 400
      res.status(status).json({ error: err.message })
    }
  },

  async delete(req, res) {
    try {
      const result = await planningService.delete(req.params.id)
      res.json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async getDailyLoad(req, res) {
    try {
      const { userId, date } = req.query
      const load = await planningService.getDailyLoad(userId, date)
      res.json(load)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async exportCSV(req, res) {
    try {
      const { weekStart } = req.query
      const csv = await planningService.exportCSV(weekStart)
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', `attachment; filename="planning-${weekStart}.csv"`)
      res.send(csv)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },
}