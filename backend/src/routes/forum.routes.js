import { Router } from 'express'
import { forumController } from '../controllers/forum.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = Router()

router.use(authenticate)

// Posts
router.get('/',                       forumController.getPosts)
router.get('/:id',                    forumController.getPostById)
router.post('/',                      forumController.createPost)
router.put('/:id',                    forumController.updatePost)
router.delete('/:id',                 forumController.deletePost)
router.post('/:id/like',              forumController.likePost)

// Comments
router.post('/:postId/comments',      forumController.createComment)
router.delete('/comments/:id',        forumController.deleteComment)

export default router