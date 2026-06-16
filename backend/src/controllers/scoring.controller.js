import { scoringService } from '../services/scoring.service.js'

export const scoringController = {

  async getTopCandidates(req, res) {
    try {
      const { taskId } = req.params
      const { date } = req.query
      const targetDate = date ? new Date(date) : new Date()
      const result = await scoringService.getTopCandidates(taskId, targetDate)
      res.json(result)
    } catch (err) {
      const status = err.message.startsWith('Task not found') ? 404 : 400
      res.status(status).json({ error: err.message })
    }
  },
}