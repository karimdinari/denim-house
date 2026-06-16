import { alertService } from '../services/alert.service.js'

export const alertController = {

  async getAll(req, res) {
    try {
      // Managers see all alerts; members see only their own
      const userId = req.user.role === 'MANAGER' ? null : req.user.id
      const alerts = await alertService.getAll(userId)
      res.json(alerts)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async markRead(req, res) {
    try {
      const alert = await alertService.markRead(req.params.id)
      res.json(alert)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async markAllRead(req, res) {
    try {
      const result = await alertService.markAllRead(req.user.id)
      res.json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async delete(req, res) {
    try {
      const result = await alertService.delete(req.params.id)
      res.json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  // ── Detectors ────────────────────────────

  async runAll(req, res) {
    try {
      const result = await alertService.runAllDetectors()
      res.json(result)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async detectOverloads(req, res) {
    try {
      const alerts = await alertService.detectOverloads()
      res.json(alerts)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async detectCriticalDeadlines(req, res) {
    try {
      const alerts = await alertService.detectCriticalDeadlines()
      res.json(alerts)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async detectMissingSkills(req, res) {
    try {
      const alerts = await alertService.detectMissingSkills()
      res.json(alerts)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async detectBottlenecks(req, res) {
    try {
      const alerts = await alertService.detectBottlenecks()
      res.json(alerts)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async detectCascadeDelays(req, res) {
    try {
      const alerts = await alertService.detectCascadeDelays()
      res.json(alerts)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async detectLeaveConflicts(req, res) {
    try {
      const alerts = await alertService.detectLeaveConflicts()
      res.json(alerts)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },
}