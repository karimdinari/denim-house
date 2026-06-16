import { Router } from 'express'
import { absenceController } from '../controllers/absence.controller.js'
import { authenticate, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

router.use(authenticate)

// Absences
router.get('/',                absenceController.getAll)
router.get('/available',       absenceController.isAvailable)        // ?userId=&date=
router.get('/user/:userId',    absenceController.getByUser)
router.post('/',               absenceController.create)
router.patch('/:id/approve',   requireRole('MANAGER'), absenceController.approve)
router.patch('/:id/reject',    requireRole('MANAGER'), absenceController.reject)
router.delete('/:id',          requireRole('MANAGER'), absenceController.delete)

// Public Holidays
router.get('/holidays',        absenceController.getHolidays)        // ?country=
router.post('/holidays',       requireRole('MANAGER'), absenceController.createHoliday)
router.delete('/holidays/:id', requireRole('MANAGER'), absenceController.deleteHoliday)

export default router