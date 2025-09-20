const multer = require('multer');
const cloudinary = require('./cloudinary');

// Use disk storage for large files
const storage = multer.diskStorage({
  destination: './public',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
}).single('video');

const uploadVideoToCloudinary = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Multer error', error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No video uploaded' });
    }

    try {
      const result = await cloudinary.uploader.upload(req.file.path, { // Use file path
        resource_type: 'video',
        timeout: 60000, // 60-second timeout
        folder: 'vibeo-user-video',
        public_id: `vid_${Date.now()}_${req.file.originalname.split('.')[0]}`
      });

      // Delete temporary file
      const fs = require('fs');
      fs.unlinkSync(req.file.path);

      res.status(200).json({
        message: 'Upload successful',
        cloudinaryUrl: result.secure_url,
        cloudinaryPublicId: result.public_id
      });
    } catch (error) {
      console.error('Cloudinary error:', error);
      res.status(500).json({ message: 'Upload failed', error: error.message });
    }
  });
};

module.exports = { uploadVideoToCloudinary };