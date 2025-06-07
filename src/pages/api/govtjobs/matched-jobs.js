import dbConnect from '@/lib/dbConnect';
import { Job } from '@/lib/models/Job';
import { GovtJob } from '@/lib/models/GovtJob'; // Assuming this model exists
import { User } from '@/lib/models/User';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import jwt from 'jsonwebtoken';

export default catchAsync(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await dbConnect();

  const token = req.cookies.token;
          if (!token) {
              return res.status(401).json({
                  success: false,
                  message: "Please login to access this resource"
              });
          }
  
          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
          const user = await User.findById(decoded._id);
          if (!user) {
              return res.status(404).json({ success: false, message: 'User not found' });
          }

            const pref = user.preferences?.notifications_about;
            if (!pref) {
                return res.status(400).json({ success: false, message: 'Notification preferences not set' });
            }

            let jobs;

            if (pref === 'IT') {
                jobs = await Job.find({ category: 'IT' }).sort({ createdAt: -1 });
            } else if (pref === 'NON-IT') {
                jobs = await Job.find({ category: { $ne: 'IT' } }).sort({ createdAt: -1 });
            } else if (!['admissions', 'scholarships', 'internships', 'results'].includes(pref)) {
                jobs = await GovtJob.find({ notification_about: pref.toUpperCase() }).sort({ createdAt: -1 });
            } else {
                return res.status(400).json({ success: false, message: 'Invalid notification preference' });
            }

            res.status(200).json({
                success: true,
                jobs
            });
});
