import { IFProduct, MProduct } from "../models/product"

export const FindAllProduct = async (page = 1, limit = 3) => {

    //how many have products
    const countPage = await MProduct.countDocuments()
    //total page
    const totalPage = Math.ceil(countPage / limit)
    if(page > totalPage){
       page = totalPage
    }
    const skip = (page - 1) * limit

// ! Add Query on side Find()
const AllProductOnPage: IFProduct[] = await MProduct.find()
.populate('Product').skip(skip).limit(limit)
return  { 
    AllProductOnPage,
   totalPage,
   currentPage: page

  }


}