const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config(); // Make sure environment variables are loaded

// --- Configure Cloudinary ---
// This automatically uses the environment variables we set in the .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a file from the local server to Cloudinary and returns a secure URL.
 * @param {object} fileObject - The file object from Multer (req.file).
 * @returns {Promise<string|null>} The secure URL of the uploaded file, or null if no file is provided.
 */
async function uploadToCloudinary(fileObject) {
    if (!fileObject) {
        return null; // No file, so return null
    }

    const filePath = fileObject.path;

    try {
        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "school_management/students", // Organizes files in your Cloudinary account
            resource_type: "auto" // Automatically detect if it's an image, video, etc.
        });

        // IMPORTANT: Delete the temporary file from the local 'uploads' folder
        fs.unlinkSync(filePath);

        console.log(`☁️ File uploaded to Cloudinary: ${result.secure_url}`);
        return result.secure_url; // Return the public URL

    } catch (error) {
        console.error("❌ Error uploading to Cloudinary:", error);
        
        // Clean up the temp file even if the upload fails
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        throw new Error("Failed to upload file to Cloudinary.");
    }
}

module.exports = { uploadToCloudinary };
