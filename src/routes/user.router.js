import { Router } from 'express'
import { deleteUserController, deleteUsersWithTwoDaysOfInactivity, getAllUsers } from '../controllers/user.controller.js'

const router = Router()

router.get('/', getAllUsers)
router.delete('/', deleteUsersWithTwoDaysOfInactivity)
router.delete('/:id', deleteUserController)

export default router