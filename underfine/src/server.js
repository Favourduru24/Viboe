 const express = require('express')
 const app = express()
 const Port = 3000


  //app.use('/', require('./router/uploadShortRoutes'))
  app.get('/', (req, res, next) => {
  setTimeout(() => {
    try {
      throw new Error('BROKEN')
    } catch (err) {
      next(err)
    }
  }, 6000)
})

 app.listen(Port, () => {
    console.log(`Server running on port ${Port}`)
 })


 const videoSchema = new mongoose.Schema({
  title: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  uploadDate: { type: Date, default: Date.now },
  engagementScore: { type: Number, default: 0 } // Calculated field
});

function calculateEngagement(video) {
  const hoursSinceUpload = (Date.now() - video.uploadDate) / (1000 * 60 * 60);
  const recencyFactor = Math.max(0, 1 - (hoursSinceUpload / 72)); // 72-hour window
  
  return (
    (video.views * 0.5) +
    (video.likes * 2) +
    (video.comments * 3) +
    (video.shares * 4)
  ) * recencyFactor;
}

router.get('/trending', async (req, res) => {
  try {
    // Update engagement scores first
    await Video.updateMany({}, [
      { $set: { engagementScore: calculateEngagement("$$ROOT") } }
    ]);
    
    const trendingVideos = await Video.find()
      .sort({ engagementScore: -1 })
      .limit(20);
      
    res.json(trendingVideos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});