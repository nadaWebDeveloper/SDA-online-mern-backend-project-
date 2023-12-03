import { check } from 'express-validator'

export const orderValidation = [
  check('products').trim().notEmpty().withMessage('At least 1 product must be added'),
  check('products.*.product').trim().notEmpty().withMessage('product id must be added'),
  check('products.*.quantity')
    .trim()
    .notEmpty()
    .withMessage('Product quantity must be added')
    .isInt()
    .withMessage('Quantity must be non-decimal number')
    .default(1),
  check('payment').trim().notEmpty(),
  check('payment.*.method')
    .isIn(['cash-on-delivery', 'credit-card', 'stc-pay'])
    .default('credit-card'),
  check('payment.*.totalAmount').default(0),
  check('user').trim().notEmpty().withMessage('The user id related to this order is required'),
  check('status')
    .isIn(['pending', 'shipping', 'shipped', 'delivered', 'canceled'])
    .default('pending'),
]
