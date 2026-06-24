import { Router } from 'express'
import { taskController } from '../controllers/task.controller.js'
import { authenticate, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Utility routes (before /:id to avoid param conflicts)
router.get('/blocked', taskController.getBlocked)
router.get('/my', taskController.getMyTasks)

router.get('/',    taskController.getAll)
router.get('/:id', taskController.getById)

// Manager only — create, update, delete, assign
router.post('/',                          requireRole('MANAGER'), taskController.create)
router.put('/:id',                        requireRole('MANAGER'), taskController.update)
router.delete('/:id',                     requireRole('MANAGER'), taskController.delete)
router.post('/:id/assign',                requireRole('MANAGER'), taskController.assign)
router.get('/:id/cascade',                requireRole('MANAGER'), taskController.getCascadeChain)

// Members can update their own task status
router.patch('/:id/status', taskController.updateStatus)

export default router