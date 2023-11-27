
import { NextFunction , Request} from 'express'


import ApiError from '../errors/ApiError'
import { IProduct, Product } from '../models/product'


export const findAllProduct = async (request: Request) => {
  const limit = Number(request.query.limit) || 1
  let page = Number(request.query.page) || 3
  const { rangeId } = request.query || { $gte: 0 }

  let priceFilter;
  if (priceFilter && typeof priceFilter !== 'number') {
    throw(ApiError.badRequest(400,'Invalid price value'))
  }
//filter by price
switch (rangeId) {
  case 'range0':
    priceFilter = {$gte: 0,$lte: Number.MAX_SAFE_INTEGER};
    break;
  case 'range1':
    priceFilter = { $gte: 0, $lte: 99 };
    break;
  case 'range2':
    priceFilter = {$gte: 100, $lte: 199 };
    break;
  case 'range3':
    priceFilter = { $gte: 200, $lte: 399 };
    break;
  case 'range4':
    priceFilter = { $gte: 400, $lte: 699 };
    break;
  case 'range5':
    priceFilter = {$gte: 1000, $lte: Number.MAX_SAFE_INTEGER };
    break;
  default:
    throw(ApiError.badRequest(400,'Invalid range price'))
}

  //how many have products
  const countPage = await Product.countDocuments()
  //total page
  const totalPage = Math.ceil(countPage / limit)
  if (page > totalPage) {
    page = totalPage
  }
  const skip = (page - 1) * limit
  const allProductOnPage: IProduct[] = await Product.find({ price: priceFilter })
    .populate('category')
    .skip(skip)
    .limit(limit)
    // .sort({price : -1})
    
    
  return {
    allProductOnPage,
    totalPage,
    currentPage: page,
  }
}


export const findProductById = async (id: string, next: NextFunction)=> {    
  const singleProduct = await Product.findOne({ _id: id })
  if (!singleProduct) {

    throw(ApiError.badRequest(404,`Product is not found with this id: ${id}`))

  }
  return singleProduct
}



export const findAndDeleted = async (id: string, next: NextFunction) => {
  const deleteSingleProduct = await Product.findOneAndDelete({ _id: id })
  if(!deleteSingleProduct) {
    throw(ApiError.badRequest(404,`Product is not found with this id: ${id}`))

  }
  return deleteSingleProduct
}



export const findIfProductExist = async (newInput: IProduct, next: NextFunction) => {
  const nameInput = newInput.name
  const productExist = await Product.exists({ name: nameInput })
  if (productExist) {
    throw(ApiError.badRequest(409,`Product already exist with this Name: ${nameInput}`))


  }
  return productExist
}

export const findAndUpdated = async (id: string, next: NextFunction, updatedProduct: Request) => {

  const productUpdated = await Product.findByIdAndUpdate( id , updatedProduct, { new: true ,runValidators: true})
  if(!productUpdated) {
  throw(ApiError.badRequest(404,`Product is not found with this id: ${id}`))

  }
  return productUpdated
}

// search products by name
export const searchProductsByName = async (name: string, next: NextFunction) => {
  const searchResult = await Product.find({
    $or: [{ name: { $regex: name } }],
  })

  if (searchResult.length === 0) {
    next(ApiError.badRequest(404, `No results found with the keyword ${name}`))
    return
  }
  return searchResult
}
