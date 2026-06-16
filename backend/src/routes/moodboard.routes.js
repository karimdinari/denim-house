import { Router } from 'express'
import { moodboardController } from '../controllers/moodboard.controller.js'
import { authenticate, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

router.use(authenticate)

// Boards
router.get('/',    moodboardController.getAll)
router.get('/:id', moodboardController.getById)
router.post('/',               requireRole('MANAGER'), moodboardController.create)
router.put('/:id',             requireRole('MANAGER'), moodboardController.update)
router.delete('/:id',          requireRole('MANAGER'), moodboardController.delete)

// Colors
router.post('/:id/colors',              requireRole('MANAGER'), moodboardController.addColor)
router.delete('/:id/colors/:colorId',   requireRole('MANAGER'), moodboardController.removeColor)

// Images
router.post('/:id/images',              requireRole('MANAGER'), moodboardController.addImage)
router.delete('/:id/images/:imageId',   requireRole('MANAGER'), moodboardController.removeImage)

export default router