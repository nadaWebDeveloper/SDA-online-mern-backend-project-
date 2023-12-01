import { check } from 'express-validator'

export const userRegistrationValidation = [
  check('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name must not be empty')
    .isLength({ min: 4, max: 20 })
    .withMessage('First name must be at least 4 characters')
    .isLength({ max: 20 })
    .withMessage('First name must be less than 20 characters'),
  check('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name must not be empty')
    .isLength({ min: 4, max: 20 })
    .withMessage('Last name must be at least 4 characters')
    .isLength({ max: 20 })
    .withMessage('Last name must be less than 20 characters'),
  check('email')
    .trim()
    .notEmpty()
    .withMessage('Email must not be empty')
    .isEmail()
    .withMessage('Email is not a valid'),
  check('password')
    .trim()
    .notEmpty()
    .withMessage('Password must not be empty')
    .isLength({ min: 5 })
    .withMessage('password must be at least 5 characters'),
]

export const userLoginValidation = [
  check('email')
    .trim()
    .notEmpty()
    .withMessage('Email must not be empty')
    .isEmail()
    .withMessage('Email is not valid'),
  check('password')
    .trim()
    .notEmpty()
    .withMessage('Password must not be empty')
    .isLength({ min: 5 })
    .withMessage('password must be at least 5 characters'),
]
