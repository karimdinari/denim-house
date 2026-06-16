import { Router } from 'express'
import { alertController } from '../controllers/alert.controller.js'
import { authenticate, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

router.use(authenticate)

router.get('/',                 alertController.getAll)
router.patch('/:id/read',       alertController.markRead)
router.patch('/read-all',       alertController.markAllRead)
router.delete('/:id',           requireRole('MANAGER'), alertController.delete)

// Detectors — manager only
router.post('/detect/all',              requireRole('MANAGER'), alertController.runAll)
router.post('/detect/overloads',        requireRole('MANAGER'), alertController.detectOverloads)
router.post('/detect/deadlines',        requireRole('MANAGER'), alertController.detectCriticalDeadlines)
router.post('/detect/missing-skills',   requireRole('MANAGER'), alertController.detectMissingSkills)
router.post('/detect/bottlenecks',      requireRole('MANAGER'), alertController.detectBottlenecks)
router.post('/detect/cascade-delays',   requireRole('MANAGER'), alertController.detectCascadeDelays)
router.post('/detect/leave-conflicts',  requireRole('MANAGER'), alertController.detectLeaveConflicts)

export default router