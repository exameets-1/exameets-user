import dbConnect from '@/lib/dbConnect';
import  {Job} from '@/lib/models/Job';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export default catchAsync(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await dbConnect();
  const jobs = await Job.find()
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    jobs
  });
});