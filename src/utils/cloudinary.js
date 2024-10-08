import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            // return  null;
            throw new Error("File path is required");
        }
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        }); 

        //file has  been uploaded successfull
        //console.log("file is uploaded succesfully",  response.url);
        fs.unlinkSync(localFilePath);
        return response;
        
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error.message);

        fs.unlinkSync(localFilePath) //remove the locally saved temp file as the upload op failed
        return null;
    }
}

export {uploadOnCloudinary}