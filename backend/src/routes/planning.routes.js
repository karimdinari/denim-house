import { Router } from 'express'
import { planningController } from '../controllers/planning.controller.js'
import { authenticate, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

router.use(authenticate)

router.get('/week',       planningController.getWeek)       // ?userId=&weekStart=
router.get('/week/all',   planningController.getAllWeek)     // ?weekStart=
router.get('/daily-load', planningController.getDailyLoad)  // ?userId=&date=
router.get('/export/csv', planningController.exportCSV)     // ?weekStart=

// Manager only — create, update, delete blocks
router.post('/',    requireRole('MANAGER'), planningController.create)
router.put('/:id',  requireRole('MANAGER'), planningController.update)
router.delete('/:id', requireRole('MANAGER'), planningController.delete)

export default router