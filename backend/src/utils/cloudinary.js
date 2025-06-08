import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name:'dqvqvvwc8',
  api_key:'749146838886466',
  api_secret:'-L_TLr1SwbtjDrRVcX5SljGVn_M',
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file has been uploaded
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
    console.log(error)
    console.log({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    return null;
  }
};

const deleteFromCloudinary = async (publicId, resource_type) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId, { resource_type: resource_type })
    console.log("File deleted successfully", response)
    return response;
  } catch (error) {
    console.log(error)
    return null;
  }
}

export { uploadOnCloudinary, deleteFromCloudinary }
