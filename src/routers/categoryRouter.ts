import { Router } from 'express'
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  searchCategories,
  updateCategory,
} from '../controllers/categoryController'

const router = Router()

//GET --> get all categories
router.get('/', getAllCategories)

//GET --> get a single category by ID
router.get('/:id', getSingleCategory)

//POST --> create a category
router.post('/', createCategory)

//DELETE --> delete a single category by ID
router.delete('/:id', deleteCategory)

//PUT --> update a single category by ID
router.put('/:id', updateCategory)

//GET --> search categories by name
router.get('/search/:name', searchCategories)

export default router
