import { Router } from 'express'
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from '../controllers/categoriesController'
import { categoryValidation } from '../validation/categoriesValidation'
import { runValidation } from '../validation/runValidation'
import { isAdmin, isLoggedIn } from '../middlewares/authentication'

const router = Router()

//GET --> get all categories
router.get('/', getAllCategories)
//GET --> get a single category by ID
router.get('/:id', getSingleCategory)
//POST --> create a category
router.post('/', isLoggedIn, isAdmin, categoryValidation, runValidation, createCategory)
//DELETE --> delete a single category by ID
router.delete('/:id', isLoggedIn, isAdmin, deleteCategory)
//PUT --> update a single category by ID
router.put('/:id', isLoggedIn, isAdmin, categoryValidation, runValidation, updateCategory)

export default router
