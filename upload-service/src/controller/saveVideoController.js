const mongoose = require('mongoose')
const Save = require('../models/Save')

const createSave = async (req, res, next, model) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { id } = req.params;
    const userId = req.id;

    if(!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const video = await model.findById(id).session(session);
    
    if (!video) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ 
        success: false, 
        message: 'Video not found' 
      });
    }

    // Check if already saved to prevent duplicates
    const existingSave = await Save.findOne({ videoId: id, userId }).session(session);
    if (existingSave) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Video already saved'
      });
    }

    const savedVideo = await Save.create([{ videoId: id, userId }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Video saved successfully',
      data: savedVideo[0]
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};


 module.exports = {createSave}
