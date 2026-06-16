import { authService } from '../services/auth.service.js'

export const authController = {

  async register(req, res) {
    try {
      const result = await authService.register(req.body)
      res.status(201).json(result)
    } catch (err) {
      const status = err.message === 'Email already in use' ? 409 : 400
      res.status(status).json({ error: err.message })
    }
  },

  async login(req, res) {
    try {
      const result = await authService.login(req.body)
      res.json(result)
    } catch (err) {
      res.status(401).json({ error: err.message })
    }
  },

  async me(req, res) {
    try {
      const user = await authService.me(req.user.id)
      res.json(user)
    } catch (err) {
      res.status(404).json({ error: err.message })
    }
  },
}