import dbConnect from '@/lib/dbConnect';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { PreviousYear } from '@/lib/models/PreviousYear';

export default catchAsync(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await dbConnect();
  const pyqs = await PreviousYear.find()
    .sort({ _id: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    pyqs
  });
});