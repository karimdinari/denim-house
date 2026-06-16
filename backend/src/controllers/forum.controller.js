import { forumService } from '../services/forum.service.js'

export const forumController = {

  // ── Posts ────────────────────────────────

  async getPosts(req, res) {
    try {
      const posts = await forumService.getPosts()
      res.json(posts)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async getPostById(req, res) {
    try {
      const post = await forumService.getPostById(req.params.id)
      res.json(post)
    } catch (err) {
      const status = err.message === 'Post not found' ? 404 : 500
      res.status(status).json({ error: err.message })
    }
  },

  async createPost(req, res) {
    try {
      const post = await forumService.createPost({
        authorId: req.user.id,
        ...req.body,
      })
      res.status(201).json(post)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async updatePost(req, res) {
    try {
      const post = await forumService.updatePost(req.params.id, req.body, req.user.id)
      res.json(post)
    } catch (err) {
      const status = err.message === 'Post not found' ? 404
        : err.message === 'Not authorized' ? 403 : 400
      res.status(status).json({ error: err.message })
    }
  },

  async deletePost(req, res) {
    try {
      const result = await forumService.deletePost(req.params.id, req.user.id, req.user.role)
      res.json(result)
    } catch (err) {
      const status = err.message === 'Post not found' ? 404
        : err.message === 'Not authorized' ? 403 : 400
      res.status(status).json({ error: err.message })
    }
  },

  async likePost(req, res) {
    try {
      const post = await forumService.likePost(req.params.id)
      res.json(post)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  // ── Comments ─────────────────────────────

  async createComment(req, res) {
    try {
      const comment = await forumService.createComment({
        postId: req.params.postId,
        authorId: req.user.id,
        ...req.body,
      })
      res.status(201).json(comment)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async deleteComment(req, res) {
    try {
      const result = await forumService.deleteComment(req.params.id, req.user.id, req.user.role)
      res.json(result)
    } catch (err) {
      const status = err.message === 'Comment not found' ? 404
        : err.message === 'Not authorized' ? 403 : 400
      res.status(status).json({ error: err.message })
    }
  },
}