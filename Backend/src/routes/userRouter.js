const express = require('express');
const userMiddleware = require('../middleware/userMiddleWare');
const User = require('../models/user');
const Submission = require('../models/submission');

const userRouter = express.Router();



userRouter.get('/profileName/:id',async(req,res)=>{
 try{
   const user = await User.findById(req.params.id).select('-password');
  //  console.log(user.firstName,user.lastName   );
    res.json({ firstName: user.firstName, lastName: user.lastName });

 }
 catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Error fetching profile' });
  }

})
userRouter.get('/profile/:id', async (req, res) => {
  try {
    
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// ✅ Update profile image (Cloudinary URL)
userRouter.put('/profile/image', async (req, res) => {
  try {
    const { profileImage } = req.body;
    if (!profileImage) return res.status(400).json({ message: 'Image URL is required' });

    await User.findByIdAndUpdate(req.userId, { profileImage });
    res.json({ message: 'Profile image updated' });
  } catch (err) {
    console.error('Error updating profile image:', err);
    res.status(500).json({ message: 'Error updating image' });
  }
});

//
// Update your heatmap route to use UTC dates for consistent comparison
userRouter.get('/heatmap',  async (req, res) => {
  try {
    const userId = req.result._id;

    const user = await User.findById(userId);  // ✅ Get the full user object

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oneYearAgo = new Date();
    oneYearAgo.setUTCFullYear(oneYearAgo.getUTCFullYear() - 1);
    oneYearAgo.setUTCHours(0, 0, 0, 0);

    const heatmap = {};
    const heatmapData = user.heatmapData || {};

    for (const [date, count] of heatmapData.entries?.() || Object.entries(heatmapData)) {
      try {
        const dateObj = new Date(`${date}T00:00:00Z`);
        if (dateObj >= oneYearAgo) {
          heatmap[date] = count;
        }
      } catch (e) {
        console.error(`Invalid date format: ${date}`, e);
      }
    }

    res.json(heatmap);
  } catch (err) {
    console.error('Error fetching heatmap data:', err);
    res.status(500).json({ message: 'Error fetching heatmap data' });
  }
});

// ✅ Get submission history
userRouter.get('/submissions',  async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.result._id })
      .populate('problemId', 'title')
      .sort({ createdAt: -1 });

      console.log(submissions);
      

    res.json(submissions);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ message: 'Error fetching submissions' });
  }
});

module.exports = userRouter;
