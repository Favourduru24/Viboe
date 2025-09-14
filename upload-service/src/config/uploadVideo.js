const multer = require('multer');
const cloudinary = require('./cloudinary');

// Configure multer to use memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
}).single('video');

const uploadVideoToCloudinary = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'No video was uploaded!'
    });
  }

  try {
    // Convert buffer to a data URI for Cloudinary upload
    const dataURI = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    // Upload directly to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "video",
      transformation: [{ width: 800, crop: 'limit' }],
      folder: 'vibeo-user-video',
      timeout: 120000,
      // Maintain similar naming convention as before
      public_id: `vid_${Date.now()}_${req.file.originalname.replace(/\.[^/.]+$/, "")}`
    });

    return res.status(200).json({
      message: 'Video uploaded successfully',
      cloudinaryUrl: result.secure_url,
      cloudinaryPublicId: result.public_id
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      message: 'Error uploading video',
      error: error.message 
    });
  }
};

module.exports = {
  uploadVideoToCloudinary,
  upload
};