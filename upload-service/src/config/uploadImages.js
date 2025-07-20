const path = require('path')
const cloudinary = require('./cloudinary')
const fs = require('fs')
const fsPromise = require('fs').promises
const multer = require('multer')
const sharp = require('sharp')

// Improved storage configuration with error handling
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const imagesDir = path.join(__dirname, '..', '..', 'images')
            if (!fs.existsSync(imagesDir)) {
                await fsPromise.mkdir(imagesDir, { recursive: true })
            }
            cb(null, imagesDir)
        } catch (err) {
            cb(err)
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

// Enhanced multer configuration
const uploadImage = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // Corrected syntax (10MB limit)
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Only JPEG, PNG, and WebP images are allowed!'), false)
        }
    }
}).single('image')

// Improved image compression with better error handling
const compressImage = async (filePath) => {
    try {
        const compressPath = path.join(
            path.dirname(filePath),
            path.basename(filePath, path.extname(filePath)) + '-compressed.webp'
        )

        await sharp(filePath)
            .resize({ width: 800, withoutEnlargement: true }) // Won't enlarge smaller images
            .webp({ 
                quality: 80,
                alphaQuality: 80,
                lossless: false
            })
            .toFile(compressPath)

        return compressPath
    } catch (error) {
        console.error('Compression error:', error)
        throw error
    }
}

// Enhanced upload function with better cleanup and error handling
const uploadImageToCloudinary = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No image file was uploaded.'
        })
    }

    let localImagePath = req.file.path
    let compressImagePath = null

    try {
        // Step 1: Compress the image
        compressImagePath = await compressImage(localImagePath)

        // Step 2: Upload to Cloudinary
        const cloudinaryResult = await cloudinary.uploader.upload(compressImagePath, {
            transformation: [{ 
                width: 800, 
                crop: 'limit',
                format: 'webp',
                quality: 'auto'
            }],
            folder: 'vibeo-user-images',
            resource_type: 'image'
        })

        // Step 3: Clean up files
        // await Promise.all([
        //     fsPromise.unlink(localImagePath).catch(console.error),
        //     fsPromise.unlink(compressImagePath).catch(console.error)
        // ])

        return res.status(200).json({
            message: 'Image uploaded successfully',
            cloudinaryUrl: cloudinaryResult.secure_url,
            cloudinaryPublicId: cloudinaryResult.public_id
        })

    } catch (error) {
        // Clean up any remaining files
        const cleanup = []
        if (localImagePath) cleanup.push(fsPromise.unlink(localImagePath).catch(console.error))
        if (compressImagePath) cleanup.push(fsPromise.unlink(compressImagePath).catch(console.error))
        await Promise.all(cleanup)

        console.error('Upload error:', error)
        return res.status(500).json({ 
            success: false,
            message: 'Failed to process and upload image',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

module.exports = {
    uploadImageToCloudinary,
    uploadImage
}