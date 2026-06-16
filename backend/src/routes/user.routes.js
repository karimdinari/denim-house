import { Router } from 'express'
import { userController } from '../controllers/user.controller.js'
import { authenticate, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

router.get('/',                        userController.getAll)
router.get('/:id',                     userController.getById)
router.get('/:id/workload',            userController.getWorkload)
router.get('/:id/success-rate',        userController.getSuccessRate)

// Manager only
router.put('/:id',    requireRole('MANAGER'), userController.update)
router.delete('/:id', requireRole('MANAGER'), userController.delete)

export default router