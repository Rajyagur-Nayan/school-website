const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
// Initialize Google Auth
const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "../config/service_account.json"), // Adjust path if needed
    scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });

// The Google Drive Folder ID where you want to store the images
const FOLDER_ID = "1PSwZ3-ogwLts6aY5abvBgyNXn7BwwB66"; // IMPORTANT: Replace this

async function uploadFileToDriveAndGetUrl(fileObject) {
    if (!fileObject) {
        return null;
    }

    const { path: filePath, originalname, mimetype } = fileObject;

    try {
        const file = await drive.files.create({
            resource: {
                name: `${Date.now()}_${originalname}`, // Add timestamp to avoid name conflicts
                parents: [FOLDER_ID],
            },
            media: {
                mimeType: mimetype,
                body: fs.createReadStream(filePath),
            },
            fields: 'id',
        });

        const fileId = file.data.id;

        // Make the file publicly readable
        await drive.permissions.create({
            fileId: fileId,
            requestBody: { role: 'reader', type: 'anyone' },
        });

        // Construct the public URL
        const publicUrl = `https://drive.google.com/uc?id=${fileId}`;
        console.log(`☁️ File uploaded to Drive: ${publicUrl}`);
        return publicUrl;

    } catch (error) {
        console.error("❌ Error uploading to Google Drive:", error);
        // Throw the error so the main route handler can catch it
        throw new Error("Failed to upload file to Google Drive.");
    }
}

module.exports = { uploadFileToDriveAndGetUrl };
