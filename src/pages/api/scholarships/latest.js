import dbConnect from '@/lib/dbConnect';
import  {Scholarship} from '@/lib/models/Scholarship';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export default catchAsync(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await dbConnect();
  const scholarships = await Scholarship.find()
    .sort({ _id: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    scholarships
  });
});