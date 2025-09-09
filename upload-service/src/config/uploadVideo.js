const multer = require('multer')
const cloudinary = require('./cloudinary')
const fs = require('fs')
const fsPromise = require('fs').promises
const path = require('path')

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
       if(!fs.existsSync(path.join(__dirname, '..', '..', 'public'))) {
         await fsPromise.mkdir(path.join(__dirname, '..', '..', 'public'))
       }
       cb(null, 'public')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})


 const upload = multer({
    storage: storage,
    limits: {fileSize: 100 * 1024 * 1024},
 }).single('video')

const uploadVideoToCloudinary = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'No video was uploaded!'
    });
  }

  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          transformation: [{ width: 800, crop: 'limit' }],
          folder: 'vibeo-user-video',
          timeout: 120000,
        },
        async (error, result) => {
          try {
            await fsPromise.unlink(req.file.path);
            
            if (error) {
              console.error('Upload error:', error);
              return res.status(500).json({
                message: 'Error uploading video',
                error: error.message
              });
            }

            return res.status(200).json({
              message: 'Video uploaded successfully',
              cloudinaryUrl: result.secure_url,
              cloudinaryPublicId: result.public_id
            });
          } catch (cleanupError) {
            console.error('Cleanup error:', cleanupError);
            return res.status(500).json({
              message: 'Error during cleanup',
              error: cleanupError.message
            });
          }
        }
      );

      // Create read stream with error handling
      const readStream = fs.createReadStream(req.file.path);
      
      readStream.on('error', (error) => {
        console.error('Read stream error:', error);
        reject(error);
      });
      
      readStream.pipe(uploadStream);
    });

  } catch (error) {
    console.error('Upload error:', error);
    if (req.file?.path) {
      await fsPromise.unlink(req.file.path).catch(console.error);
    }
    return res.status(500).json({ 
      message: 'Error uploading video',
      error: error.message 
    });
  }
};

 module.exports = {
    uploadVideoToCloudinary,
    upload
 }








