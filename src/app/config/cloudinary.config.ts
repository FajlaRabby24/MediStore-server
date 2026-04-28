import { v2 as cloudinary } from "cloudinary";
import { config } from ".";

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

export const cloudinaryUpload = cloudinary;

export async function deleteFromCloudinary(
  secureUrl: string,
  resourceType: string = "image",
) {
  // Remove everything up to and including "/upload/"
  const uploadIndex = secureUrl.indexOf("/upload/");
  if (uploadIndex === -1) throw new Error("Invalid Cloudinary URL");
  const afterUpload = secureUrl.slice(uploadIndex + "/upload/".length);
  // Remove optional version segment (e.g., "v1234567890/")
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");
  // Remove file extension
  const publicId = withoutVersion.replace(/\.[^/.]+$/, "");

  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}
