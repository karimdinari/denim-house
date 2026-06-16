import { userService } from '../services/user.service.js'

export const userController = {

  async getAll(req, res) {
    try {
      const users = await userService.getAll()
      res.json(users)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async getById(req, res) {
    try {
      const user = await userService.getById(req.params.id)
      res.json(user)
    } catch (err) {
      const status = err.message === 'User not found' ? 404 : 500
      res.status(status).json({ error: err.message })
    }
  },

  async update(req, res) {
    try {
      const user = await userService.update(req.params.id, req.body)
      res.json(user)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async delete(req, res) {
    try {
      const result = await userService.delete(req.params.id)
      res.json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async getWorkload(req, res) {
    try {
      const workload = await userService.getWorkload(req.params.id)
      res.json(workload)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async getSuccessRate(req, res) {
    try {
      const stats = await userService.getSuccessRate(req.params.id)
      res.json(stats)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },
}