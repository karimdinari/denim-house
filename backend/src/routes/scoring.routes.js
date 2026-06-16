import { Router } from 'express'
import { scoringController } from '../controllers/scoring.controller.js'
import { authenticate, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

router.use(authenticate)

// Manager only — scoring is used when assigning tasks
router.get('/tasks/:taskId/candidates', requireRole('MANAGER'), scoringController.getTopCandidates)

export default router