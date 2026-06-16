import { prototypeService } from '../services/prototype.service.js'

export const prototypeController = {

  async getAll(req, res) {
    try {
      const prototypes = await prototypeService.getAll()
      res.json(prototypes)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async getById(req, res) {
    try {
      const prototype = await prototypeService.getById(req.params.id)
      res.json(prototype)
    } catch (err) {
      const status = err.message === 'Prototype not found' ? 404 : 500
      res.status(status).json({ error: err.message })
    }
  },

  async create(req, res) {
    try {
      const prototype = await prototypeService.create(req.body)
      res.status(201).json(prototype)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async advancePhase(req, res) {
    try {
      const { note } = req.body
      const prototype = await prototypeService.advancePhase(req.params.id, note)
      res.json(prototype)
    } catch (err) {
      const status = err.message === 'Prototype not found' ? 404 : 400
      res.status(status).json({ error: err.message })
    }
  },

  async complete(req, res) {
    try {
      const { note } = req.body
      const prototype = await prototypeService.complete(req.params.id, note)
      res.json(prototype)
    } catch (err) {
      const status = err.message === 'Prototype not found' ? 404 : 400
      res.status(status).json({ error: err.message })
    }
  },

  async getProgress(req, res) {
    try {
      const progress = await prototypeService.getProgress(req.params.id)
      res.json(progress)
    } catch (err) {
      const status = err.message === 'Prototype not found' ? 404 : 500
      res.status(status).json({ error: err.message })
    }
  },

  async delete(req, res) {
    try {
      const result = await prototypeService.delete(req.params.id)
      res.json(result)
    } catch (err) {
      const status = err.message === 'Prototype not found' ? 404 : 400
      res.status(status).json({ error: err.message })
    }
  },
}