import { absenceService } from '../services/absence.service.js'

export const absenceController = {

  async getAll(req, res) {
    try {
      const absences = await absenceService.getAll()
      res.json(absences)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async getByUser(req, res) {
    try {
      const absences = await absenceService.getByUser(req.params.userId)
      res.json(absences)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async create(req, res) {
    try {
      const absence = await absenceService.create(req.body)
      res.status(201).json(absence)
    } catch (err) {
      const status = err.message.includes('overlap') ? 409 : 400
      res.status(status).json({ error: err.message })
    }
  },

  async approve(req, res) {
    try {
      const absence = await absenceService.approve(req.params.id)
      res.json(absence)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async reject(req, res) {
    try {
      const absence = await absenceService.reject(req.params.id)
      res.json(absence)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async delete(req, res) {
    try {
      const result = await absenceService.delete(req.params.id)
      res.json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async isAvailable(req, res) {
    try {
      const { userId, date } = req.query
      const result = await absenceService.isAvailable(userId, date)
      res.json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  // ── Public Holidays ──────────────────────

  async getHolidays(req, res) {
    try {
      const { country } = req.query
      const holidays = await absenceService.getHolidays(country)
      res.json(holidays)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async createHoliday(req, res) {
    try {
      const holiday = await absenceService.createHoliday(req.body)
      res.status(201).json(holiday)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async deleteHoliday(req, res) {
    try {
      const result = await absenceService.deleteHoliday(req.params.id)
      res.json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },
}