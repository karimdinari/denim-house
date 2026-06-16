import { Router } from 'express'
import { prototypeController } from '../controllers/prototype.controller.js'
import { authenticate, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

router.use(authenticate)

router.get('/',              prototypeController.getAll)
router.get('/:id',           prototypeController.getById)
router.get('/:id/progress',  prototypeController.getProgress)

router.post('/',                        requireRole('MANAGER'), prototypeController.create)
router.post('/:id/advance',             requireRole('MANAGER'), prototypeController.advancePhase)
router.post('/:id/complete',            requireRole('MANAGER'), prototypeController.complete)
router.delete('/:id',                   requireRole('MANAGER'), prototypeController.delete)

export default router