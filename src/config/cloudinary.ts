import {v2 as cloudinary} from 'cloudinary';
import {dev} from '.'
          
 cloudinary.config({ 
  cloud_name: dev.cloudinary.cloudinaryName, 
  api_key: dev.cloudinary.cloudinaryAPIKey, 
  api_secret: dev.cloudinary.cloudinaryAPISecretKey 
});

export default cloudinary