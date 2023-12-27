import cloudinary from '../config/cloudinary'
import ApiError from '../errors/ApiError'


export const uploadToCloudinary = async (image: string , folderName: string): Promise<string> => {
    const response = await cloudinary.uploader.upload(image,
        {
          folder: folderName
        })
        return response.secure_url
}

export const valueWithOutExtension = async (imageUrl : string) :Promise<string> => {
    //split the url by slashes to get an array path segments
    const pathSegments = imageUrl.split('/')
  //get the last segment
    const lastSegments = pathSegments[pathSegments.length - 1]
    const spplex = lastSegments.split('.')
    const lastExtension = spplex[spplex.length - 1]
    //remove the file extension (.jpg) from the last segment .png
      const valueWithOutExtension = lastSegments.replace(`.${lastExtension}` , '')

return valueWithOutExtension
}

export const deleteImageFromCloudinary = async (publicID: string):Promise<void> => {
    try {
        const response = await cloudinary.uploader.destroy(publicID)
        if(response.result !== 'ok'){
            console.log(response.result);
            throw ApiError.badRequest(
                  400,
                  `Image was not deleted from cloudinary`
                )  
        }
        if (response.result === "ok"){
            throw ApiError.badRequest(
                200,
                `Image is delete from cloudinary"`
              )  
        }
        return response

    } catch (error) {
        throw error
    }
}