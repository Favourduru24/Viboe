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
    // Option 1: Upload using file path
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video", // Critical for video uploads
      transformation: [{ width: 800, crop: 'limit' }],
      folder: 'vibeo-user-video'
    });

    // Option 2: Or upload using file buffer
    // const fileBuffer = fs.readFileSync(req.file.path);
    // const result = await cloudinary.uploader.upload_stream({
    //   resource_type: "video",
    //   transformation: [{ width: 800, crop: 'limit' }],
    //   folder: 'vibeo-user-video'
    // }).end(fileBuffer);

    // Clean up: Delete the temporary file
    await fsPromise.unlink(req.file.path);

    // Here you would typically save to your database
    // Example: await VideoModel.create({ 
    //   url: result.secure_url,
    //   publicId: result.public_id,
    //   // other fields
    // });

    return res.status(200).json({
      message: 'Video uploaded successfully',
      cloudinaryUrl: result.secure_url,
      cloudinaryPublicId: result.public_id
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








