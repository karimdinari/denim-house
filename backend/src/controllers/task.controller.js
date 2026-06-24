import { taskService } from '../services/task.service.js'

export const taskController = {

  async getAll(req, res) {
    try {
      const { status, priority, type, assignedUserId, family } = req.query
      const tasks = await taskService.getAll({ status, priority, type, assignedUserId, family })
      res.json(tasks)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async getById(req, res) {
    try {
      const task = await taskService.getById(req.params.id)
      res.json(task)
    } catch (err) {
      const status = err.message === 'Task not found' ? 404 : 500
      res.status(status).json({ error: err.message })
    }
  },

  async create(req, res) {
    try {
      const task = await taskService.create(req.body)
      res.status(201).json(task)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async update(req, res) {
    try {
      const task = await taskService.update(req.params.id, req.body)
      res.json(task)
    } catch (err) {
      const status = err.message === 'Task not found' ? 404 : 400
      res.status(status).json({ error: err.message })
    }
  },

  async updateStatus(req, res) {
    try {
      const { status } = req.body
      const task = await taskService.updateStatus(req.params.id, status, req.user.id)
      res.json(task)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async delete(req, res) {
    try {
      const result = await taskService.delete(req.params.id)
      res.json(result)
    } catch (err) {
      const status = err.message === 'Task not found' ? 404 : 400
      res.status(status).json({ error: err.message })
    }
  },

  async assign(req, res) {
    try {
      const { userId } = req.body
      const task = await taskService.assign(req.params.id, userId)
      res.json(task)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async getCascadeChain(req, res) {
    try {
      const chain = await taskService.getCascadeChain(req.params.id)
      res.json(chain)
    } catch (err) {
      const status = err.message === 'Task not found' ? 404 : 500
      res.status(status).json({ error: err.message })
    }
  },

  async getBlocked(req, res) {
    try {
      const tasks = await taskService.getBlocked()
      res.json(tasks)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async getMyTasks(req, res) {
    try {
      const tasks = await taskService.getMyTasks(req.user.id)
      res.json(tasks)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },
}