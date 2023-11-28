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
import { isLoggedIn } from '../middlewares/authentication'

const router = Router()

//GET --> get all categories
router.get('/', getAllCategories)
//GET --> get a single category by ID
router.get('/:id', getSingleCategory)
//POST --> create a category
router.post('/', isLoggedIn, categoryValidation, runValidation, createCategory)
//DELETE --> delete a single category by ID
router.delete('/:id', isLoggedIn, deleteCategory)
//PUT --> update a single category by ID
router.put('/:id', isLoggedIn, categoryValidation, runValidation, updateCategory)

export default router
